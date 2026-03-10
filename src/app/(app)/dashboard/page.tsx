"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useProfileStore } from "@/stores/profile-store";
import { fetchMedications } from "@/actions/medications";
import { LowStockSummary } from "@/components/dashboard/low-stock-summary";
import { TodaysSchedule } from "@/components/dashboard/todays-schedule";
import { MedicationQuickList } from "@/components/dashboard/medication-quick-list";
import type { Medication } from "@/lib/types/database";
import { format } from "date-fns";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top row skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low stock summary skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-200" />
            <div className="h-5 w-28 bg-slate-200 rounded" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl"
              >
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-20 bg-slate-100 rounded" />
                </div>
                <div className="h-4 w-12 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Today's schedule skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-200" />
            <div className="space-y-1">
              <div className="h-5 w-36 bg-slate-200 rounded" />
              <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-50"
              >
                <div className="space-y-1.5">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-5 w-14 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick list skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200" />
            <div className="h-5 w-32 bg-slate-200 rounded" />
          </div>
          <div className="h-4 w-14 bg-slate-100 rounded" />
        </div>
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-3"
            >
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-36 bg-slate-200 rounded" />
                <div className="h-3 w-24 bg-slate-100 rounded" />
              </div>
              <div className="h-8 w-32 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        {activeProfile && (
          <p className="text-sm text-slate-500 mt-0.5">
            {activeProfile.name}&apos;s overview
          </p>
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
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Top row: low stock + today's schedule side by side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LowStockSummary medications={medications} />
            <TodaysSchedule medications={medications} today={todayDayName} />
          </div>

          {/* Full medication quick list */}
          <MedicationQuickList medications={medications} />
        </div>
      )}
    </div>
  );
}
