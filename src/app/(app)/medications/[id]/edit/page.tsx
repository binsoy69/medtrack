import { updateMedication, fetchMedication } from "@/actions/medications";
import { MedicationForm } from "@/components/medications/medication-form";
import type { MedicationFormData } from "@/lib/validators/medication";

interface EditMedicationPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMedicationPage({
  params,
}: EditMedicationPageProps) {
  const { id } = await params;
  const result = await fetchMedication(id);

  if (result.error || !result.data) {
    return (
      <div className="px-4 py-6 sm:px-5">
        <div className="max-w-5xl">
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {result.error ?? "Medication not found"}
          </div>
        </div>
      </div>
    );
  }

  async function handleSubmit(
    data: MedicationFormData
  ): Promise<{ error?: string }> {
    "use server";

    return updateMedication(id, data);
  }

  return (
    <div className="px-4 py-6 sm:px-5">
      <div className="mb-5 max-w-5xl">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Edit medication</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Update the details for {result.data.name}.
        </p>
      </div>

      <MedicationForm
        mode="edit"
        defaultValues={result.data}
        onSubmit={handleSubmit}
        cancelHref={`/medications/${id}`}
        successRedirect={`/medications/${id}`}
      />
    </div>
  );
}
