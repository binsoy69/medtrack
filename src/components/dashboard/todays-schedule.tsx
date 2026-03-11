import type { Medication } from "@/lib/types/database";
import { FREQUENCIES } from "@/lib/constants";
import { parse, format } from "date-fns";

interface TodaysScheduleProps {
  medications: Medication[];
  today: string;
}

function formatTimeAMPM(time24: string) {
  try {
    const parsed = parse(time24, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  } catch {
    return time24;
  }
}

export function TodaysSchedule({ medications, today }: TodaysScheduleProps) {
  const scheduled = medications
    .filter((m) => m.schedule_days.includes(today))
    .sort((a, b) => {
      // Sort by earliest scheduled time, treating medications without times as end of day
      const aTime = a.schedule_times && a.schedule_times.length > 0 ? Math.min(...a.schedule_times.map(t => parseInt(t.replace(':', '')))) : 9999;
      const bTime = b.schedule_times && b.schedule_times.length > 0 ? Math.min(...b.schedule_times.map(t => parseInt(t.replace(':', '')))) : 9999;
      return aTime - bTime;
    });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5 text-teal-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 text-base">
            Today&apos;s Schedule
          </h2>
          <p className="text-xs text-slate-400 capitalize">{today}</p>
        </div>
      </div>

      {scheduled.length === 0 ? (
        <p className="text-sm text-slate-500">
          No medications scheduled today.
        </p>
      ) : (
        <div className="space-y-2">
          {scheduled.map((med) => {
            const freqLabel =
              FREQUENCIES.find((f) => f.value === med.frequency)?.label ??
              med.frequency;
            const hasTimes =
              med.schedule_times && med.schedule_times.length > 0;

            return (
              <div
                key={med.id}
                className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {med.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {med.dosage_amount} {med.dosage_unit} &middot;{" "}
                    {freqLabel.toLowerCase()}
                  </p>
                </div>
                {hasTimes && (
                  <div className="flex flex-wrap gap-1 flex-shrink-0">
                    {med.schedule_times!.map((time) => (
                      <span
                        key={time}
                        className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200"
                      >
                        {formatTimeAMPM(time)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
