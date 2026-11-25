export default function Loading() {
  return (
    <main
      className="flex min-h-[50vh] items-center justify-center bg-slate-50 px-5"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <span className="size-5 animate-spin rounded-full border-2 border-purple-200 border-t-purple-700" />
        <span className="text-sm font-medium text-slate-600">
          Preparing your creative space...
        </span>
      </div>
    </main>
  );
}
