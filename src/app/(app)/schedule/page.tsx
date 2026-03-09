import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule — MedTrack",
};

export default function SchedulePage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
        <p className="mt-1 text-sm text-slate-500">
          Weekly view of your medication schedule.
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day}
            className="bg-white rounded-xl border border-slate-200 p-3 min-h-24 space-y-1.5"
          >
            <p className="text-xs font-semibold text-slate-500 uppercase">{day}</p>
            <div className="space-y-1">
              <div className="h-2 bg-slate-50 rounded-full" />
              <div className="h-2 bg-slate-50 rounded-full w-3/4" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 text-sm text-teal-700">
        <strong className="font-semibold">Tasks 16–17</strong> will build the
        full weekly schedule view with PDF/CSV export.
      </div>
    </div>
  );
}
