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

  // ✅ Extract IDs safely for SortableContext
  const taskIds = group.tasks.map((t: any) =>
    typeof t === 'string' ? t : t.id,
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-80 flex-shrink-0 flex flex-col bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden"
    >
      <div
        {...attributes}
        {...listeners}
        className="p-4 bg-gray-900 border-b border-gray-800 cursor-grab active:cursor-grabbing hover:bg-gray-800/80 transition"
      >
        <h3 className="font-bold text-gray-200 flex justify-between items-center">
          {group.title}
          <span className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">
            {group.tasks.length}
          </span>
        </h3>
      </div>

      <div className="p-3 flex-1 space-y-2 min-h-[100px]">
        {/* ✅ Pass IDs to SortableContext */}
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {group.tasks.map((task: any) => (
            <SortableTask
              key={typeof task === 'string' ? task : task.id}
              id={typeof task === 'string' ? task : task.id}
              task={task}
              onEdit={(val: any) => {
                const newTasks = [...group.tasks];
                // Find index based on ID or string match
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
          <div className="text-center py-8 text-sm text-gray-600 border-2 border-dashed border-gray-800 rounded-xl">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
