"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import { Button, buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { PsychologistCard } from "@/components/PsychologistCard";
import { Container } from "@/components/layout/Container";
import { MultiSelect } from "@/components/MultiSelect";
import profileCards from '@/public/content/site/psychologists.json';
import type { Psychologist } from "@/types/content";
import { cx } from "@/lib/cx";
import { usePageReveal } from "@/lib/usePageReveal";

// Time-of-day and day-type are two independent filters. Within each group the
// options are mutually exclusive (per client revision: pagi/siang cancels malam;
// hari kerja cannot combine with akhir pekan), but a time window can be combined
// with a day type.
type TimeWindow = "day" | "night";
type DayType = "weekday" | "weekend";

const timeOptions: { id: TimeWindow; label: string }[] = [
  { id: "day", label: "Pagi / Siang" },
  { id: "night", label: "Malam" },
];

const dayTypeOptions: { id: DayType; label: string }[] = [
  { id: "weekday", label: "Hari Kerja" },
  { id: "weekend", label: "Akhir Pekan" },
];

const itemsPerPage = 4;

function matchesSchedule(
  availability: Record<string, string[]>,
  timeWindow: TimeWindow | null,
  dayType: DayType | null
): boolean {
  if (!timeWindow && !dayType) {
    return true;
  }

  return Object.entries(availability).some(([date, slots]) => {
    if (slots.length === 0) {
      return false;
    }

    const day = new Date(`${date}T00:00:00`).getDay();
    const isWeekend = day === 0 || day === 6;
    const dayTypeOk = !dayType || (dayType === "weekend" ? isWeekend : !isWeekend);

    if (!dayTypeOk) {
      return false;
    }

    return (
      !timeWindow ||
      slots.some((slot) => {
        const hour = Number(slot.split(":")[0]);
        return timeWindow === "day" ? hour < 18 : hour >= 18;
      })
    );
  });
}

