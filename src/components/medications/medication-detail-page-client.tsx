"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, PencilSimple, Trash } from "@phosphor-icons/react";
import { deleteMedication } from "@/actions/medications";
import type { Medication } from "@/lib/types/database";
import { MedicationDetail } from "@/components/medications/medication-detail";
import { DeductionLog } from "@/components/medications/deduction-log";
import { QuantityAdjuster } from "@/components/medications/quantity-adjuster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";

interface MedicationDetailPageClientProps {
  medication: Medication;
}

export function MedicationDetailPageClient({
  medication,
}: MedicationDetailPageClientProps) {
  const [quantity, setQuantity] = useState(medication.quantity);
  const [localMedication, setLocalMedication] = useState(medication);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteMedication(localMedication.id);

    if (result?.error) {
      setError(result.error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  function handleQuantityChange(nextQuantity: number) {
    setQuantity(nextQuantity);
    setLocalMedication((current) => ({ ...current, quantity: nextQuantity }));
  }

  return (
    <div className="px-4 py-6 sm:px-5">
      <div className="max-w-5xl">
        <Link
          href="/medications"
          className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-slate-500 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft size={16} />
          Medications
        </Link>

        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {localMedication.name}
            </h1>
            <p className="mt-0.5 text-[13px] text-slate-500">
              {quantity} {localMedication.unit_type} remaining
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/medications/${localMedication.id}/edit`}>
              <Button variant="secondary" size="sm">
                <PencilSimple size={16} className="mr-1.5" />
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash size={16} className="mr-1.5" />
              Delete
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-5 rounded-[20px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Quick adjust
              </p>
              <p className="mt-1 text-[13px] text-slate-500">
                Update the current count without leaving this page.
              </p>
            </div>
            <QuantityAdjuster
              medicationId={localMedication.id}
              quantity={quantity}
              unit={localMedication.unit_type}
              onQuantityChange={handleQuantityChange}
            />
          </div>
        </div>

        <MedicationDetail medication={{ ...localMedication, quantity }} />

        <div className="mt-6 rounded-[20px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)] backdrop-blur">
          <h2 className="mb-3 text-base font-semibold tracking-tight text-slate-900">
            Deduction history
          </h2>
          <DeductionLog medicationId={localMedication.id} />
        </div>

        <ConfirmDialog
          open={showDeleteConfirm}
          title="Delete medication"
          message={`Are you sure you want to delete "${localMedication.name}"? This will also delete all deduction history. This action cannot be undone.`}
          confirmLabel={isDeleting ? "Deleting..." : "Delete"}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      </div>
    </div>
  );
}
