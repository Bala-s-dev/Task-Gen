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

      if (!res.ok) {
        toast.error('Invalid input or server error.');
        return;
      }

      const data = await res.json();
      toast.success('Tasks generated successfully!');
      onGenerated(data);
    } catch {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 rounded-2xl bg-gray-900 space-y-4 shadow-lg"
    >
      <h2 className="text-xl font-semibold">Feature Spec</h2>

      <textarea
        name="goal"
        placeholder="Goal (What are you building?)"
        required
        className="w-full p-3 rounded-lg bg-gray-800"
      />

      <textarea
        name="users"
        placeholder="Target Users"
        required
        className="w-full p-3 rounded-lg bg-gray-800"
      />

      <textarea
        name="constraints"
        placeholder="Constraints (time, tech, limits...)"
        required
        className="w-full p-3 rounded-lg bg-gray-800"
      />

      <textarea
        name="risks"
        placeholder="Risks / Unknowns (optional)"
        className="w-full p-3 rounded-lg bg-gray-800"
      />

      <select name="template" className="w-full p-3 rounded-lg bg-gray-800">
        <option value="web">Web App</option>
        <option value="mobile">Mobile App</option>
        <option value="internal">Internal Tool</option>
      </select>

      <button
        disabled={loading}
        className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition"
      >
        {loading ? 'Generating...' : 'Generate Tasks'}
      </button>
    </form>
  );
}
