"use client";

import { useProfileStore } from "@/stores/profile-store";
import { createMedication } from "@/actions/medications";
import { MedicationForm } from "@/components/medications/medication-form";
import type { MedicationFormData } from "@/lib/validators/medication";

export default function NewMedicationPage() {
  const activeProfileId = useProfileStore((s) => s.activeProfileId);

  const handleSubmit = async (
    data: MedicationFormData
  ): Promise<{ error?: string }> => {
    if (!activeProfileId) return { error: "No active profile selected" };
    const result = await createMedication(activeProfileId, data);
    return result ?? {};
  };

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Add Medication</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Add a new medication to track its inventory and schedule.
        </p>
      </div>

      <MedicationForm
        mode="create"
        onSubmit={handleSubmit}
        cancelHref="/medications"
        successRedirect="/medications"
      />
    </div>
  );
}
