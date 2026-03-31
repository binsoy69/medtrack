import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px";

    const variants = {
      primary:
        "bg-emerald-700 text-white shadow-[0_22px_45px_-28px_rgba(4,120,87,0.65)] hover:bg-emerald-800",
      secondary:
        "border border-slate-200 bg-white text-slate-700 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)] hover:border-emerald-300 hover:text-emerald-700",
      danger:
        "bg-red-600 text-white shadow-[0_22px_45px_-28px_rgba(220,38,38,0.55)] hover:bg-red-700",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    };

    const sizes = {
      sm: "h-8 px-3 text-[13px]",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-5 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
