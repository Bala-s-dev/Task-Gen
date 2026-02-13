// app/status/page.tsx
import { Activity, Database, Server, Cpu, CheckCircle2 } from 'lucide-react';

async function getHealth() {
  try {
    // Note: Absolute URL is required for fetch in Server Components
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/health`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  } catch (err) {
    return { backend: 'down', database: 'down', llm: 'down' };
  }
}

export default async function StatusPage() {
  const data = await getHealth();

  const statusItems = [
    { label: 'Backend', value: data.backend, icon: <Server size={20} /> },
    { label: 'Database', value: data.database, icon: <Database size={20} /> },
    { label: 'LLM Engine', value: data.llm, icon: <Cpu size={20} /> },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <header className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest border border-emerald-500/20">
          <Activity size={14} />
          <span>Live Metrics</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
          System Status
        </h1>
        <p className="text-gray-400 text-lg max-w-xl">
          Real-time health monitoring for our AI services and infrastructure.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statusItems.map((item, idx) => (
          <div
            key={idx}
            className="group p-6 rounded-3xl bg-gray-900/40 border border-gray-800/50 backdrop-blur-xl hover:bg-gray-900 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-gray-800 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                  item.value === 'ok'
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${item.value === 'ok' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}
                />
                {item.value === 'ok' ? 'Operational' : 'Issue'}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                {item.label}
              </h3>
              <p className="text-xl font-bold text-gray-200">
                {item.value === 'ok' ? 'Healthy' : 'Error'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/10 border border-gray-800/50">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-emerald-500" />
          System Overview
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-800">
            <span className="text-gray-400 text-sm">API Version</span>
            <span className="text-gray-200 font-mono text-sm">v1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-400 text-sm">Uptime (30d)</span>
            <span className="text-gray-200 font-mono text-sm">99.9%</span>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs font-medium uppercase tracking-widest">
        Last checked: {new Date().toLocaleTimeString()}
      </p>
    </div>
  );
}
