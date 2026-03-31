import { ClockCountdown } from "@phosphor-icons/react/dist/ssr";
import { parse, format } from "date-fns";
import type { Medication } from "@/lib/types/database";
import { FREQUENCIES } from "@/lib/constants";

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
    .filter((medication) => medication.schedule_days.includes(today))
    .sort((left, right) => {
      const leftTime =
        left.schedule_times && left.schedule_times.length > 0
          ? Math.min(...left.schedule_times.map((time) => parseInt(time.replace(":", ""))))
          : 9999;
      const rightTime =
        right.schedule_times && right.schedule_times.length > 0
          ? Math.min(...right.schedule_times.map((time) => parseInt(time.replace(":", ""))))
          : 9999;
      return leftTime - rightTime;
    });

  return (
    <section className="rounded-[22px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
          <ClockCountdown size={18} weight="duotone" />
        </span>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">
            Today&apos;s schedule
          </h2>
          <p className="text-[13px] capitalize text-slate-500">{today}</p>
        </div>
      </div>

      {scheduled.length === 0 ? (
        <div className="mt-5 rounded-[18px] border border-slate-200 bg-slate-50/70 px-4 py-6">
          <p className="text-sm font-medium text-slate-700">
            No medications scheduled today.
          </p>
          <p className="mt-1 text-[13px] text-slate-500">
            The current profile has no doses planned for this day.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {scheduled.map((medication) => {
            const frequencyLabel =
              FREQUENCIES.find((frequency) => frequency.value === medication.frequency)
                ?.label ?? medication.frequency;

            return (
              <div
                key={medication.id}
                className="rounded-[16px] border border-slate-200/80 bg-slate-50/80 px-3.5 py-3"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {medication.name}
                    </p>
                    <p className="mt-0.5 text-[13px] text-slate-500">
                      {medication.dosage_amount} {medication.dosage_unit} per dose,{" "}
                      {frequencyLabel.toLowerCase()}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {medication.schedule_times && medication.schedule_times.length > 0 ? (
                      medication.schedule_times.map((time) => (
                        <span
                          key={time}
                          className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700"
                        >
                          {formatTimeAMPM(time)}
                        </span>
                      ))
                    ) : (
                      <span className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500">
                        Flexible timing
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
