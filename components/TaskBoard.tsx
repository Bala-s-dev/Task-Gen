'use client';

import { useState } from 'react';
import TaskGroup from './TaskGroup';
import ExportBox from './ExportBox';

export default function TaskBoard({ output }: { output: any; specId: string }) {
  const [groups, setGroups] = useState(output.groups);

  return (
    <div className="space-y-6">
      {/* User Stories */}
      <div className="p-6 rounded-2xl bg-gray-900">
        <h2 className="text-xl font-bold mb-3">User Stories</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-300">
          {output.stories.map((s: string, i: number) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      {/* Task Groups */}
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

      {/* Export */}
      <ExportBox groups={groups} stories={output.stories} />
    </div>
  );
}
