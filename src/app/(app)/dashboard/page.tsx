import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — MedTrack",
};

export default function DashboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your medication inventory and today&apos;s schedule.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Low Stock Summary", "Today's Schedule", "Recent Activity"].map(
          (card) => (
            <div
              key={card}
              className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3"
            >
              <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100" />
              <div className="space-y-1.5">
                <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
                <div className="h-2.5 w-full bg-slate-50 rounded-full" />
                <div className="h-2.5 w-4/5 bg-slate-50 rounded-full" />
              </div>
              <p className="text-xs text-slate-400 font-medium">{card} — coming soon</p>
            </div>
          ),
        )}
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-sm text-teal-700">
        <strong className="font-semibold">Task 15</strong> will build the full
        dashboard with low-stock alerts, today&apos;s schedule, and quick quantity
        updates.
      </div>
    </div>
  );
}
