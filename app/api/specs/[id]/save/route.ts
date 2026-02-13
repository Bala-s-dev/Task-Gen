import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const { groups, stories } = body;

    // ✅ Delete old
    await prisma.story.deleteMany({ where: { specId: id } });
    await prisma.taskGroup.deleteMany({ where: { specId: id } });

    // ✅ Recreate stories
    for (let i = 0; i < stories.length; i++) {
      await prisma.story.create({
        data: {
          content: stories[i],
          order: i,
          specId: id,
        },
      });
    }

    // ✅ Recreate groups/tasks
    for (const group of groups) {
      const createdGroup = await prisma.taskGroup.create({
        data: { title: group.title, specId: id },
      });

      for (let i = 0; i < group.tasks.length; i++) {
        await prisma.task.create({
          data: {
            content: group.tasks[i],
            order: i,
            groupId: createdGroup.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('SAVE ERROR:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
