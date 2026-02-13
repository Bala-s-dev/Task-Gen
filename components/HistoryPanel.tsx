'use client';

export default function HistoryPanel({
  onLoadSpec,
}: {
  onLoadSpec: (data: any) => void;
}) {
  return (
    <div className="p-5 rounded-2xl bg-gray-900">
      <h2 className="font-bold mb-3">Recent Specs</h2>
      <p className="text-gray-500 text-sm">
        Phase 7 will load last 5 specs from DB.
      </p>
    </div>
  );
}
