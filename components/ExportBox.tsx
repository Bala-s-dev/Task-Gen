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
<button
  onClick={downloadMarkdown}
  className="px-4 py-2 rounded-lg bg-gray-700 text-white"
>
  Download Markdown
</button>;
}
