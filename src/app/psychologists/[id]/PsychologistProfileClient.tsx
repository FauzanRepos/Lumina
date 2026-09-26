"use client";

import { Image } from "@/components/Image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { PsychologistCard } from "@/components/PsychologistCard";
import { Container } from "@/components/layout/Container";
import type { Psychologist } from "@/types/content";
import profileCards from '@/public/content/site/psychologists.json';
import { formatRupiah } from "@/lib/formatting";
import { usePageReveal } from "@/lib/usePageReveal";

const accentToneClass = {
  sky: "from-sky-100 to-primary-300/80",
  mint: "from-emerald-100 to-accent-300",
  peach: "from-amber-100 to-rose-100",
  lavender: "from-violet-100 to-sky-100",
  amber: "from-amber-100 to-orange-100",
};

const profileCardsData = profileCards as unknown as { content: any[] };

const psychologists: Psychologist[] = (profileCardsData.content ?? []).map((p: any) => ({
  id: p.id,
  name: p.name || p.fullName || "",
  fullName: p.fullName || p.name || "",
  title: p.psikolog ?? p.title ?? "",
  university: p.almamater ?? p.university ?? "",
  shortBio: p.bio ?? p.shortBio ?? "",
  bio: Array.isArray(p.bioParagraphs)
    ? p.bioParagraphs
    : p.bio
    ? Array.isArray(p.bio)
      ? p.bio
      : [p.bio]
    : [],
  specialties: p.tags ?? p.specialties ?? [],
  sessionTypes: p.sessionTypes ?? [],
  sessionFee: p.sessionFee ?? 0,
  originalFee: p.originalFee,
  sessionDuration: p.sessionDuration ?? 60,
  initials: p.initials ?? "",
  accent: (p.accent as Psychologist["accent"]) ?? "sky",
  photo: p.photo ?? undefined,
  education: p.education ?? [],
  licenses: p.licenses ?? [],
  focusAreas: p.focusAreas ?? [],
  availability: p.availability ?? {},
}));

