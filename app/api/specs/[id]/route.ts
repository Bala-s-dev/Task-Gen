import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const spec = await prisma.spec.findUnique({
      where: { id },
      include: {
        stories: { orderBy: { order: 'asc' } },
        taskGroups: {
          include: {
            tasks: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    if (!spec) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({
      specId: spec.id,
      output: {
        stories: spec.stories.map((s) => s.content),
        groups: spec.taskGroups.map((g) => ({
          title: g.title,
          tasks: g.tasks.map((t) => t.content),
        })),
      },
    });
  } catch (err) {
    console.error('LOAD ERROR:', err);
    return NextResponse.json({ error: 'Failed to load spec' }, { status: 500 });
  }
}
