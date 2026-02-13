import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { openai } from '@/lib/openai';

export async function GET() {
  try {
    // DB Check
    await prisma.spec.count();

    // LLM Check (tiny request)
    await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5,
    });

    return NextResponse.json({
      backend: 'healthy',
      database: 'connected',
      llm: 'responding',
    });
  } catch (err) {
    return NextResponse.json(
      {
        backend: 'unhealthy',
        error: 'Service failure',
      },
      { status: 500 },
    );
  }
}
