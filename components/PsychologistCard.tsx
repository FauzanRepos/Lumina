import Link from "next/link";
import { useState } from "react";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { cx } from "@/lib/cx";
import { formatRupiah } from "@/lib/formatting";
import type { Psychologist } from "@/types/content";

const accentToneClass: Record<Psychologist["accent"], string> = {
  sky: "from-sky-100 to-primary-300/80",
  mint: "from-emerald-100 to-accent-300",
  peach: "from-amber-100 to-rose-100",
  lavender: "from-violet-100 to-sky-100",
  amber: "from-amber-100 to-orange-100",
};

interface PsychologistCardProps {
  psychologist: Psychologist;
  className?: string;
  revealDelay?: number;
}

export function PsychologistCard({ psychologist, className, revealDelay }: PsychologistCardProps): JSX.Element {
  const candidates = [
    `/psychologists/profile/${psychologist.id}.png`,
    `/homepage/psychologist-${psychologist.id}.png`,
  ];
  const [srcIndex, setSrcIndex] = useState(0);
  const currentSrc = srcIndex < candidates.length ? candidates[srcIndex] : null;

  const nextAvailability = Object.keys(psychologist.availability)[0];
  const nextAvailabilityLabel = nextAvailability
    ? new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(`${nextAvailability}T00:00:00`))
    : "Fleksibel";

  return (
    <Card
      className={cx("group flex h-full flex-col overflow-hidden p-0 transition duration-150 hover:-translate-y-1 hover:shadow-2", className)}
      data-reveal
      data-reveal-delay={revealDelay?.toString()}
    >
      <div className={`relative min-h-[190px] overflow-hidden bg-gradient-to-br ${accentToneClass[psychologist.accent]} p-5`}>
        <div className="absolute right-[-28px] top-[-28px] h-32 w-32 rounded-full border-[18px] border-white/30" />
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-700">
            Bersertifikat
          </span>
          <span className="rounded-full bg-neutral-900/85 px-3 py-1 text-[11px] font-semibold text-white">
            {psychologist.sessionTypes[0]}
          </span>
        </div>

        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-white/65 overflow-hidden">
              {currentSrc ? (
                // use plain img for graceful onError fallback
                // try candidates in order; if all fail, show initials
                <img
                  alt={psychologist.name}
                  className="h-full w-full object-cover"
                  src={currentSrc}
                  onError={() => setSrcIndex((prev) => prev + 1)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-3xl font-semibold text-neutral-900 bg-white/65">
                  {psychologist.initials}
                </div>
              )}
            </div>
            <p className="mt-3 text-xs font-medium text-neutral-700">Jadwal berikut · {nextAvailabilityLabel}</p>
          </div>

          <div className="rounded-[24px] bg-white/75 px-4 py-3 text-right text-neutral-900 shadow-1 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">Mulai dari</p>
            <p className="mt-1 font-display text-xl font-semibold">{formatRupiah(psychologist.sessionFee)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-1">
          <h3 className="font-display text-2xl font-semibold leading-tight text-neutral-900">{psychologist.name}</h3>
          <p className="text-small font-medium text-primary-600">
            {psychologist.title} • {psychologist.university}
          </p>
        </div>

        <p className="mt-4 text-small text-neutral-700">{psychologist.shortBio}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {psychologist.specialties.slice(0, 4).map((specialty) => (
            <span key={specialty} className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
              {specialty}
            </span>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link className={buttonClasses({ variant: "secondary", size: "sm" })} href={`/psychologists/${psychologist.id}`}>
            Lihat Profil
          </Link>
          <Link className={buttonClasses({ variant: "primary", size: "sm" })} href={`/booking/${psychologist.id}`}>
            Buat Janji
          </Link>
        </div>
      </div>
    </Card>
  );
}