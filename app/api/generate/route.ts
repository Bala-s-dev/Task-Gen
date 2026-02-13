import { NextResponse } from 'next/server';
import { SpecSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    // Rate limit (5 req/min per IP)
    const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';

    const { success } = await rateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests. Try again soon.' },
        { status: 429 },
      );
    }

    // Parse + Validate Input
    const body = await req.json();
    const parsed = SpecSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { goal, users, constraints, risks, template } = parsed.data;

    // Call OpenAI (server-side)
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

Return JSON only:
{
 "stories": [...],
 "groups": [
   { "title": "Frontend", "tasks": [...] }
 ]
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    const raw = completion.choices[0].message.content;

    if (!raw) {
      return NextResponse.json(
        { error: 'LLM returned empty output.' },
        { status: 500 },
      );
    }

    const generated = JSON.parse(raw);

    // Store Spec in DB
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
