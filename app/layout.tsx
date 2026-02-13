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
    <html lang="en" className="h-full">
      <body className="bg-gray-950 text-white min-h-full selection:bg-blue-500/30 flex flex-col">
        {/* Decorative background glow */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none" />

        {/* - Removed 'max-w' and 'mx-auto' to allow 100% width
            - Added 'flex-1' to ensure it fills the vertical height 
            - Removed 'px' and 'py' padding so children can control their own spacing 
        */}
        <main className="relative flex-1 w-full h-full">{children}</main>

        <Toaster position="top-right" theme="dark" richColors />
      </body>
    </html>
  );
}
