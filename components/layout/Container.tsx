import type { ElementType, HTMLAttributes, PropsWithChildren } from "react";

import { cx } from "@/lib/cx";

interface ContainerProps extends PropsWithChildren, HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export function Container({ as: Component = "div", children, className, ...props }: ContainerProps): JSX.Element {
  return (
    <Component className={cx("mx-auto w-full max-w-content px-5 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </Component>
  );
}