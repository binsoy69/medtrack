"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchMedication, updateMedication } from "@/actions/medications";
import { MedicationForm } from "@/components/medications/medication-form";
import type { Medication } from "@/lib/types/database";
import type { MedicationFormData } from "@/lib/validators/medication";

export default function EditMedicationPage() {
  const params = useParams();
  const medicationId = params.id as string;

  const [medication, setMedication] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const result = await fetchMedication(medicationId);
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setMedication(result.data);
      }
      setIsLoading(false);
    }
    load();
  }, [medicationId]);

  const handleSubmit = async (
    data: MedicationFormData
  ): Promise<{ error?: string }> => {
    const result = await updateMedication(medicationId, data);
    return result ?? {};
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-64 bg-slate-100 rounded" />
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-slate-200 p-5 space-y-3"
              >
                <div className="h-5 w-24 bg-slate-200 rounded" />
                <div className="h-10 w-full bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !medication) {
    return (
      <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error ?? "Medication not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit Medication</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Update the details for {medication.name}.
        </p>
      </div>

      <MedicationForm
        mode="edit"
        defaultValues={medication}
        onSubmit={handleSubmit}
        cancelHref={`/medications/${medicationId}`}
      />
    </div>
  );
}
