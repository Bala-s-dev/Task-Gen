'use client';

import { useEffect, useState, use } from 'react';
import TaskBoard from '@/components/TaskBoard';
import { LayoutDashboard, Info } from 'lucide-react';

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/specs/${id}`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading task board...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <LayoutDashboard size={14} />
            Kanban Workflow
          </div>
          {/* Adjusted to 3xl/4xl */}
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Engineering Tasks
          </h1>
          {/* Adjusted to text-base */}
          <p className="text-gray-400 text-base max-w-xl leading-relaxed">
            Organize your implementation plan. Drag and drop tasks across
            different development stages.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-lg text-blue-400 text-[11px] font-medium italic">
          <Info size={12} />
          Changes are saved automatically
        </div>
      </header>

      <TaskBoard output={data.output} specId={data.specId} />
    </div>
  );
}
