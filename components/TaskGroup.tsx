'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import SortableTask from './SortableTask';
import { useState } from 'react';

export default function TaskGroup({
  group,
  onUpdate,
}: {
  group: any;
  onUpdate: (g: any) => void;
}) {
  const [tasks, setTasks] = useState(group.tasks);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t === active.id);
    const newIndex = tasks.findIndex((t) => t === over.id);

    const newTasks = arrayMove(tasks, oldIndex, newIndex);

    setTasks(newTasks);
    onUpdate({ ...group, tasks: newTasks });
  }

  return (
    <div className="p-5 rounded-2xl bg-gray-900 shadow-md">
      <h3 className="font-semibold text-lg mb-3">{group.title}</h3>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map((task: any) => (
              <SortableTask
                key={task}
                id={task}
                task={task}
                onEdit={(val) => {
                  const copy = [...tasks];
                  const idx = copy.indexOf(task);
                  copy[idx] = val;
                  setTasks(copy);
                  onUpdate({ ...group, tasks: copy });
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
