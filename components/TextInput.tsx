import type { InputHTMLAttributes } from "react";

import { cx } from "@/lib/cx";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function TextInput({ className, error, label, ...props }: TextInputProps): JSX.Element {
  return (
    <label className="block w-full">
      {label ? <span className="mb-2 block text-small font-semibold text-neutral-700">{label}</span> : null}
      <input
        className={cx(
          "h-12 w-full rounded-md border border-neutral-300 bg-white px-4 text-neutral-900 transition focus:border-primary-300",
          error && "border-rose-400",
          className
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-small text-rose-500">{error}</span> : null}
    </label>
  );
}