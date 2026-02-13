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
    toast.success('Copied to clipboard!');
  }

  return (
    <div className="p-6 rounded-2xl bg-gray-900 space-y-4">
      <h2 className="text-xl font-bold">Export</h2>

      <button
        onClick={copyMarkdown}
        className="px-4 py-2 rounded-lg bg-white text-black font-medium"
      >
        Copy as Markdown
      </button>
    </div>
  );
}
