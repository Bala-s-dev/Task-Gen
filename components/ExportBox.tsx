'use client';

import { toast } from 'sonner';
import { Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';

export default function ExportBox({
  groups,
  stories,
}: {
  groups: any[];
  stories: any[];
}) {
  const [copied, setCopied] = useState(false);

  function generateMarkdown() {
    const date = new Date().toLocaleDateString();
    let md = `# Project Spec & Tasks (${date})\n\n`;

    md += `## 📖 User Stories\n`;
    stories?.forEach((story) => {
      // ✅ Handle Object vs String
      const content = typeof story === 'string' ? story : story.content;
      const check = story.isCompleted ? '[x]' : '[ ]';
      md += `- ${check} ${content}\n`;
    });
    md += `\n`;

    md += `## 🛠 Engineering Tasks\n`;
    groups.forEach((group) => {
      md += `\n### ${group.title}\n`;
      group.tasks.forEach((task: any) => {
        // ✅ Handle Object vs String
        const content = typeof task === 'string' ? task : task.content;
        const check = task.isCompleted ? '[x]' : '[ ]';
        const priority = task.priority ? `(${task.priority})` : '';
        md += `- ${check} ${content} ${priority}\n`;
      });
    });

    return md;
  }

  function handleCopy() {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([generateMarkdown()], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project-tasks-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded Markdown file');
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="font-bold text-lg text-white">Export Plan</h3>
        <p className="text-gray-400 text-sm">
          Save your generated tasks to local files or Notion.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition border border-gray-600"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy Text'}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold hover:bg-gray-200 rounded-lg transition"
        >
          <Download size={16} />
          Download .md
        </button>
      </div>
    </div>
  );
}
