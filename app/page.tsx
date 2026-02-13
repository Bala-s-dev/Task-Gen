'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SpecForm from '@/components/SpecForm';
import { ArrowRight, Clock, Plus, Layout } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/specs')
      .then((res) => res.json())
      .then(setHistory);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm border border-blue-500/20">
            <Layout size={14} />
            <span>v2.0 Now Available</span>
          </div>
          <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Task Generator
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Transform feature ideas into professional engineering plans.
            AI-generated user stories, Kanban boards, and exportable specs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left: New Project Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Plus size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-semibold">New Project</h2>
            </div>

            <SpecForm
              onGenerated={(data) =>
                router.push(`/project/${data.specId}/stories`)
              }
            />
          </div>

          {/* Right: Recent History */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gray-800 rounded-lg">
                <Clock size={20} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold">Recent Plans</h2>
            </div>

            <div className="space-y-3">
              {history.length === 0 && (
                <p className="text-gray-500 italic">No projects yet.</p>
              )}
              {history.map((spec) => (
                <Link
                  key={spec.id}
                  href={`/project/${spec.id}/stories`}
                  className="group block p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <h3 className="font-medium truncate pr-4 text-gray-200 group-hover:text-white">
                    {spec.goal}
                  </h3>
                  <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                    <span>{new Date(spec.createdAt).toLocaleDateString()}</span>
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-400"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
