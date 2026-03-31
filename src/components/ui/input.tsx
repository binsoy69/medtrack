import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-xl border bg-slate-50 px-3 py-2 text-sm text-slate-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
          error
            ? "border-red-400 focus-visible:ring-red-500"
            : "border-slate-200 focus-visible:border-emerald-300 focus-visible:bg-white focus-visible:ring-emerald-400/60"
        } ${className}`}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";
