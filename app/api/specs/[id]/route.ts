import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // ✅ unwrap params correctly (Next.js 16)
    const { id } = await context.params;

    const spec = await prisma.spec.findUnique({
      where: { id },
      include: {
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

    const output = {
      stories: [],
      groups: spec.taskGroups.map((g) => ({
        title: g.title,
        tasks: g.tasks.map((t) => t.content),
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
