import { FREQUENCIES } from "@/lib/constants";

interface ScheduleMedication {
  name: string;
  dosageAmount: number;
  dosageUnit: string;
  frequency: string;
  scheduleTimes: string[] | null;
}

interface DayColumnProps {
  dayName: string;
  medications: ScheduleMedication[];
  isToday: boolean;
}

export function DayColumn({ dayName, medications, isToday }: DayColumnProps) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        isToday
          ? "border-teal-300 bg-teal-50/50 ring-1 ring-teal-200"
          : "border-slate-200 bg-white"
      }`}
    >
      <h3
        className={`text-sm font-semibold capitalize mb-3 ${
          isToday ? "text-teal-700" : "text-slate-700"
        }`}
      >
        {dayName}
        {isToday && (
          <span className="ml-2 text-xs font-medium text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded-full">
            Today
          </span>
        )}
      </h3>

      {medications.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No medications</p>
      ) : (
        <div className="space-y-2">
          {medications.map((med, i) => {
            const freqLabel =
              FREQUENCIES.find((f) => f.value === med.frequency)?.label ??
              med.frequency;
            const hasTimes = med.scheduleTimes && med.scheduleTimes.length > 0;

            return (
              <div
                key={`${med.name}-${i}`}
                className="bg-white/80 rounded-lg p-2.5 border border-slate-100"
              >
                <p className="text-sm font-medium text-slate-900 truncate">
                  {med.name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {med.dosageAmount} {med.dosageUnit} &middot;{" "}
                  {freqLabel.toLowerCase()}
                </p>
                {hasTimes && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {med.scheduleTimes!.map((time) => (
                      <span
                        key={time}
                        className="px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600"
                      >
                        {time}
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
