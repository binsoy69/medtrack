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
    const optimisticQty = Math.max(0, quantity + amount);
    const prevQty = quantity;
    onQuantityChange(optimisticQty);

    startTransition(async () => {
      const result = await adjustQuantity(medicationId, amount);
      if (result.error) {
        onQuantityChange(prevQty);
        toast.error(result.error);
      } else if (result.data) {
        onQuantityChange(result.data.newQuantity);
        toast.success(`Quantity updated to ${result.data.newQuantity}`);
      }
    });
  }

  return (
    <div
      className="flex items-center gap-2"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => handleAdjust(-1)}
        disabled={isPending || quantity === 0}
        aria-label={`Remove 1 ${unit}`}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold text-base leading-none"
      >
        −
      </button>

      <div className="flex items-baseline gap-1 min-w-[4.5rem] justify-center">
        <span
          className={`text-lg font-bold tabular-nums transition-opacity ${
            isPending ? "opacity-50" : "text-slate-900"
          }`}
        >
          {quantity}
        </span>
        <span className="text-xs text-slate-400 truncate max-w-[3rem]">{unit}</span>
      </div>

      <button
        onClick={() => handleAdjust(1)}
        disabled={isPending}
        aria-label={`Add 1 ${unit}`}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-teal-700 bg-teal-50 hover:bg-teal-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold text-base leading-none"
      >
        +
      </button>
    </div>
  );
}
