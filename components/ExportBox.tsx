'use client';

import { toast } from 'sonner';
import { Copy, Download, Check, Share2 } from 'lucide-react';
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
      const content = typeof story === 'string' ? story : story.content;
      const check = story.isCompleted ? '[x]' : '[ ]';
      md += `- ${check} ${content}\n`;
    });
    md += `\n## 🛠 Engineering Tasks\n`;
    groups.forEach((group) => {
      md += `\n### ${group.title}\n`;
      group.tasks.forEach((task: any) => {
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
    toast.success('Plan copied to clipboard!');
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
    toast.success('Markdown file downloaded');
  }

  return (
    <div className="p-8 rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20 border border-gray-700/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
      <div className="text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
          <Share2 size={18} className="text-blue-400" />
          <h3 className="font-bold text-xl text-white">Export Plan</h3>
        </div>
        <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
          Save your engineering specs to Markdown for Notion, GitHub, or Jira.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all border border-gray-600 active:scale-95 font-medium"
        >
          {copied ? (
            <Check size={18} className="text-green-400" />
          ) : (
            <Copy size={18} />
          )}
          {copied ? 'Copied!' : 'Copy Markdown'}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold hover:bg-gray-100 rounded-xl transition-all active:scale-95 shadow-lg shadow-white/5"
        >
          <Download size={18} />
          Download .md
        </button>
      </div>
    </div>
  );
}
