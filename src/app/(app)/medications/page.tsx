"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useProfileStore } from "@/stores/profile-store";
import { fetchMedications } from "@/actions/medications";
import { MedicationList } from "@/components/medications/medication-list";
import type { Medication } from "@/lib/types/database";

function MedicationsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3 animate-pulse"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-2/3 bg-slate-200 rounded" />
            <div className="h-5 w-16 bg-slate-100 rounded-full" />
          </div>
          <div className="h-4 w-1/2 bg-slate-100 rounded" />
          <div className="flex gap-1">
            {Array.from({ length: 7 }).map((_, j) => (
              <div key={j} className="h-5 w-7 bg-slate-100 rounded" />
            ))}
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between">
            <div className="h-8 w-32 bg-slate-200 rounded-lg" />
            <div className="h-3 w-16 bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MedicationsPage() {
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMedications = useCallback(async () => {
    if (!activeProfileId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    const result = await fetchMedications(activeProfileId);
    if (result.error) {
      setError(result.error);
    } else {
      setMedications(result.data ?? []);
    }
    setIsLoading(false);
  }, [activeProfileId]);

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  return (
    <div className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Medications</h1>
          {!isLoading && !error && (
            <p className="text-sm text-slate-500 mt-0.5">
              {medications.length} medication{medications.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <Link
          href="/medications/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 active:bg-teal-800 transition-colors text-sm font-medium shadow-sm"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-4 h-4 flex-shrink-0"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Medication
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-4 h-4 flex-shrink-0"
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

      {/* Content */}
      {isLoading ? <MedicationsSkeleton /> : <MedicationList medications={medications} />}
    </div>
  );
}
