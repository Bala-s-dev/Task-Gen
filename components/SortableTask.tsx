'use client';

import { useState } from 'react';

export default function SortableTask({
  task,
  onEdit,
}: {
  task: string;
  onEdit: (val: string) => void;
}) {
  const [value, setValue] = useState(task);

  return (
    <input
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onEdit(e.target.value);
      }}
      className="w-full p-2 rounded-lg bg-gray-800 text-gray-200"
    />
  );
}
