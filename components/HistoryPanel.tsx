'use client';

import { useEffect, useState } from 'react';
import { Clock, ChevronRight, Calendar } from 'lucide-react';

export default function HistoryPanel({
  onLoadSpec,
}: {
  onLoadSpec: (data: any) => void;
}) {
  const [specs, setSpecs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadHistory() {
    setLoading(true);
    try {
      const res = await fetch('/api/specs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSpecs(data);
      } else {
        setSpecs([]);
      }
    } catch (err) {
      setSpecs([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="p-6 rounded-3xl bg-gray-900/60 border border-gray-800/50 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-800 rounded-lg text-gray-400">
          <Clock size={18} />
        </div>
        <h2 className="font-bold text-lg text-white">Recent Specs</h2>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 w-full bg-gray-800/50 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && specs.length === 0 && (
        <div className="py-10 text-center border-2 border-dashed border-gray-800 rounded-2xl">
          <p className="text-gray-500 text-sm italic">No history found.</p>
        </div>
      )}

      <div className="space-y-3">
        {specs.map((s) => (
          <button
            key={s.id}
            className="group w-full text-left p-4 rounded-xl bg-gray-800/30 border border-transparent hover:border-blue-500/30 hover:bg-gray-800/80 transition-all duration-200"
            onClick={async () => {
              const res = await fetch(`/api/specs/${s.id}`);
              const full = await res.json();
              onLoadSpec(full);
            }}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1 overflow-hidden">
                <p className="font-semibold text-gray-200 group-hover:text-white truncate transition-colors">
                  {s.goal}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  <Calendar size={10} />
                  {new Date(s.createdAt).toLocaleDateString()}
                </div>
              </div>
              <ChevronRight
                size={16}
                className="text-gray-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
