"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { fetchDeductionLogs } from "@/actions/medications";
import type { DeductionLog as DeductionLogType } from "@/lib/types/database";
import { Button } from "@/components/ui/button";

const TYPE_STYLES: Record<string, { label: string; className: string }> = {
  auto: {
    label: "Auto",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  "auto-backfill": {
    label: "Backfill",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
  manual: {
    label: "Manual",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

interface DeductionLogProps {
  medicationId: string;
}

export function DeductionLog({ medicationId }: DeductionLogProps) {
  const [logs, setLogs] = useState<DeductionLogType[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const loadLogs = useCallback(
    async (pageNum: number) => {
      setIsLoading(true);
      const result = await fetchDeductionLogs(medicationId, pageNum);
      if (result.data) {
        if (pageNum === 0) {
          setLogs(result.data.logs);
        } else {
          setLogs((prev) => [...prev, ...result.data!.logs]);
        }
        setHasMore(result.data.hasMore);
        setPage(pageNum);
      }
      setIsLoading(false);
      setInitialLoaded(true);
    },
    [medicationId]
  );

  // Load on first render
  if (!initialLoaded && !isLoading) {
    loadLogs(0);
  }

  if (!initialLoaded) {
    return (
      <div className="animate-pulse space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic py-4">
        No deduction history yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        {logs.map((log) => {
          const style = TYPE_STYLES[log.type] ?? TYPE_STYLES.manual;
          const isDeduction = log.amount_deducted > 0;
          return (
            <div
              key={log.id}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${style.className}`}
                >
                  {style.label}
                </span>
                <span className="text-sm text-slate-600 truncate">
                  {format(new Date(log.deduction_date + "T00:00:00"), "MMM d, yyyy")}
                </span>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span
                  className={`text-sm font-medium tabular-nums ${
                    isDeduction ? "text-red-600" : "text-emerald-600"
                  }`}
                >
                  {isDeduction ? "−" : "+"}
                  {Math.abs(log.amount_deducted)}
                </span>
                <span className="text-xs text-slate-400 tabular-nums w-16 text-right">
                  → {log.quantity_after}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => loadLogs(page + 1)}
            isLoading={isLoading}
            className="w-full"
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
