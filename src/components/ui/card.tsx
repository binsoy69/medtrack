import * as React from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-[20px] border border-slate-200/80 bg-white/90 text-slate-950 shadow-[0_20px_40px_-34px_rgba(15,23,42,0.35)] backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
