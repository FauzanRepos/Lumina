"use client";

import Link from "next/link";
import { Image } from "@/components/Image";
import { useState } from "react";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { cx } from "@/lib/cx";
import type { Psychologist } from "@/types/content";

interface PsychologistCardProps {
  psychologist: Psychologist;
  className?: string;
  revealDelay?: number;
  /** compact = portrait card used in carousels; default = full listing card */
  compact?: boolean;
}

export function PsychologistCard({ psychologist, className, revealDelay, compact }: PsychologistCardProps): JSX.Element {
  const candidates = psychologist.photo
    ? [psychologist.photo, "/icon/placeholder.svg"]
    : [
        `/content/upload/psychologist-${psychologist.id}.jpg`,
        `/content/upload/${psychologist.id}.jpg`,
        "/icon/placeholder.svg",
      ];

  const [srcIndex, setSrcIndex] = useState(0);
  const currentSrc = srcIndex < candidates.length ? candidates[srcIndex] : null;

  const displayTitle = (psychologist as any).title ?? (psychologist as any).psikolog ?? "";
  const displayUniversity = (psychologist as any).university ?? (psychologist as any).almamater ?? "";
  const displayShortBio = psychologist.shortBio ?? (psychologist as any).bio ?? (psychologist as any).bioParagraphs?.[0] ?? "";
  const displaySpecialties: string[] = psychologist.specialties ?? (psychologist as any).tags ?? [];
  
  const displayName = psychologist.name.replace(/,\s*[A-Z]\.[A-Z]\.?.*$/g, "").trim();

  /* ── Compact (portrait carousel) card ───────────────────────────────── */
  if (compact) {
    return (
      <Card
        className={cx("flex min-w-[220px] flex-col overflow-hidden p-0 transition duration-150 hover:-translate-y-1 hover:shadow-2 rounded-[24px]", className)}
        data-reveal
        data-reveal-delay={revealDelay?.toString()}
      >
        <div className="relative h-48 w-full overflow-hidden bg-primary-300/20">
          {currentSrc ? (
            <Image
              fill
              alt={psychologist.name}
              className="object-cover object-top"
              src={currentSrc}
              onError={() => setSrcIndex((prev) => prev + 1)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-4xl font-semibold text-primary-600">
              {psychologist.initials}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-display text-base font-semibold leading-tight text-neutral-900">{displayName}</h3>
          <p className="mt-0.5 text-xs font-medium text-primary-600">{displayTitle}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {displaySpecialties.slice(0, 2).map((specialty) => (
              <span key={specialty} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
                {specialty}
              </span>
            ))}
            {displaySpecialties.length > 2 && (
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
                {displaySpecialties.length - 2}+
              </span>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <Link className={cx(buttonClasses({ variant: "secondary", size: "sm" }), "flex-1 text-center [border-radius:16px]")} href={`/psychologists/${psychologist.id}`}>
              Lihat Profil
            </Link>
            <Link className={cx(buttonClasses({ variant: "primary", size: "sm" }), "flex-1 text-center [border-radius:16px]")} href={`/booking/${psychologist.id}`}>
              Book
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  /* ── Full listing card ───────────────────────────────────────────────── */
  return (
    <Card
      className={cx("flex h-full flex-col p-5 transition duration-150 hover:-translate-y-0.5 hover:shadow-2", className)}
      data-reveal
      data-reveal-delay={revealDelay?.toString()}
    >
      {/* Top row: avatar + name */}
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full bg-primary-300/25">
            {currentSrc ? (
              <Image
                fill
                alt={psychologist.name}
                className="object-cover object-top"
                src={currentSrc}
                onError={() => setSrcIndex((prev) => prev + 1)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-2xl font-semibold text-primary-600">
                {psychologist.initials}
              </div>
            )}
          </div>
          {/* Checkmark badge */}
          <div className="absolute -bottom-0.5 -right-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary-600 text-white shadow-sm">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[17px] font-semibold leading-snug text-neutral-900">{displayName}</h3>
          <p className="mt-0.5 text-xs font-medium text-primary-600">
            {displayTitle} • {displayUniversity}
          </p>
        </div>
      </div>

      {/* Bio */}
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600">{displayShortBio}</p>

      {/* Tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {displaySpecialties.slice(0, 4).map((specialty) => (
          <span key={specialty} className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
            {specialty}
          </span>
        ))}
        {displaySpecialties.length > 4 && (
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium text-neutral-600">
            {displaySpecialties.length - 4}+
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-5 flex gap-2">
        <Link className={cx(buttonClasses({ variant: "secondary", size: "sm" }), "flex-1 text-center [border-radius:16px]")} href={`/psychologists/${psychologist.id}`}>
          Lihat Profil
        </Link>
        <Link className={cx(buttonClasses({ variant: "primary", size: "sm" }), "flex-1 text-center [border-radius:16px]")} href={`/booking/${psychologist.id}`}>
          Book Now
        </Link>
      </div>
    </Card>
  );
}
