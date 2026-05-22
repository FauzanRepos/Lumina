import Image from "next/image";

import { cx } from "@/lib/cx";

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <Image
        alt="Lumina Consulting"
        className={cx("h-auto", compact ? "w-[148px]" : "w-[211px]")}
        height={44}
        priority={!compact}
        src="/homepage/logo-lumina-consulting.png"
        width={211}
      />
      {!compact ? <p className="pl-1 text-small text-neutral-500">Let&apos;s Start Today For A Better Future</p> : null}
    </div>
  );
}