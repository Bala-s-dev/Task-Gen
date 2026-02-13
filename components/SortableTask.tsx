'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';

export default function SortableTask({
  id,
  task,
  onEdit,
}: {
  id: string;
  task: any;
  onEdit: (val: any) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [content, setContent] = useState(task.content);
  const [completed, setCompleted] = useState(task.isCompleted);

  const toggleComplete = async () => {
    const newState = !completed;
    setCompleted(newState);
    onEdit({ ...task, isCompleted: newState });
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted: newState }),
    });
  };

  const handleBlur = async () => {
    if (content !== task.content) {
      onEdit({ ...task, content });
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      });
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group flex items-start gap-3 p-4 rounded-xl border transition-all duration-200
        ${
          completed
            ? 'bg-gray-900/30 border-gray-800 opacity-60'
            : 'bg-gray-800/50 border-gray-700/50 hover:border-blue-500/40 hover:bg-gray-800 shadow-sm'
        }
      `}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-1.5 cursor-grab active:cursor-grabbing p-1 -ml-2 rounded hover:bg-gray-700/50 transition-colors"
      >
        <GripVertical className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400" />
      </button>

      <button
        onClick={toggleComplete}
        className="mt-1 text-gray-500 hover:text-blue-400 transition-colors transform active:scale-90"
      >
        {completed ? (
          <CheckCircle2 size={18} className="text-emerald-500" />
        ) : (
          <Circle size={18} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          rows={1}
          className={`
            w-full bg-transparent outline-none resize-none overflow-hidden leading-snug text-sm
            ${completed ? 'line-through text-gray-500' : 'text-gray-200 focus:text-white'}
          `}
          style={{ minHeight: '20px' }}
        />

        <div className="flex items-center gap-2 mt-2">
          <span
            className={`
             text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md border
             ${
               task.priority === 'high'
                 ? 'bg-red-500/10 text-red-400 border-red-500/20'
                 : task.priority === 'low'
                   ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                   : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
             }
           `}
          >
            {task.priority || 'medium'}
          </span>
        </div>
      </div>
    </div>
  );
}
