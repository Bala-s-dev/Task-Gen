'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
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

  return (
    <div className="p-5 rounded-2xl bg-gray-900 shadow-md">
      <h3 className="font-semibold text-lg mb-3">{group.title}</h3>

      <DndContext collisionDetection={closestCenter}>
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {tasks.map((task: any, idx: number) => (
              <SortableTask
                key={idx}
                task={task}
                onEdit={(val) => {
                  const copy = [...tasks];
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
