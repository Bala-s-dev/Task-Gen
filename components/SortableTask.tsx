'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { useState } from 'react';

export default function SortableTask({
  id,
  task,
  onEdit,
}: {
  id: string;
  task: string;
  onEdit: (val: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [value, setValue] = useState(task);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-gray-800 p-2 rounded-lg"
    >
      <button {...attributes} {...listeners}>
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onEdit(e.target.value);
        }}
        className="flex-1 bg-transparent outline-none text-gray-200"
      />
    </div>
  );
}
