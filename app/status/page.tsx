async function getHealth() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/health`, {
    cache: 'no-store',
  });

  return res.json();
}

export default async function StatusPage() {
  const data = await getHealth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Status</h1>

      <div className="p-4 rounded-xl bg-gray-900 space-y-2">
        <p>Backend: ✅ {data.backend}</p>
        <p>Database: ✅ {data.database}</p>
        <p>LLM: ✅ {data.llm}</p>
      </div>
    </div>
  );
}