export default function PsychologistsClient(): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedSessionTypes, setSelectedSessionTypes] = useState<string[]>([]);
  const [timeWindow, setTimeWindow] = useState<TimeWindow | null>(null);
  const [dayType, setDayType] = useState<DayType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const deferredQuery = useDeferredValue(searchText.trim().toLowerCase());

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

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setSearchText((params.get("q") ?? "").trim());
    } catch (e) {
      // ignore on server or if parsing fails
    }
  }, []);

  const specialtyOptions = useMemo(
    () => Array.from(new Set(psychologists.flatMap((psychologist) => psychologist.specialties))),
    [psychologists]
  );

  const filteredPsychologists = useMemo(() => {
    return psychologists.filter((psychologist) => {
      const searchTarget = `${psychologist.name} ${psychologist.title} ${psychologist.shortBio} ${psychologist.specialties.join(" ")} ${psychologist.sessionTypes.join(" ")} ${psychologist.focusAreas.map(f => f.title).join(" ")}`.toLowerCase();
      const matchesQuery = deferredQuery.length < 2 || searchTarget.includes(deferredQuery);
      const matchesSpecialties =
        selectedSpecialties.length === 0 || selectedSpecialties.some((specialty) => psychologist.specialties.includes(specialty));
      const matchesSessionTypes =
        selectedSessionTypes.length === 0 || selectedSessionTypes.some((sessionType) => psychologist.sessionTypes.includes(sessionType));

      return (
        matchesQuery &&
        matchesSpecialties &&
        matchesSessionTypes &&
        matchesSchedule(psychologist.availability, timeWindow, dayType)
      );
    });
  }, [deferredQuery, timeWindow, dayType, selectedSessionTypes, selectedSpecialties, psychologists]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredQuery, timeWindow, dayType, selectedSessionTypes, selectedSpecialties]);

  useEffect(() => {
    if (!gridRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const cards = gridRef.current.querySelectorAll("[data-grid-card]");

    if (!cards.length) {
      return undefined;
    }

    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.42, ease: "power3.out", stagger: 0.08, clearProps: "opacity,transform" }
    );

    return () => {
      gsap.killTweensOf(cards);
      gsap.set(cards, { clearProps: "opacity,transform" });
    };
  }, [currentPage, filteredPsychologists.length]);

  const totalPages = Math.max(1, Math.ceil(filteredPsychologists.length / itemsPerPage));
  const visiblePsychologists = filteredPsychologists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    try {
      const params = new URLSearchParams(window.location.search);
      if (searchText.trim()) {
        params.set("q", searchText.trim());
      } else {
        params.delete("q");
      }
      const url = params.toString() ? `/psychologists?${params.toString()}` : "/psychologists";
      window.history.replaceState({}, "", url);
    } catch (e) {
      // ignore when window is unavailable
    }
  }

  return (
    <main className="pb-6 pt-8 sm:pt-12" ref={pageRef}>
      <Container>
        <section className="py-8 sm:py-12">
          <div className="max-w-3xl space-y-6" data-reveal>
            <h1 className="font-display text-4xl font-semibold leading-[1.04] text-neutral-900 sm:text-5xl">
              Find the right <span className="text-primary-600">support</span>
              <br />for your journey.
            </h1>
            <form className="flex flex-col gap-3 sm:flex-row mt-8" onSubmit={handleSearchSubmit}>
              <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[30px] border border-neutral-300 bg-white px-4 py-2 text-neutral-500 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100">
                <span className="inline-flex text-neutral-400">
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  className="w-full border-none bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-500"
                  onChange={(event) => setSearchText(event.target.value)}
                  placeholder="Cari berdasarkan nama, spesialisasi..."
                  aria-label="Cari berdasarkan nama atau spesialisasi"
                  type="search"
                  value={searchText}
                />
              </label>
              <Button size="lg" type="submit" variant="primary" className="rounded-full px-8">
                Cari Psikolog
              </Button>
            </form>
          </div>
        </section>
      </Container>

      <Container className="mt-12">
        <section className="grid gap-8 lg:grid-cols-[290px_1fr]">
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <Card className="overflow-hidden border-none bg-[#37B6DF] p-6 text-white shadow-none" data-reveal>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </span>
              <h2 className="mt-4 font-display text-xl font-semibold leading-snug">Bingung Mulai Dari Mana?</h2>
              <p className="mt-2 text-sm text-white/90">
                Isi kuesioner singkat berikut. Kami akan membantu mencocokkan kebutuhanmu dengan psikolog dan layanan yang tepat.
              </p>
              <Link className={cx(buttonClasses({ variant: "secondary", size: "sm" }), "mt-5 w-full justify-center bg-white text-[#37B6DF] hover:bg-neutral-50")} href="https://s.id/KlienBaruLumina" target="_blank" rel="noopener noreferrer">
                Isi Formulir
              </Link>
            </Card>

            <Card className="space-y-6 p-6 rounded-[32px] shadow-sm border-neutral-200" data-reveal data-reveal-delay="0.08">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-900">Kategori Kebutuhan</p>
                <p className="mt-1 text-xs text-neutral-500 mb-3">Bisa pilih lebih dari 1 kategori kebutuhan</p>
                <MultiSelect 
                  options={specialtyOptions}
                  selected={selectedSpecialties}
                  onChange={setSelectedSpecialties}
                  placeholder="Apa kebutuhanmu?"
                />
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-900 mb-3">Jadwal Praktik</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {timeOptions.map((option) => {
                    const isActive = timeWindow === option.id;

                    return (
                      <button
                        key={option.id}
                        aria-pressed={isActive}
                        className={cx(
                          "rounded-2xl border px-3 py-2.5 text-sm font-medium transition",
                          isActive
                            ? "border-primary-300 bg-primary-600 text-white"
                            : "border-neutral-300 bg-neutral-100 text-neutral-700 hover:border-primary-300"
                        )}
                        onClick={() => setTimeWindow((value) => (value === option.id ? null : option.id))}
                        type="button"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                  {dayTypeOptions.map((option) => {
                    const isActive = dayType === option.id;

                    return (
                      <button
                        key={option.id}
                        aria-pressed={isActive}
                        className={cx(
                          "rounded-2xl border px-3 py-2.5 text-sm font-medium transition",
                          isActive
                            ? "border-primary-300 bg-primary-600 text-white"
                            : "border-neutral-300 bg-neutral-100 text-neutral-700 hover:border-primary-300"
                        )}
                        onClick={() => setDayType((value) => (value === option.id ? null : option.id))}
                        type="button"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                className={cx(buttonClasses({ variant: "primary", size: "md" }), "mt-1 w-full")}
                onClick={() => {
                  try {
                    const params = new URLSearchParams(window.location.search);
                    if (searchText.trim()) {
                      params.set("q", searchText.trim());
                    } else {
                      params.delete("q");
                    }
                    const url = params.toString() ? `/psychologists?${params.toString()}` : "/psychologists";
                    window.history.replaceState({}, "", url);
                  } catch (e) {
                    // ignore when window is unavailable
                  }
                }}
                type="button"
              >
                Cari Psikolog
              </button>
            </Card>
          </aside>

          <div className="space-y-6">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between" data-reveal>
              <p className="text-sm text-neutral-500">Menampilkan {filteredPsychologists.length} psikolog</p>
            </div>

            {visiblePsychologists.length > 0 ? (
              <div className="grid gap-5 xl:grid-cols-2" ref={gridRef}>
                {visiblePsychologists.map((psychologist, index) => (
                  <div key={psychologist.id} data-grid-card>
                    <PsychologistCard psychologist={psychologist} revealDelay={index * 0.06} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-8" data-reveal>
                <h3 className="font-display text-2xl font-semibold text-neutral-900">Belum ada hasil yang cocok</h3>
                <p className="mt-3 text-body text-neutral-700">
                  Coba kata kunci lain, kurangi beberapa filter, atau gunakan form rekomendasi di beranda.
                </p>
              </Card>
            )}

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                type="button"
              >
                ←
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  className={cx(
                    "inline-flex h-11 min-w-[44px] items-center justify-center rounded-full border px-4 text-small font-semibold transition",
                    page === currentPage
                      ? "border-primary-300 bg-primary-600 text-white shadow-glow"
                      : "border-neutral-300 bg-white text-neutral-700 hover:border-primary-300"
                  )}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              ))}

              <button
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                type="button"
              >
                →
              </button>
            </div>
          </div>
        </section>
      </Container>

      <CtaBanner />
    </main>
  );
}
