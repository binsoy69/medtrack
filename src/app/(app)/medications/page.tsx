import Link from "next/link";
import { fetchMedications } from "@/actions/medications";
import { getAppContext } from "@/lib/data/app-context";
import { MedicationList } from "@/components/medications/medication-list";
import { QuickAddMedication } from "@/components/medications/quick-add-medication";

export default async function MedicationsPage() {
  const { activeProfile, activeProfileId } = await getAppContext();
  const result = activeProfileId
    ? await fetchMedications(activeProfileId)
    : { data: [] };

  const medications = result.data ?? [];
  const error = result.error ?? null;

  return (
    <div className="px-4 py-6 sm:px-5">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">Medications</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            {activeProfile
              ? `${activeProfile.name}'s inventory`
              : "Track stock and schedule without leaving the page."}
          </p>
          {!error && (
            <p className="mt-1.5 text-[13px] text-slate-600">
              {medications.length} medication{medications.length !== 1 ? "s" : ""} tracked
            </p>
          )}
        </div>

        <Link
          href="/medications/new"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-medium text-slate-700 shadow-[0_16px_30px_-24px_rgba(15,23,42,0.35)] transition-all hover:border-emerald-300 hover:text-emerald-700"
        >
          Open full details form
        </Link>
      </div>

      {activeProfileId && (
        <div className="mb-6">
          <QuickAddMedication activeProfileId={activeProfileId} />
        </div>
      )}

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

      <MedicationList medications={medications} />
    </div>
  );
}
