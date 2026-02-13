'use client';

import { toast } from 'sonner';

export default function ExportBox({
  stories,
  groups,
}: {
  stories: string[];
  groups: any[];
}) {
  function buildMarkdown() {
    let md = `# User Stories\n\n`;
    stories.forEach((s) => (md += `- ${s}\n`));

    md += `\n# Engineering Tasks\n\n`;

    groups.forEach((g) => {
      md += `## ${g.title}\n`;
      g.tasks.forEach((t: string) => {
        md += `- ${t}\n`;
      });
      md += `\n`;
    });

    return md;
  }

  async function copyMarkdown() {
    await navigator.clipboard.writeText(buildMarkdown());
    toast.success('Copied Markdown!');
  }

  function downloadMarkdown() {
    const blob = new Blob([buildMarkdown()], {
      type: 'text/markdown',
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.md';
    a.click();

    URL.revokeObjectURL(url);

    toast.success('Downloaded tasks.md!');
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 space-y-4">
      <h2 className="text-xl font-bold">Export</h2>

      <div className="flex gap-3">
        <button
          onClick={copyMarkdown}
          className="px-4 py-2 rounded-lg bg-white text-black font-medium"
        >
          Copy Markdown
        </button>

        <button
          onClick={downloadMarkdown}
          className="px-4 py-2 rounded-lg bg-gray-700 text-white"
        >
          Download File
        </button>
      </div>
    </div>
  );
}
