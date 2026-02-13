import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LayoutDashboard, BookOpen, ChevronLeft } from 'lucide-react';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>; // ✅ Type is now Promise
}) {
  // ✅ Await params before using properties
  const { id } = await params;

  const spec = await prisma.spec.findUnique({
    where: { id },
  });

  if (!spec) notFound();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0">
        <div className="p-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition mb-8"
          >
            <ChevronLeft size={16} />
            Back to Home
          </Link>

          <h2 className="font-bold text-lg text-white mb-1 line-clamp-2">
            {spec.goal}
          </h2>
          <span className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-400 border border-gray-700 uppercase tracking-wider">
            {spec.template}
          </span>
        </div>

        <nav className="px-3 space-y-1">
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

        <div className="p-6 mt-auto border-t border-gray-800">
          <div className="text-xs text-gray-500">
            Created: {new Date(spec.createdAt).toLocaleDateString()}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-gray-950 p-8">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, children, icon }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition group"
    >
      <span className="group-hover:text-blue-400 transition-colors">
        {icon}
      </span>
      {children}
    </Link>
  );
}
