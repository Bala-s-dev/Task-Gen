'use client';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SortableTask from './SortableTask';

export default function TaskGroup({ group, id, onUpdate }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, data: { type: 'group' } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const taskIds = group.tasks.map((t: any) =>
    typeof t === 'string' ? t : t.id,
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-80 flex-shrink-0 flex flex-col bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden shadow-sm"
    >
      <div
        {...attributes}
        {...listeners}
        className="p-5 bg-gray-900/80 border-b border-gray-800 cursor-grab active:cursor-grabbing hover:bg-gray-800/50 transition-colors"
      >
        <h3 className="font-bold text-gray-100 flex justify-between items-center text-sm uppercase tracking-wider">
          {group.title}
          <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
            {group.tasks.length}
          </span>
        </h3>
      </div>

      <div className="p-4 flex-1 space-y-3 min-h-[150px] bg-gray-950/20">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {group.tasks.map((task: any) => (
            <SortableTask
              key={typeof task === 'string' ? task : task.id}
              id={typeof task === 'string' ? task : task.id}
              task={task}
              onEdit={(val: any) => {
                const newTasks = [...group.tasks];
                const idx = newTasks.findIndex(
                  (t) =>
                    (typeof t === 'string' ? t : t.id) ===
                    (typeof task === 'string' ? task : task.id),
                );
                newTasks[idx] = val;
                onUpdate({ ...group, tasks: newTasks });
              }}
            />
          ))}
        </SortableContext>

        {group.tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-xs text-gray-600 border-2 border-dashed border-gray-800/50 rounded-xl bg-gray-900/20">
            <p>Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
