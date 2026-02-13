import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { groq, GROQ_MODEL } from '@/lib/groq';

export async function GET() {
  try {
    // DB Check
    await prisma.spec.count();

    // Groq Check
    await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5,
    });

    return NextResponse.json({
      backend: 'healthy',
      database: 'connected',
      llm: 'groq responding',
    });
  } catch {
    return NextResponse.json(
      {
        backend: 'unhealthy',
        error: 'Service failure',
      },
      { status: 500 },
    );
  }
}
