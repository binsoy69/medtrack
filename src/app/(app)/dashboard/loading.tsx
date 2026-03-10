export default function DashboardLoading() {
  return (
    <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-40 bg-slate-100 rounded animate-pulse mt-1.5" />
      </div>

      <div className="space-y-6">
        {/* Top row skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low stock summary skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-slate-200" />
              <div className="h-5 w-28 bg-slate-200 rounded" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="space-y-1.5">
                    <div className="h-4 w-32 bg-slate-200 rounded" />
                    <div className="h-3 w-20 bg-slate-100 rounded" />
                  </div>
                  <div className="h-4 w-12 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Today's schedule skeleton */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-slate-200" />
              <div className="space-y-1">
                <div className="h-5 w-36 bg-slate-200 rounded" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            </div>
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="space-y-1.5">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </div>
                  <div className="h-5 w-14 bg-slate-100 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick list skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-200" />
              <div className="h-5 w-32 bg-slate-200 rounded" />
            </div>
            <div className="h-4 w-14 bg-slate-100 rounded" />
          </div>
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-3"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 w-36 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-8 w-32 bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
