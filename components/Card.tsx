import type { HTMLAttributes, PropsWithChildren } from "react";

import { cx } from "@/lib/cx";

interface CardProps extends PropsWithChildren, HTMLAttributes<HTMLDivElement> {
}

export function Card({ children, className, ...props }: CardProps): JSX.Element {
  const hasBackgroundOverride = /(^|\s)!?bg(?:-|\[)/.test(className ?? "");
  const hasBorderOverride = /(^|\s)!?border(?:$|-|\[)/.test(className ?? "");

  return (
    <div
      className={cx(
        "rounded-[28px] shadow-1",
        !hasBorderOverride && "border border-primary-300/60",
        !hasBackgroundOverride && "bg-white",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}