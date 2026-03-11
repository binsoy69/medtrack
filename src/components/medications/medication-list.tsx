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
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-8 h-8 text-slate-400"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-slate-700 mb-1">
          No medications added yet
        </h3>
        <p className="text-sm text-slate-400">
          Add your first medication to start tracking your inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((medication) => (
        <MedicationCard key={medication.id} medication={medication} />
      ))}
    </div>
  );
}