export default function PsychologistProfileClient({ psychologist }: { psychologist: Psychologist | null }): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (!psychologist) {
      return;
    }

    const availableDates = Object.keys(psychologist.availability);
    const nextDate = availableDates[0] ?? "";

    setSelectedDate((current) => (current && psychologist.availability[current] ? current : nextDate));
  }, [psychologist]);

  useEffect(() => {
    if (!psychologist || !selectedDate) {
      return;
    }

    const nextSlots = psychologist.availability[selectedDate] ?? [];
    setSelectedTime((current) => (nextSlots.includes(current) ? current : nextSlots[0] ?? ""));
  }, [psychologist, selectedDate]);

  const availableDates = psychologist ? Object.keys(psychologist.availability) : [];
  const availableTimes = psychologist && selectedDate ? psychologist.availability[selectedDate] ?? [] : [];
  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "numeric", month: "long" }).format(new Date(`${selectedDate}T00:00:00`))
    : null;
  const nextSlotSummary = selectedDateLabel && selectedTime ? `${selectedDateLabel} • ${selectedTime} WIB` : null;
  const relatedPsychologists = useMemo(
    () => psychologists.filter((entry) => entry.id !== psychologist?.id).slice(0, 4),
    [psychologist?.id]
  );

  if (!psychologist) {
    return (
      <main className="pb-24 pt-12">
        <Container>
          <Card className="p-8 sm:p-10">
            <h1 className="font-display text-3xl font-semibold text-neutral-900">Profil psikolog tidak ditemukan</h1>
            <p className="mt-3 text-body text-neutral-700">
              Halaman yang Anda cari belum tersedia atau tautannya sudah berubah.
            </p>
            <Link className={`${buttonClasses({ variant: "primary", size: "md" })} mt-6 inline-flex`} href="/psychologists">
              Kembali ke daftar psikolog
            </Link>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="pb-6 pt-8 sm:pt-12" ref={pageRef}>
      <Container>
        <div className="mb-8" data-reveal>
          <Link className="inline-flex items-center gap-2 text-small font-semibold text-primary-600" href="/psychologists">
            <span className="text-xl">←</span>
            Kembali ke daftar psikolog
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.04fr_360px] xl:grid-cols-[1.08fr_400px]">
          <div className="relative pt-2" data-reveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
              <div
                className={`flex h-[280px] w-full max-w-[280px] lg:max-w-[220px] shrink-0 items-center justify-center overflow-hidden rounded-[32px] bg-gradient-to-br ${accentToneClass[psychologist.accent]} font-display text-5xl font-semibold text-neutral-900 shadow-sm`}
              >
                {psychologist.photo ? (
                  <Image
                    alt={psychologist.name}
                    className="h-full w-full object-cover object-top"
                    height={280}
                    src={psychologist.photo}
                    width={220}
                  />
                ) : (
                  psychologist.initials
                )}
              </div>

              <div className="space-y-4 pt-2">
                <h1 className="font-display text-2xl font-semibold leading-snug text-neutral-900 sm:text-3xl lg:text-4xl">
                  {psychologist.fullName || psychologist.name}
                </h1>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {psychologist.specialties.map((specialty) => (
                    <span key={specialty} className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
                      {specialty}
                    </span>
                  ))}
                  <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700">
                    2+
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <Card className="rounded-[32px] border-neutral-200 bg-primary-50/50 p-6" data-reveal data-reveal-delay="0.08">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-neutral-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
                  </span>
                  Pendidikan
                </h2>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-700">
                  {psychologist.education.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="rounded-[32px] border-neutral-200 bg-primary-50/50 p-6" data-reveal data-reveal-delay="0.14">
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-neutral-900">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  Izin Praktik
                </h2>
                <ul className="mt-5 space-y-3 text-sm leading-relaxed text-neutral-700">
                  {psychologist.licenses.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="mt-12 space-y-5 text-base leading-relaxed text-neutral-700">
              {psychologist.bio.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-12">
              <div className="inline-flex items-center rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm">
                Area Keahlian Utama
              </div>
              <div className="mt-8 space-y-8">
                {psychologist.focusAreas.map((focusArea) => (
                  <div key={focusArea.title} className="flex gap-4">
                    <div className="mt-1 shrink-0 text-primary-500">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-neutral-900">{focusArea.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{focusArea.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex items-center gap-3 border-t border-neutral-200 pt-6 text-sm text-neutral-700">
              <span className="font-bold text-neutral-900">Layanan via:</span>
              <span className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-primary-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {psychologist.sessionTypes.join(" • ")}
              </span>
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            {/* Select date & time card */}
            <div data-reveal data-reveal-delay="0.12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-neutral-900">Select date &amp; time</h2>
              </div>
              <Card className="p-5 shadow-sm rounded-[24px] border-neutral-200">
                {/* Month navigation */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-neutral-900">
                    {selectedDate
                      ? new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric" }).format(new Date(`${selectedDate}T00:00:00`))
                      : "—"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      aria-label="Previous month"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
                      onClick={() => {
                        if (!availableDates.length) return;
                        const cur = selectedDate || availableDates[0];
                        const curIdx = availableDates.indexOf(cur);
                        if (curIdx > 0) setSelectedDate(availableDates[curIdx - 1]);
                      }}
                      type="button"
                    >
                      ‹
                    </button>
                    <button
                      aria-label="Next month"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
                      onClick={() => {
                        if (!availableDates.length) return;
                        const cur = selectedDate || availableDates[0];
                        const curIdx = availableDates.indexOf(cur);
                        if (curIdx < availableDates.length - 1) setSelectedDate(availableDates[curIdx + 1]);
                      }}
                      type="button"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Calendar area placeholder (Figma design uses a gray box) */}
                <div className="mt-4 h-48 w-full rounded-2xl bg-neutral-200" />
              </Card>
              
              {/* Selected day label */}
              {selectedDateLabel && (
                <div className="mt-5 mb-3 flex items-center justify-between">
                  <div className="w-1/2"></div>
                  <p className="text-sm font-semibold text-neutral-900 text-right w-1/2 border-b-2 border-primary-500 pb-1">{selectedDateLabel}</p>
                </div>
              )}

              {/* Time slots */}
              {availableTimes.length > 0 && (
                <div className="mt-3 flex flex-col items-end gap-2">
                  {availableTimes.map((time) => {
                    const isActive = time === selectedTime;
                    return (
                      <button
                        key={time}
                        className={`w-[48%] rounded-full border px-4 py-2 text-sm font-semibold transition ${
                          isActive
                            ? "border-primary-400 text-primary-600 bg-white"
                            : "border-neutral-300 bg-white text-neutral-600 hover:border-primary-300"
                        }`}
                        onClick={() => setSelectedTime(time)}
                        type="button"
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Session Fee card */}
            <Card className="p-6 bg-[#F4FAFC] border-none shadow-none mt-6" data-reveal data-reveal-delay="0.18">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-primary-600">Session Fee</p>
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700">
                    <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                    Limited slots
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="font-display text-xl font-bold text-neutral-900">
                      {formatRupiah(psychologist.sessionFee)}
                    </span>
                    <span className="text-sm font-medium text-neutral-700">/ sesi</span>
                  </div>
                  {psychologist.originalFee ? (
                    <div className="mt-1 flex items-center justify-end gap-2">
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                        -{Math.round((1 - psychologist.sessionFee / psychologist.originalFee) * 100)}%
                      </span>
                      <span className="text-xs font-semibold text-red-500 line-through">{formatRupiah(psychologist.originalFee)}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-xs font-medium text-neutral-700">
                <li className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded bg-white p-1 text-neutral-600">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" /></svg>
                  </div>
                  {psychologist.sessionDuration} menit
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded bg-white p-1 text-neutral-600">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" /></svg>
                  </div>
                  Sesi 1-on-1
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex items-center justify-center rounded bg-white p-1 text-neutral-600">
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </div>
                  {psychologist.sessionTypes[0] ?? "Konsultasi Online"}
                </li>
              </ul>
            </Card>

            <Link
              className={`${buttonClasses({ variant: "primary", size: "lg", fullWidth: true })} mt-6 shadow-md`}
              href={{
                pathname: `/booking/${psychologist.id}`,
                query: selectedDate && selectedTime ? { date: selectedDate, time: selectedTime } : undefined,
              }}
            >
              Book Now
            </Link>
          </div>
        </section>
      </Container>

      {/* Lihat Psikolog Lainnya */}
      <section className="mt-20 pb-12">
        <Container>
          <div className="flex items-end justify-between gap-4" data-reveal>
            <div>
              <h2 className="font-display text-3xl font-semibold text-neutral-900">Lihat Psikolog Lainnya</h2>
              <p className="mt-1 text-sm text-neutral-500">Psikolog profesional lainnya yang mungkin sesuai dengan kebutuhanmu</p>
            </div>
            <div className="flex gap-2">
              <button
                aria-label="Scroll left"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100"
                onClick={() => {
                  const el = document.getElementById("related-rail");
                  el?.scrollBy({ left: -280, behavior: "smooth" });
                }}
                type="button"
              >‹</button>
              <button
                aria-label="Scroll right"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white hover:bg-primary-500"
                onClick={() => {
                  const el = document.getElementById("related-rail");
                  el?.scrollBy({ left: 280, behavior: "smooth" });
                }}
                type="button"
              >›</button>
            </div>
          </div>
          <div
            className="mt-6 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            id="related-rail"
          >
            {relatedPsychologists.map((item, index) => (
              <div key={item.id} className="w-[220px] flex-shrink-0">
                <PsychologistCard compact psychologist={item} revealDelay={index * 0.08} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner />
    </main>
  );
}
