interface StockBadgeProps {
  quantity: number;
  threshold: number;
}

export function StockBadge({ quantity, threshold }: StockBadgeProps) {
  if (quantity === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
        Out of Stock
      </span>
    );
  }
  if (quantity <= threshold) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
        Low Stock
      </span>
    );
  }
  return null;
}
