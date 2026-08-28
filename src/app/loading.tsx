export default function Loading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-8" aria-busy="true" aria-live="polite">
      <div className="h-48 animate-pulse rounded-2xl bg-slate-100 sm:h-64" />
      <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
      <div className="flex gap-3.5 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-[351px] w-[289px] shrink-0 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
      <span className="sr-only">Loading Fannero…</span>
    </div>
  );
}
