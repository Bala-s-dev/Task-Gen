'use client';

import { useState } from 'react';
import SpecForm from '@/components/SpecForm';
import TaskBoard from '@/components/TaskBoard';
import HistoryPanel from '@/components/HistoryPanel';

export default function Home() {
  const [generated, setGenerated] = useState<any>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left History */}
      <aside className="lg:col-span-1">
        <HistoryPanel onLoadSpec={(data) => setGenerated(data)} />
      </aside>

      {/* Main Content */}
      <section className="lg:col-span-3 space-y-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">Task Generator</h1>
          <p className="text-gray-400 mt-2">
            Generate user stories + engineering tasks from a feature idea.
          </p>
        </header>

        {/* Spec Form */}
        <SpecForm onGenerated={(data) => setGenerated(data)} />

        {/* Output Board */}
        {generated && (
          <TaskBoard output={generated.output} specId={generated.specId} />
        )}
      </section>
    </div>
  );
}
