'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, CheckCircle2, Circle } from 'lucide-react';
import { useState } from 'react';
import { debounce } from '@/lib/rateLimit'; // Or use simple timeout

export default function SortableTask({
  id,
  task,
  onEdit,
}: {
  id: string;
  task: any; // Now an object, not a string
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

  // Handle Checkbox Click
  const toggleComplete = async () => {
    const newState = !completed;
    setCompleted(newState);

    // Optimistic UI update
    onEdit({ ...task, isCompleted: newState });

    // API Call
    await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isCompleted: newState }),
    });
  };

  // Handle Text Edit (Debounced save recommended in real app)
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
        group flex items-start gap-2 p-3 rounded-lg border transition-all
        ${
          completed
            ? 'bg-gray-900/50 border-gray-800 opacity-60'
            : 'bg-gray-800 border-gray-700 hover:border-blue-500/30'
        }
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
      </button>

      {/* Checkbox */}
      <button
        onClick={toggleComplete}
        className="mt-1 text-gray-500 hover:text-blue-400 transition"
      >
        {completed ? (
          <CheckCircle2 size={16} className="text-green-500" />
        ) : (
          <Circle size={16} />
        )}
      </button>

      {/* Content Input */}
      <div className="flex-1 min-w-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          rows={1}
          className={`
            w-full bg-transparent outline-none resize-none overflow-hidden leading-relaxed
            ${completed ? 'line-through text-gray-500' : 'text-gray-200'}
          `}
          style={{ minHeight: '24px' }}
        />

        {/* Priority Badge (Optional Visual) */}
        <div className="flex gap-2 mt-1">
          <span
            className={`
             text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border
             ${
               task.priority === 'high'
                 ? 'bg-red-500/10 text-red-400 border-red-500/20'
                 : task.priority === 'low'
                   ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                   : 'bg-gray-700 text-gray-400 border-gray-600'
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
