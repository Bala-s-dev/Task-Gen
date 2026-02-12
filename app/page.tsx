export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        Task Generator (Mini Planning Tool)
      </h1>

      <p className="text-gray-400">
        Phase 1–3 complete: Backend + Prisma + Secure API ready.
      </p>

      <p className="text-sm text-gray-500">
        Next: Build form + drag-drop editor UI (Phase 4+).
      </p>

      <a
        href="/status"
        className="inline-block px-4 py-2 rounded-lg bg-white text-black font-medium"
      >
        View Status Page →
      </a>
    </div>
  );
}
