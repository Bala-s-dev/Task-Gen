import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const specs = await prisma.spec.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    return NextResponse.json(specs);
  } catch (err) {
    console.error('HISTORY ERROR:', err);

    // ✅ Return empty array instead of object
    return NextResponse.json([]);
  }
}
