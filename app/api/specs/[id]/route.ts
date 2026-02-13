import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // ✅ Fix for Next.js 15
) {
  try {
    const { id } = await params;

    const spec = await prisma.spec.findUnique({
      where: { id },
      include: {
        stories: {
          orderBy: { content: 'asc' }, // Or createdAt if you add it
        },
        taskGroups: {
          include: {
            tasks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!spec) {
      return NextResponse.json({ error: 'Spec not found' }, { status: 404 });
    }

    // Return the raw objects now, not just strings
    const output = {
      stories: spec.stories,
      groups: spec.taskGroups.map((g) => ({
        id: g.id,
        title: g.title,
        tasks: g.tasks, // Returns full task objects (id, content, isCompleted, priority)
      })),
    };

    return NextResponse.json({
      specId: spec.id,
      output,
    });
  } catch (err) {
    console.error('SPEC LOAD ERROR:', err);
    return NextResponse.json({ error: 'Failed to load spec' }, { status: 500 });
  }
}
