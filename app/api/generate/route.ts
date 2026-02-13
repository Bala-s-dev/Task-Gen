import { NextResponse } from 'next/server';
import { SpecSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rateLimit';
import { groq, GROQ_MODEL } from '@/lib/groq';

export async function POST(req: Request) {
  try {
    // Rate Limit (safe fallback works locally)
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
    const { success } = await rateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Try again soon.' },
        { status: 429 },
      );
    }

    // Validate Input
    const body = await req.json();
    const parsed = SpecSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { goal, users, constraints, risks, template } = parsed.data;

    // Prompt
    const prompt = `
You are a senior product + engineering planner.

Generate:
1. 5 user stories
2. Engineering tasks grouped into:
   - Frontend
   - Backend
   - Database
   - Testing
   - Deployment

Spec:
Goal: ${goal}
Users: ${users}
Constraints: ${constraints}
Risks: ${risks ?? 'None'}
Template: ${template}

Return JSON ONLY:

{
  "stories": ["..."],
  "groups": [
    { "title": "Frontend", "tasks": ["...", "..."] }
  ]
}
`;

    // Groq LLM Call
    const chat = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    const raw = chat.choices[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: 'LLM returned empty output.' },
        { status: 500 },
      );
    }

    // Clean JSON
    const cleaned = raw.replace(/```json|```/g, '').trim();

    let generated;
    try {
      generated = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'Groq returned invalid JSON. Try again.' },
        { status: 500 },
      );
    }

    // Save Spec
    const spec = await prisma.spec.create({
      data: {
        goal,
        users,
        constraints,
        risks,
        template,
      },
    });

    // Keep only last 5 specs
    const count = await prisma.spec.count();
    if (count > 5) {
      const oldest = await prisma.spec.findFirst({
        orderBy: { createdAt: 'asc' },
      });

      if (oldest) {
        await prisma.spec.delete({ where: { id: oldest.id } });
      }
    }

    return NextResponse.json({
      specId: spec.id,
      output: generated,
    });
  } catch (err) {
    console.error('GENERATE ERROR:', err);

    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    );
  }
}
