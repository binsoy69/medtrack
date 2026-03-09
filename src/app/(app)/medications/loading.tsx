export default function MedicationsLoading() {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1.5">
          <div className="h-8 w-36 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 animate-pulse"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="h-5 w-2/3 bg-slate-200 rounded" />
              <div className="h-5 w-16 bg-slate-100 rounded-full" />
            </div>
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="h-5 w-7 bg-slate-100 rounded" />
              ))}
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex items-center justify-between">
              <div className="h-8 w-32 bg-slate-200 rounded-lg" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
