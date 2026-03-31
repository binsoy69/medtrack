import type { Medication } from "@/lib/types/database";
import { MedicationCard } from "@/components/medications/medication-card";

interface MedicationListProps {
  medications: Medication[];
}

function getEarliestTime(med: Medication): string {
  const times = med.schedule_times?.filter(Boolean) ?? [];
  if (times.length === 0) return "99:99";
  return [...times].sort()[0];
}

export function MedicationList({ medications }: MedicationListProps) {
  const sorted = [...medications].sort((a, b) => {
    const ta = getEarliestTime(a);
    const tb = getEarliestTime(b);
    if (ta !== tb) return ta.localeCompare(tb);
    return a.name.localeCompare(b.name);
  });
  if (medications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-white/70 px-6 py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] border border-slate-200 bg-slate-50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-8 w-8 text-slate-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <h3 className="mb-1 text-base font-semibold text-slate-700">
          No medications added yet
        </h3>
        <p className="text-sm text-slate-400">
          Add your first medication to start tracking your inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      {sorted.map((medication, index) => (
        <div
          key={`${medication.id}-${medication.quantity}`}
          className={index % 3 === 2 ? "xl:col-span-2" : ""}
        >
          <MedicationCard
            medication={medication}
            wide={index % 3 === 2}
          />
        </div>
      ))}
    </div>
  );
}
