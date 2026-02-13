'use client';

import { useState, useEffect, use } from 'react';
import { CheckCircle2, Circle, Copy, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function StoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/specs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.output.stories.map((s: any) =>
          typeof s === 'string'
            ? { id: 'legacy-' + Math.random(), content: s, isCompleted: false }
            : s,
        );
        setStories(formatted);
        setLoading(false);
      });
  }, [id]);

  const toggleStory = async (index: number) => {
    const story = stories[index];
    if (story.id.toString().startsWith('legacy-')) {
      toast.error('Please regenerate the project to track story status.');
      return;
    }

    const newState = !story.isCompleted;
    const newStories = [...stories];
    newStories[index] = { ...story, isCompleted: newState };
    setStories(newStories);

    try {
      await fetch(`/api/stories/${story.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: newState }),
      });
    } catch (err) {
      toast.error('Failed to save status');
      newStories[index] = { ...story, isCompleted: !newState };
      setStories(newStories);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            Requirements
          </div>
          {/* Reduced from 4xl/5xl to 3xl/4xl */}
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            User Stories
          </h1>
          {/* Reduced from text-lg to text-base */}
          <p className="text-gray-400 text-base max-w-xl leading-relaxed">
            The fundamental building blocks and acceptance criteria defined for
            your engineering sprint.
          </p>
        </div>
      </header>

      <div className="grid gap-4">
        {stories.map((story, i) => (
          <div
            key={story.id || i}
            className={`
              group relative flex items-start gap-5 p-5 rounded-2xl border transition-all duration-300
              ${
                story.isCompleted
                  ? 'bg-gray-900/20 border-gray-800 opacity-50 shadow-inner'
                  : 'bg-gray-900/60 border-gray-800 hover:border-blue-500/40 hover:bg-gray-900 hover:shadow-2xl hover:shadow-blue-500/5'
              }
            `}
          >
            <button
              onClick={() => toggleStory(i)}
              className="mt-0.5 flex-shrink-0 transition-all duration-300 transform hover:scale-110 active:scale-90"
            >
              {story.isCompleted ? (
                <CheckCircle2 size={22} className="text-emerald-500" />
              ) : (
                <Circle
                  size={22}
                  className="text-gray-600 group-hover:text-blue-500"
                />
              )}
            </button>

            <div className="flex-1">
              {/* Reduced from text-lg/xl to text-base and removed font-medium */}
              <p
                className={`text-base leading-relaxed ${
                  story.isCompleted
                    ? 'line-through text-gray-500'
                    : 'text-gray-200'
                }`}
              >
                {story.content}
              </p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(story.content);
                toast.success('Copied!');
              }}
              className="opacity-0 group-hover:opacity-100 p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-all border border-gray-700"
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-3 w-20 bg-gray-800 rounded-full" />
        <div className="h-10 w-1/3 bg-gray-800 rounded-xl" />
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-24 bg-gray-900/50 border border-gray-800 rounded-2xl"
        />
      ))}
    </div>
  );
}
