import { Toaster } from 'sonner'; //
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
      <body className="bg-gray-950 text-white min-h-screen">
        <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
        {/* ✅ Add Toaster here so toasts can be seen */}
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
