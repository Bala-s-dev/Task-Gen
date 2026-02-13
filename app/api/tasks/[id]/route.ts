import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(body.isCompleted !== undefined && {
          isCompleted: body.isCompleted,
        }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.priority !== undefined && { priority: body.priority }),
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 },
    );
  }
}
