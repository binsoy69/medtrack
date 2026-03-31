import { redirect } from "next/navigation";
import { createMedication } from "@/actions/medications";
import { getAppContext } from "@/lib/data/app-context";
import { MedicationForm } from "@/components/medications/medication-form";
import type { MedicationFormData } from "@/lib/validators/medication";

export default async function NewMedicationPage() {
  const { activeProfile, activeProfileId } = await getAppContext();

  if (!activeProfileId) {
    redirect("/settings");
  }

  const profileId = activeProfileId;

  async function handleSubmit(
    data: MedicationFormData
  ): Promise<{ error?: string }> {
    "use server";

    return createMedication(profileId, data);
  }

  return (
    <div className="px-4 py-6 sm:px-5">
      <div className="mb-5 max-w-5xl">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Add medication</h1>
        <p className="mt-0.5 text-[13px] text-slate-500">
          Full detail entry for {activeProfile?.name ?? "your active profile"}.
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
