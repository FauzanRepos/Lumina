import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import { Button, buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { PsychologistCard } from "@/components/PsychologistCard";
import { Container } from "@/components/layout/Container";
import { psychologists } from "@/data/psychologists";
import { cx } from "@/lib/cx";
import { getQueryParam } from "@/lib/query";
import { usePageReveal } from "@/lib/usePageReveal";

const scheduleOptions = [
  { id: "day", label: "Pagi / Siang" },
  { id: "night", label: "Malam" },
  { id: "weekday", label: "Hari Kerja" },
  { id: "weekend", label: "Akhir Pekan" },
] as const;

const itemsPerPage = 4;

function toggleItem(items: string[], item: string): string[] {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

function matchesScheduleWindow(
  availability: Record<string, string[]>,
  preferredWindow: (typeof scheduleOptions)[number]["id"] | null
): boolean {
  if (!preferredWindow) {
    return true;
  }

  return Object.entries(availability).some(([date, slots]) => {
    const day = new Date(`${date}T00:00:00`).getDay();
    const isWeekend = day === 0 || day === 6;

    if (preferredWindow === "weekday") {
      return !isWeekend && slots.length > 0;
    }

    if (preferredWindow === "weekend") {
      return isWeekend && slots.length > 0;
    }

    return slots.some((slot) => {
      const hour = Number(slot.split(":")[0]);

      if (preferredWindow === "day") {
        return hour < 18;
      }

      return hour >= 18;
    });
  });
}

export default function PsychologistsPage(): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const gridRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const queryValue = getQueryParam(router.query.q).trim();
  const [searchText, setSearchText] = useState(queryValue);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedSessionTypes, setSelectedSessionTypes] = useState<string[]>([]);
  const [preferredWindow, setPreferredWindow] = useState<(typeof scheduleOptions)[number]["id"] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const deferredQuery = useDeferredValue(searchText.trim().toLowerCase());

  useEffect(() => {
    setSearchText(queryValue);
  }, [queryValue]);

  const specialtyOptions = useMemo(
    () => Array.from(new Set(psychologists.flatMap((psychologist) => psychologist.specialties))),
    []
  );

  const sessionTypeOptions = useMemo(
    () => Array.from(new Set(psychologists.flatMap((psychologist) => psychologist.sessionTypes))),
    []
  );

  const filteredPsychologists = useMemo(() => {
    return psychologists.filter((psychologist) => {
      const searchTarget = `${psychologist.name} ${psychologist.title} ${psychologist.shortBio} ${psychologist.specialties.join(" ")}`.toLowerCase();
      const matchesQuery = deferredQuery.length < 2 || searchTarget.includes(deferredQuery);
      const matchesSpecialties =
        selectedSpecialties.length === 0 || selectedSpecialties.some((specialty) => psychologist.specialties.includes(specialty));
      const matchesSessionTypes =
        selectedSessionTypes.length === 0 || selectedSessionTypes.some((sessionType) => psychologist.sessionTypes.includes(sessionType));

      return (
        matchesQuery &&
        matchesSpecialties &&
        matchesSessionTypes &&
        matchesScheduleWindow(psychologist.availability, preferredWindow)
      );
    });
  }, [deferredQuery, preferredWindow, selectedSessionTypes, selectedSpecialties]);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredQuery, preferredWindow, selectedSessionTypes, selectedSpecialties]);

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
    void router.replace({
      pathname: "/psychologists",
      query: searchText.trim() ? { q: searchText.trim() } : undefined,
    });
  }

  return (
    <>
      <Head>
        <title>Psychologists | Lumina Consulting</title>
        <meta
          content="Cari psikolog Lumina berdasarkan kebutuhan, tipe sesi, dan jam praktik yang paling sesuai untukmu."
          name="description"
        />
      </Head>

      <main className="pb-6 pt-8 sm:pt-12" ref={pageRef}>
        <Container>
          <section className="grid gap-6 rounded-[40px] bg-hero-glow px-1 py-8 sm:px-4 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="max-w-3xl space-y-6" data-reveal>
              <h1 className="font-display text-5xl font-semibold leading-[1.04] text-neutral-900 sm:text-[64px]">
                Temukan psikolog yang <span className="text-primary-600">tepat</span> untukmu.
              </h1>
              <form className="flex flex-col gap-3 rounded-[30px] border border-primary-300/60 bg-white p-3 shadow-2 sm:flex-row" onSubmit={handleSearchSubmit}>
                <label className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2 text-neutral-500">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-300/30 text-primary-600">⌕</span>
                  <input
                    className="w-full border-none bg-transparent text-base text-neutral-900 outline-none placeholder:text-neutral-500"
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Cari berdasarkan nama, spesialisasi..."
                    type="search"
                    value={searchText}
                  />
                </label>
                <Button size="lg" type="submit" variant="primary">
                  Cari Psikolog
                </Button>
              </form>
            </div>

            <Card className="border-none bg-neutral-900 p-6 text-white shadow-2" data-reveal data-reveal-delay="0.12">
              <p className="text-small font-semibold uppercase tracking-[0.2em] text-white/70">Direktori Pilihan</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-[24px] bg-white/10 p-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Profesional</p>
                  <p className="mt-2 font-display text-4xl font-semibold">{psychologists.length}</p>
                </div>
                <div className="rounded-[24px] bg-white/10 p-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Mode sesi</p>
                  <p className="mt-2 font-display text-4xl font-semibold">3</p>
                </div>
              </div>
              <p className="mt-6 max-w-md text-small leading-7 text-white/80">
                Direktori Lumina menggabungkan spesialisasi klinis, preferensi sesi, dan ketersediaan jadwal agar pencarian terasa lebih cepat dan personal.
              </p>
            </Card>
          </section>
        </Container>

        <Container className="mt-12">
          <section className="grid gap-8 lg:grid-cols-[290px_1fr]">
            <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <Card className="overflow-hidden border-none bg-primary-600 p-6 text-white shadow-glow" data-reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Panduan Cerdas</p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight">Bingung Mulai Dari Mana?</h2>
                <p className="mt-4 text-small text-white/85">
                  Isi form singkat di beranda dan asisten kami akan membantu mencocokkan kebutuhanmu dengan psikolog dan layanan yang tepat.
                </p>
                <Link className={cx(buttonClasses({ variant: "secondary", size: "sm" }), "mt-6 inline-flex")} href="/#quiz">
                  Isi Formulir
                </Link>
              </Card>

              <Card className="p-5" data-reveal data-reveal-delay="0.08">
                <div>
                  <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">Kategori kebutuhan</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {specialtyOptions.map((specialty) => {
                      const isActive = selectedSpecialties.includes(specialty);

                      return (
                        <button
                          key={specialty}
                          className={cx(
                            "rounded-full border px-3 py-2 text-small font-medium transition",
                            isActive
                              ? "border-primary-300 bg-primary-300/50 text-primary-600"
                              : "border-neutral-300 bg-white text-neutral-700 hover:border-primary-300"
                          )}
                          onClick={() => setSelectedSpecialties((items) => toggleItem(items, specialty))}
                          type="button"
                        >
                          {specialty}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-100 pt-6">
                  <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">Tipe sesi</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sessionTypeOptions.map((sessionType) => {
                      const isActive = selectedSessionTypes.includes(sessionType);

                      return (
                        <button
                          key={sessionType}
                          className={cx(
                            "rounded-full border px-3 py-2 text-small font-medium transition",
                            isActive
                              ? "border-primary-300 bg-primary-300/50 text-primary-600"
                              : "border-neutral-300 bg-white text-neutral-700 hover:border-primary-300"
                          )}
                          onClick={() => setSelectedSessionTypes((items) => toggleItem(items, sessionType))}
                          type="button"
                        >
                          {sessionType}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 border-t border-neutral-100 pt-6">
                  <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">Jadwal praktik</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {scheduleOptions.map((option) => {
                      const isActive = preferredWindow === option.id;

                      return (
                        <button
                          key={option.id}
                          className={cx(
                            "rounded-2xl border px-3 py-2 text-small font-medium transition",
                            isActive
                              ? "border-primary-300 bg-primary-300/50 text-primary-600"
                              : "border-neutral-300 bg-neutral-100 text-neutral-700 hover:border-primary-300"
                          )}
                          onClick={() => setPreferredWindow((value) => (value === option.id ? null : option.id))}
                          type="button"
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  className="mt-6 w-full rounded-2xl bg-neutral-100 px-4 py-3 text-small font-semibold text-neutral-700 transition hover:bg-neutral-200"
                  onClick={() => {
                    setSelectedSessionTypes([]);
                    setSelectedSpecialties([]);
                    setPreferredWindow(null);
                    setSearchText("");
                    void router.replace("/psychologists");
                  }}
                  type="button"
                >
                  Reset Filter
                </button>
              </Card>
            </aside>

            <div className="space-y-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" data-reveal>
                <div>
                  <p className="text-small text-neutral-500">Menampilkan {filteredPsychologists.length} psikolog</p>
                  <h2 className="font-display text-3xl font-semibold text-neutral-900">Psikolog yang sesuai dengan ritmemu</h2>
                </div>
                <p className="text-small text-neutral-500">
                  Filter aktif: {selectedSpecialties.length + selectedSessionTypes.length + (preferredWindow ? 1 : 0)}
                </p>
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
    </>
  );
}