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
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs md:text-sm border border-blue-500/20">
            <Layout size={14} />
            <span className="font-medium">v2.0 Now Available</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
            Task Generator
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Transform feature ideas into professional engineering plans.
            AI-generated user stories, Kanban boards, and exportable specs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Left: New Project Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/20">
                <Plus size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold">New Project</h2>
            </div>

            <SpecForm
              onGenerated={(data) =>
                router.push(`/project/${data.specId}/stories`)
              }
            />
          </div>

          {/* Right: Recent History */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gray-800 rounded-xl">
                <Clock size={20} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold">Recent Plans</h2>
            </div>

            <div className="space-y-3">
              {history.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-gray-800 rounded-2xl">
                  <p className="text-gray-500 italic text-sm">
                    No projects yet.
                  </p>
                </div>
              )}
              {history.map((spec) => (
                <Link
                  key={spec.id}
                  href={`/project/${spec.id}/stories`}
                  className="group block p-5 rounded-2xl bg-gray-900/50 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:bg-gray-900"
                >
                  <h3 className="font-semibold truncate pr-4 text-gray-200 group-hover:text-blue-400 transition-colors">
                    {spec.goal}
                  </h3>
                  <div className="flex justify-between items-center mt-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <span>{new Date(spec.createdAt).toLocaleDateString()}</span>
                    <ArrowRight
                      size={16}
                      className="-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all text-blue-400"
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
