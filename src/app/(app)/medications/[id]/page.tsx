import Link from "next/link";
import { fetchMedication } from "@/actions/medications";
import { MedicationDetailPageClient } from "@/components/medications/medication-detail-page-client";

interface MedicationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MedicationDetailPage({
  params,
}: MedicationDetailPageProps) {
  const { id } = await params;
  const result = await fetchMedication(id);

  if (result.error || !result.data) {
    return (
      <div className="px-4 py-6 sm:px-5">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {result.error ?? "Medication not found"}
          </div>
          <Link
            href="/medications"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700"
          >
            Back to medications
          </Link>
        </div>
      </div>
    );
  }

  return <MedicationDetailPageClient medication={result.data} />;
}
