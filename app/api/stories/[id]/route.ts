import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.story.update({
      where: { id },
      data: { isCompleted: body.isCompleted },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 },
    );
  }
}
