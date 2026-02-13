import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { gemini } from '@/lib/gemini';

export async function GET() {
  try {
    // DB Check
    await prisma.spec.count();

    // Gemini Check
    const model = gemini.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });

    await model.generateContent('Say OK');

    return NextResponse.json({
      backend: 'healthy',
      database: 'connected',
      llm: 'gemini responding',
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
