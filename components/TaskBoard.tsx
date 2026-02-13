'use client';

import { useState } from 'react';
import TaskGroup from './TaskGroup';
import ExportBox from './ExportBox';

export default function TaskBoard({ output }: { output: any; specId: string }) {
  if (!output) {
    return (
      <div className="p-6 rounded-2xl bg-gray-900 text-gray-400">
        No generated tasks available yet.
      </div>
    );
  }

  const [groups, setGroups] = useState(output.groups || []);


  return (
    <div className="space-y-6">
      {/* Stories */}
      <div className="p-6 rounded-2xl bg-gray-900">
        <h2 className="text-xl font-bold mb-3">User Stories</h2>

        <ul className="list-disc pl-6 space-y-1 text-gray-300">
          {output.stories?.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Groups */}
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

      <ExportBox groups={groups} stories={output.stories} />
    </div>
  );
}
