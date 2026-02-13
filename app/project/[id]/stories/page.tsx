'use client';

import { useState, useEffect, use } from 'react';
import { CheckCircle2, Circle, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function StoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ Unwrap params using React.use() (Required for Next.js 15)
  const { id } = use(params);

  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/specs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Handle data: If API returns strings (legacy), wrap them. If objects, use them.
        const formatted = data.output.stories.map((s: any) =>
          typeof s === 'string'
            ? { id: 'legacy-' + Math.random(), content: s, isCompleted: false }
            : s,
        );
        setStories(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load stories');
        setLoading(false);
      });
  }, [id]);

  const toggleStory = async (index: number) => {
    const story = stories[index];

    // Prevent editing legacy data that hasn't been migrated to DB objects
    if (story.id.toString().startsWith('legacy-')) {
      toast.error(
        'Legacy stories cannot be tracked. Please regenerate the project.',
      );
      return;
    }

    const newState = !story.isCompleted;

    // 1. Optimistic UI Update (Instant feedback)
    const newStories = [...stories];
    newStories[index] = { ...story, isCompleted: newState };
    setStories(newStories);

    // 2. API Call to persist change
    try {
      const res = await fetch(`/api/stories/${story.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted: newState }),
      });

      if (!res.ok) throw new Error('Failed to update');
    } catch (err) {
      toast.error('Failed to save status');
      // Revert UI on failure
      newStories[index] = { ...story, isCompleted: !newState };
      setStories(newStories);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Story copied!');
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-1/3 bg-gray-800 rounded"></div>
        <div className="h-24 bg-gray-900 rounded-xl"></div>
        <div className="h-24 bg-gray-900 rounded-xl"></div>
        <div className="h-24 bg-gray-900 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">User Stories</h1>
        <p className="text-gray-400">
          The core requirements and acceptance criteria for this feature.
        </p>
      </header>

      <div className="grid gap-4">
        {stories.length === 0 && (
          <div className="p-8 text-center border border-dashed border-gray-800 rounded-xl text-gray-500">
            No user stories generated for this project.
          </div>
        )}

        {stories.map((story, i) => (
          <div
            key={story.id || i}
            className={`
              group flex items-start gap-4 p-5 rounded-xl border transition-all
              ${
                story.isCompleted
                  ? 'bg-gray-900/50 border-gray-800 opacity-60'
                  : 'bg-gray-900 border-gray-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5'
              }
            `}
          >
            {/* Checkbox Button */}
            <button
              onClick={() => toggleStory(i)}
              className="mt-1 flex-shrink-0 text-gray-500 hover:text-blue-400 transition focus:outline-none"
              title={story.isCompleted ? 'Mark as todo' : 'Mark as done'}
            >
              {story.isCompleted ? (
                <CheckCircle2 size={24} className="text-green-500" />
              ) : (
                <Circle size={24} />
              )}
            </button>

            {/* Story Content */}
            <div className="flex-1">
              <p
                className={`text-lg leading-relaxed ${
                  story.isCompleted
                    ? 'line-through text-gray-500'
                    : 'text-gray-200'
                }`}
              >
                {story.content}
              </p>
            </div>

            {/* Copy Button */}
            <button
              onClick={() => copyToClipboard(story.content)}
              className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition"
              title="Copy to clipboard"
            >
              <Copy size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
