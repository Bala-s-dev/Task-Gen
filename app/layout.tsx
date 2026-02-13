import { Toaster } from 'sonner';
import './globals.css';

export const metadata = {
  title: 'Task Generator',
  description: 'Mini planning tool for user stories + engineering tasks',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white min-h-screen selection:bg-blue-500/30">
        {/* Decorative background glow */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_50%)] pointer-events-none" />

        <main className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16">
          {children}
        </main>

        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
