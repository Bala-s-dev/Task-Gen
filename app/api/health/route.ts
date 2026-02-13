// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { groq, GROQ_MODEL } from '@/lib/groq';

export async function GET() {
  try {
    // 1. Database Check: Try to count records in the Spec table
    await prisma.spec.count();

    // 2. LLM Engine Check: Send a minimal test prompt to Groq
    await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: 'Say OK' }],
      max_tokens: 5,
    });

    return NextResponse.json({
      backend: 'ok',
      database: 'ok',
      llm: 'ok',
    });
  } catch (error) {
    console.error('Health Check Error:', error);
    return NextResponse.json(
      {
        backend: 'error',
        database: 'error',
        llm: 'error',
        message: 'One or more services are unreachable',
      },
      { status: 500 }
    );
  }
}