'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import TaskGroup from './TaskGroup';
import ExportBox from './ExportBox';

export default function TaskBoard({
  output,
  specId,
}: {
  output: any;
  specId: string;
}) {
  const [groups, setGroups] = useState(output.groups || []);
  const [stories, setStories] = useState(output.stories || []);

  async function saveEdits() {
    try {
      const res = await fetch(`/api/specs/${specId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groups, stories }),
      });

      if (!res.ok) throw new Error();
      toast.success('Saved successfully!');
    } catch {
      toast.error('Save failed.');
    }
  }

  return (
    <div className="space-y-6">
      {/* STORIES */}
      <div className="p-6 rounded-2xl bg-gray-900 shadow-md">
        <h2 className="text-xl font-bold mb-3">User Stories</h2>

        <div className="space-y-2">
          {stories.map((s: string, i: number) => (
            <input
              key={i}
              value={s}
              onChange={(e) => {
                const copy = [...stories];
                copy[i] = e.target.value;
                setStories(copy);
              }}
              className="w-full bg-gray-800 p-2 rounded-lg text-gray-200"
            />
          ))}
        </div>
      </div>

      {/* TASK GROUPS */}
      <div className="grid md:grid-cols-2 gap-6">
        {groups.map((group: any, idx: number) => (
          <TaskGroup
            key={idx}
            group={group}
            onUpdate={(newGroup) => {
              const copy = [...groups];
              copy[idx] = newGroup;
              setGroups(copy);
            }}
          />
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex justify-between">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-gray-700 text-white"
        >
          + New Spec
        </button>

        <button
          onClick={saveEdits}
          className="px-5 py-2 rounded-xl bg-green-500 text-black font-semibold"
        >
          Save Changes
        </button>
      </div>

      {/* EXPORT */}
      <ExportBox groups={groups} stories={stories} />
    </div>
  );
}
