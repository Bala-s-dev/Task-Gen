// app/project/[id]/layout.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LayoutDashboard, BookOpen, ChevronLeft, Menu } from 'lucide-react';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spec = await prisma.spec.findUnique({ where: { id } });

  if (!spec) notFound();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-950">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <h2 className="font-bold text-white truncate text-sm">{spec.goal}</h2>
        <div className="flex gap-4">
          <Link href={`/project/${spec.id}/stories`} className="text-gray-400">
            <BookOpen size={20} />
          </Link>
          <Link href={`/project/${spec.id}/board`} className="text-gray-400">
            <LayoutDashboard size={20} />
          </Link>
        </div>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 bg-gray-900 border-r border-gray-800 flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="p-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-8"
          >
            <ChevronLeft size={16} /> Dashboard
          </Link>
          <h2 className="font-bold text-xl text-white mb-2 line-clamp-3 leading-tight">
            {spec.goal}
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase font-semibold tracking-wider">
            {spec.template}
          </span>
        </div>

        <nav className="flex-1 px-4 space-y-1.5">
          <NavLink
            href={`/project/${spec.id}/stories`}
            icon={<BookOpen size={18} />}
          >
            User Stories
          </NavLink>
          <NavLink
            href={`/project/${spec.id}/board`}
            icon={<LayoutDashboard size={18} />}
          >
            Task Board
          </NavLink>
        </nav>

        <div className="p-6 border-t border-gray-800 bg-gray-900/50">
          <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1">
            Created
          </p>
          <p className="text-xs text-gray-400">
            {new Date(spec.createdAt).toLocaleDateString()}
          </p>
        </div>
      </aside>

      {/* Main Content Area - Full Width */}
      <main className="flex-1 min-w-0 bg-gray-950">
        <div className="w-full h-full p-6 md:p-10 lg:p-12">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, children, icon }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/80 transition-all font-medium border border-transparent hover:border-gray-700/50"
    >
      {icon} {children}
    </Link>
  );
}
