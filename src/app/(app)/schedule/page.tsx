"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useProfileStore } from "@/stores/profile-store";
import { fetchMedications } from "@/actions/medications";
import { WeeklyGrid } from "@/components/schedule/weekly-grid";
import { ScheduleExportButtons } from "@/components/schedule/schedule-export-buttons";
import type { Medication } from "@/lib/types/database";
import { format } from "date-fns";

function ScheduleSkeleton() {
  return (
    <div className="space-y-4">
      {/* Desktop skeleton */}
      <div className="hidden lg:grid lg:grid-cols-7 gap-3">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 p-4 animate-pulse"
          >
            <div className="h-4 w-16 bg-slate-200 rounded mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="bg-slate-50 rounded-lg p-2.5">
                  <div className="h-3.5 w-20 bg-slate-200 rounded" />
                  <div className="h-3 w-16 bg-slate-100 rounded mt-1.5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile skeleton */}
      <div className="lg:hidden space-y-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 p-4 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-4 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SchedulePage() {
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const activeProfile = useProfileStore((s) =>
    s.profiles.find((p) => p.id === s.activeProfileId)
  );
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const todayDayName = useMemo(
    () => format(new Date(), "EEEE").toLowerCase(),
    []
  );

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Weekly Schedule
          </h1>
          {activeProfile && (
            <p className="text-sm text-slate-500 mt-0.5">
              {activeProfile.name}&apos;s medication schedule
            </p>
          )}
        </div>
        {!isLoading && (
          <ScheduleExportButtons
            profileName={activeProfile?.name ?? "Profile"}
            medications={medications}
          />
        )}
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
      {isLoading ? (
        <ScheduleSkeleton />
      ) : (
        <>
          <WeeklyGrid medications={medications} today={todayDayName} />

          <p className="text-xs text-slate-400 mt-6 text-center">
            To edit schedules, go to the medication&apos;s detail page.
          </p>
        </>
      )}
    </div>
  );
}
