'use client';

import { useEffect, useState } from 'react';

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

      // ✅ Ensure array
      if (Array.isArray(data)) {
        setSpecs(data);
      } else {
        console.error('History API returned non-array:', data);
        setSpecs([]);
      }
    } catch (err) {
      console.error('History fetch failed:', err);
      setSpecs([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="p-5 rounded-2xl bg-gray-900">
      <h2 className="font-bold mb-4">Recent Specs</h2>

      {loading && <p className="text-gray-500 text-sm">Loading...</p>}

      {!loading && specs.length === 0 && (
        <p className="text-gray-500 text-sm">No specs found yet.</p>
      )}

      <div className="space-y-3">
        {specs.map((s) => (
          <button
            key={s.id}
            className="w-full text-left p-3 rounded-xl bg-gray-800 hover:bg-gray-700 transition"
            onClick={async () => {
              const res = await fetch(`/api/specs/${s.id}`);
              const full = await res.json();
              onLoadSpec(full);
            }}
          >
            <p className="font-medium truncate">{s.goal}</p>
            <p className="text-xs text-gray-400">
              {new Date(s.createdAt).toLocaleString()}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
