'use client';

import { useState } from 'react';
import { toast } from 'sonner';

export default function SpecForm({
  onGenerated,
}: {
  onGenerated: (data: any) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const payload = {
      goal: form.get('goal'),
      users: form.get('users'),
      constraints: form.get('constraints'),
      risks: form.get('risks'),
      template: form.get('template'),
    };

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('Server Error:', data);
        toast.error(data.error || 'Server Validation Error');
        return;
      }

      toast.success('Tasks generated successfully!');
      onGenerated(data);
    } catch (err) {
      console.error('Network Error:', err);
      toast.error('Connection failed. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    'w-full p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-800 transition-all outline-none placeholder:text-gray-500 text-gray-200';

  return (
    <form
      onSubmit={handleSubmit}
      className="p-8 rounded-3xl bg-gray-900/80 border border-gray-800 space-y-5 shadow-2xl backdrop-blur-sm"
    >
      <div className="space-y-4">
        <textarea
          name="goal"
          placeholder="Goal (What are you building?)"
          required
          minLength={10}
          rows={3}
          className={inputClasses}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            name="users"
            placeholder="Target Users"
            required
            minLength={5}
            rows={2}
            className={inputClasses}
          />
          <textarea
            name="constraints"
            placeholder="Constraints (time, tech...)"
            required
            minLength={5}
            rows={2}
            className={inputClasses}
          />
        </div>

        <textarea
          name="risks"
          placeholder="Risks / Unknowns (optional)"
          rows={2}
          className={inputClasses}
        />

        <div className="relative">
          <select
            name="template"
            className={`${inputClasses} appearance-none cursor-pointer`}
          >
            <option value="web">🌐 Web App Template</option>
            <option value="mobile">📱 Mobile App Template</option>
            <option value="internal">🛠️ Internal Tool Template</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            ▼
          </div>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-white text-black font-bold hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 shadow-xl shadow-white/5"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            Generating Tasks...
          </span>
        ) : (
          'Generate Technical Plan'
        )}
      </button>
    </form>
  );
}
