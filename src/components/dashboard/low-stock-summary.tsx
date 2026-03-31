import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { format } from "date-fns";
import type { Medication } from "@/lib/types/database";
import { calculateRunOutDate, daysUntilRunOut } from "@/lib/utils/forecast";

interface LowStockSummaryProps {
  medications: Medication[];
}

export function LowStockSummary({ medications }: LowStockSummaryProps) {
  const today = new Date();
  const lowStockMedications = medications
    .filter((medication) => medication.quantity <= medication.low_stock_threshold)
    .map((medication) => ({
      ...medication,
      daysLeft: daysUntilRunOut(
        medication.quantity,
        medication.dosage_amount,
        medication.frequency,
        medication.schedule_days,
        today
      ),
      runOutDate: calculateRunOutDate(
        medication.quantity,
        medication.dosage_amount,
        medication.frequency,
        medication.schedule_days,
        today
      ),
    }))
    .sort((left, right) => left.daysLeft - right.daysLeft)
    .slice(0, 5);

  const totalLowStock = medications.filter(
    (medication) => medication.quantity <= medication.low_stock_threshold
  ).length;

  return (
    <section className="rounded-[22px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700">
            <WarningCircle size={18} weight="duotone" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight text-slate-900">
              Refill pressure
            </h2>
            <p className="text-[13px] text-slate-500">
              Track what needs attention before stock runs out.
            </p>
          </div>
        </div>

        <span className="rounded-xl border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
          {totalLowStock} at risk
        </span>
      </div>

      {lowStockMedications.length === 0 ? (
        <div className="mt-5 rounded-[18px] border border-emerald-200 bg-emerald-50/70 px-4 py-6">
          <p className="text-sm font-medium text-emerald-800">
            No low-stock medications right now.
          </p>
          <p className="mt-1 text-[13px] text-emerald-700/80">
            Current inventory levels are above every refill threshold.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-2.5">
          {lowStockMedications.map((medication) => {
            const isOutOfStock = medication.quantity === 0;

            return (
              <Link
                key={medication.id}
                href={`/medications/${medication.id}`}
                className="flex items-center justify-between gap-3 rounded-[16px] border border-slate-200/80 bg-slate-50/80 px-3.5 py-3 transition-colors hover:border-emerald-200 hover:bg-white"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {medication.name}
                  </p>
                  <p
                    className={`mt-0.5 text-[13px] ${
                      isOutOfStock ? "text-red-600" : "text-amber-700"
                    }`}
                  >
                    {isOutOfStock
                      ? "Out of stock"
                      : medication.runOutDate
                        ? `Runs out ${format(medication.runOutDate, "MMM d")} in about ${medication.daysLeft} day${medication.daysLeft !== 1 ? "s" : ""}`
                        : "Low stock"}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`text-base font-semibold tabular-nums ${
                      isOutOfStock ? "text-red-600" : "text-amber-700"
                    }`}
                  >
                    {medication.quantity}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {medication.unit_type}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
