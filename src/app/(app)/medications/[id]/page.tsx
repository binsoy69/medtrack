"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchMedication, deleteMedication } from "@/actions/medications";
import { MedicationDetail } from "@/components/medications/medication-detail";
import { DeductionLog } from "@/components/medications/deduction-log";
import { QuantityAdjuster } from "@/components/medications/quantity-adjuster";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import type { Medication } from "@/lib/types/database";

export default function MedicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const medicationId = params.id as string;

  const [medication, setMedication] = useState<Medication | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMedication = useCallback(async () => {
    const result = await fetchMedication(medicationId);
    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      setMedication(result.data);
      setQuantity(result.data.quantity);
    }
    setIsLoading(false);
  }, [medicationId]);

  useEffect(() => {
    loadMedication();
  }, [loadMedication]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteMedication(medicationId);
    if (result?.error) {
      setError(result.error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
    // redirect happens from server action
  };

  const handleQuantityChange = (newQty: number) => {
    setQuantity(newQty);
    if (medication) {
      setMedication({ ...medication, quantity: newQty });
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-20 bg-slate-200 rounded" />
          </div>
          <div className="h-8 w-64 bg-slate-200 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded" />
              <div className="h-4 w-3/4 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !medication) {
    return (
      <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error ?? "Medication not found"}
        </div>
        <Link
          href="/medications"
          className="inline-flex items-center gap-1 mt-4 text-sm text-teal-600 hover:text-teal-700 font-medium"
        >
          ← Back to medications
        </Link>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/medications"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-teal-600 transition-colors mb-4"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Medications
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {medication.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {medication.quantity} {medication.unit_type} remaining
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href={`/medications/${medicationId}/edit`}>
            <Button variant="secondary" size="sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-4 h-4 mr-1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              Edit
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-4 h-4 mr-1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Quantity Adjuster */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Quick Adjust
          </span>
          <QuantityAdjuster
            medicationId={medicationId}
            quantity={quantity}
            unit={medication.unit_type}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </div>

      {/* Detail sections */}
      <MedicationDetail medication={{ ...medication, quantity }} />

      {/* Deduction Log */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Deduction History
        </h2>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <DeductionLog medicationId={medicationId} />
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Medication"
        message={`Are you sure you want to delete "${medication.name}"? This will also delete all deduction history. This action cannot be undone.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete"}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
}
