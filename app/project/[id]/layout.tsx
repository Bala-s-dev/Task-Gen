import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { LayoutDashboard, BookOpen, ChevronLeft, Folder } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-gray-900/50 border-r border-gray-800/50 flex-shrink-0 backdrop-blur-xl">
        <div className="p-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-10"
          >
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Dashboard
          </Link>

          <div className="space-y-3 mb-10">
            <div className="flex items-center gap-2 text-blue-400">
              <Folder size={16} />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                Project
              </span>
            </div>
            <h2 className="font-extrabold text-2xl text-white leading-tight">
              {spec.goal}
            </h2>
            <div className="inline-block px-2.5 py-1 rounded-md bg-gray-800 text-gray-400 border border-gray-700 text-[10px] font-bold uppercase tracking-widest">
              {spec.template}
            </div>
          </div>

          <nav className="space-y-2">
            <NavLink
              href={`/project/${spec.id}/stories`}
              icon={<BookOpen size={20} />}
            >
              User Stories
            </NavLink>
            <NavLink
              href={`/project/${spec.id}/board`}
              icon={<LayoutDashboard size={20} />}
            >
              Task Board
            </NavLink>
          </nav>
        </div>

        <div className="p-8 mt-auto border-t border-gray-800/50 bg-gray-900/20">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Created On
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {new Date(spec.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-950">
        <div className="max-w-5xl mx-auto p-6 md:p-12 lg:p-16">{children}</div>
      </main>
    </div>
  );
}

function NavLink({ href, children, icon }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all group font-medium border border-transparent hover:border-gray-700/50"
    >
      <span className="group-hover:text-blue-400 transition-colors">
        {icon}
      </span>
      {children}
    </Link>
  );
}
