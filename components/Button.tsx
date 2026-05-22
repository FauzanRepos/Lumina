import type { ButtonHTMLAttributes } from "react";

import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
} = {}): string {
  const sizeClasses = {
    sm: "min-h-[42px] px-5 text-sm",
    md: "min-h-[50px] px-6 text-sm sm:text-[15px]",
    lg: "min-h-[54px] px-7 text-base",
  };

  const variantClasses = {
    primary: "bg-primary-600 text-white shadow-[0_16px_34px_rgba(18,182,216,0.22)] hover:bg-primary-500",
    secondary: "bg-white/95 text-neutral-900 ring-1 ring-primary-300/70 shadow-[0_10px_24px_rgba(15,23,36,0.06)] hover:bg-primary-300/18",
    ghost: "bg-primary-300/40 text-primary-600 hover:bg-primary-300/70",
  };

  return cx(
    "inline-flex items-center justify-center rounded-full font-semibold tracking-[0.01em] transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && "w-full"
  );
}

export function Button({
  children,
  className,
  disabled,
  loading,
  size,
  type = "button",
  variant,
  ...props
}: ButtonProps): JSX.Element {
  return (
    <button
      className={cx(buttonClasses({ variant, size }), className)}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {loading ? "Memproses..." : children}
    </button>
  );
}