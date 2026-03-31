import { format } from "date-fns";
import { fetchMedications } from "@/actions/medications";
import { getAppContext } from "@/lib/data/app-context";
import { WeeklyGrid } from "@/components/schedule/weekly-grid";
import { ScheduleExportButtons } from "@/components/schedule/schedule-export-buttons";

export default async function SchedulePage() {
  const { activeProfile, activeProfileId } = await getAppContext();
  const result = activeProfileId
    ? await fetchMedications(activeProfileId)
    : { data: [] };

  const medications = result.data ?? [];
  const error = result.error ?? null;
  const todayDayName = format(new Date(), "EEEE").toLowerCase();

  return (
    <div className="px-4 py-6 sm:px-5">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Weekly Schedule</h1>
          {activeProfile && (
            <p className="mt-0.5 text-[13px] text-slate-500">
              {activeProfile.name}&apos;s medication rhythm
            </p>
          )}
        </div>
        <ScheduleExportButtons
          profileName={activeProfile?.name ?? "Profile"}
          medications={medications}
        />
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="h-4 w-4 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          {error}
        </div>
      )}

      <WeeklyGrid medications={medications} today={todayDayName} />

      <p className="mt-5 text-center text-[11px] text-slate-400">
        Open a medication card when you need to fine-tune the full schedule.
      </p>
    </div>
  );
}
