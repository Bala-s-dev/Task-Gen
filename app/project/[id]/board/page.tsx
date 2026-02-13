'use client';

import { useEffect, useState, use } from 'react'; // ✅ Import use
import TaskBoard from '@/components/TaskBoard';

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Unwrap params
  const { id } = use(params);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/specs/${id}`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  if (!data) return <div className="text-gray-500">Loading board...</div>;

  return (
    <div className="h-full flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          Engineering Tasks
        </h1>
        <p className="text-gray-400">
          Drag and drop tasks to organize your workflow.
        </p>
      </header>

      <TaskBoard output={data.output} specId={data.specId} />
    </div>
  );
}
