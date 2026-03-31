"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { adjustQuantity } from "@/actions/medications";

interface QuantityAdjusterProps {
  medicationId: string;
  quantity: number;
  unit: string;
  onQuantityChange: (newQuantity: number) => void;
}

export function QuantityAdjuster({
  medicationId,
  quantity,
  unit,
  onQuantityChange,
}: QuantityAdjusterProps) {
  const [isPending, startTransition] = useTransition();

  function handleAdjust(amount: number) {
    const optimisticQuantity = Math.max(0, quantity + amount);
    const previousQuantity = quantity;
    onQuantityChange(optimisticQuantity);

    startTransition(async () => {
      const result = await adjustQuantity(medicationId, amount);

      if (result.error) {
        onQuantityChange(previousQuantity);
        toast.error(result.error);
        return;
      }

      if (result.data) {
        onQuantityChange(result.data.newQuantity);
      }
    });
  }

  return (
    <div
      className="flex items-center gap-2"
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
    >
      <button
        onClick={() => handleAdjust(-1)}
        disabled={isPending || quantity === 0}
        aria-label={`Remove 1 ${unit}`}
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        -
      </button>

      <div className="flex min-w-[4.5rem] items-baseline justify-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5">
        <span
          className={`text-base font-semibold tabular-nums transition-opacity ${
            isPending ? "opacity-50" : "text-slate-900"
          }`}
        >
          {quantity}
        </span>
        <span className="max-w-[3rem] truncate text-xs text-slate-400">
          {unit}
        </span>
      </div>

      <button
        onClick={() => handleAdjust(1)}
        disabled={isPending}
        aria-label={`Add 1 ${unit}`}
        className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
