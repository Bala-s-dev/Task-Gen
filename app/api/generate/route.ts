import { NextResponse } from 'next/server';
import { SpecSchema } from '@/lib/validators';
import { prisma } from '@/lib/prisma';
import { rateLimit } from '@/lib/rateLimit';
import { gemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    // Rate Limit
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

    // Gemini Prompt
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

Return JSON ONLY in this exact format:

{
  "stories": ["..."],
  "groups": [
    {
      "title": "Frontend",
      "tasks": ["...", "..."]
    }
  ]
}
`;

    // Gemini Model Call
    const model = gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    const result = await model.generateContent(prompt);

    const raw = result.response.text();

    if (!raw) {
      return NextResponse.json(
        { error: 'Gemini returned empty output.' },
        { status: 500 },
      );
    }

    // Parse JSON safely
    let generated;
    try {
      generated = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: 'Gemini returned invalid JSON. Try again.' },
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

    // Keep last 5 specs only
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
