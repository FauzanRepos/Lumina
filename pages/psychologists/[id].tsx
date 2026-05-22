import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { GetStaticPaths, GetStaticProps } from "next";
import { useEffect, useMemo, useState } from "react";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { PsychologistCard } from "@/components/PsychologistCard";
import { Container } from "@/components/layout/Container";
import { psychologists } from "@/data/psychologists";
import { formatRupiah } from "@/lib/formatting";
import { usePageReveal } from "@/lib/usePageReveal";
import type { Psychologist } from "@/types/content";

const accentToneClass = {
  sky: "from-sky-100 to-primary-300/80",
  mint: "from-emerald-100 to-accent-300",
  peach: "from-amber-100 to-rose-100",
  lavender: "from-violet-100 to-sky-100",
  amber: "from-amber-100 to-orange-100",
};

export default function PsychologistProfilePage({ psychologist }: { psychologist: Psychologist | null }): JSX.Element {
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
    <>
      <Head>
        <title>{`${psychologist.name} | Lumina Consulting`}</title>
        <meta content={`Profil ${psychologist.name}, ${psychologist.title} di Lumina Consulting.`} name="description" />
      </Head>

      <main className="pb-6 pt-8 sm:pt-12" ref={pageRef}>
        <Container>
          <div className="mb-8" data-reveal>
            <Link className="inline-flex items-center gap-2 text-small font-semibold text-primary-600" href="/psychologists">
              <span className="text-xl">←</span>
              Kembali ke daftar psikolog
            </Link>
          </div>

          <section className="grid gap-6 lg:grid-cols-[1.04fr_360px] xl:grid-cols-[1.08fr_400px]">
            <Card className="relative overflow-hidden p-6 sm:p-8 lg:p-10" data-reveal>
              <div className="absolute right-[-32px] top-[-24px] h-40 w-40 rounded-full border-[22px] border-primary-300/30 sm:h-44 sm:w-44 sm:border-[24px]" />
              <div className="grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start">
                <div
                  className={`flex h-[280px] w-full max-w-[220px] items-center justify-center overflow-hidden rounded-[40px] bg-gradient-to-br ${accentToneClass[psychologist.accent]} font-display text-5xl font-semibold text-neutral-900 shadow-[0_20px_60px_rgba(15,23,36,0.12)]`}
                >
                  {psychologist.photo ? (
                    <Image
                      alt={psychologist.name}
                      className="h-full w-full object-cover"
                      height={280}
                      src={psychologist.photo}
                      width={220}
                    />
                  ) : (
                    psychologist.initials
                  )}
                </div>

                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary-300/25 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-700">
                      Konsultasi Profesional
                    </span>
                    <span className="rounded-full bg-neutral-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      {psychologist.sessionDuration} menit
                    </span>
                  </div>

                  <div>
                    <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[0.98] text-neutral-900 sm:text-5xl xl:text-[4rem]">
                      {psychologist.name}
                    </h1>
                    <p className="mt-3 text-body font-medium text-primary-600">
                      {psychologist.title} • {psychologist.university}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {psychologist.specialties.map((specialty) => (
                      <span key={specialty} className="rounded-full bg-neutral-100 px-3 py-2 text-small font-medium text-neutral-700">
                        {specialty}
                      </span>
                    ))}
                  </div>

                  <p className="max-w-2xl text-body leading-8 text-neutral-700">{psychologist.shortBio}</p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[24px] border border-primary-300/55 bg-primary-300/14 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-600">Format</p>
                      <p className="mt-2 text-small font-semibold text-neutral-900">{psychologist.sessionTypes.slice(0, 2).join(" / ")}</p>
                    </div>
                    <div className="rounded-[24px] border border-neutral-200 bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Fokus Utama</p>
                      <p className="mt-2 text-small font-semibold text-neutral-900">
                        {psychologist.focusAreas[0]?.title ?? psychologist.specialties[0]}
                      </p>
                    </div>
                    <div className="rounded-[24px] border border-neutral-200 bg-white p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">Slot Awal</p>
                      <p className="mt-2 text-small font-semibold text-neutral-900">{nextSlotSummary ?? "Pilih jadwal di samping"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <Card className="bg-primary-300/20 p-5" data-reveal data-reveal-delay="0.08">
                  <h2 className="font-display text-2xl font-semibold text-neutral-900">Pendidikan</h2>
                  <ul className="mt-4 space-y-3 text-small text-neutral-700">
                    {psychologist.education.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 text-primary-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card className="bg-primary-300/20 p-5" data-reveal data-reveal-delay="0.14">
                  <h2 className="font-display text-2xl font-semibold text-neutral-900">Izin Praktik</h2>
                  <ul className="mt-4 space-y-3 text-small text-neutral-700">
                    {psychologist.licenses.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1 text-primary-600">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="mt-8 space-y-4 text-body text-neutral-700">
                {psychologist.bio.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 rounded-full bg-primary-300/30 px-6 py-3 text-center font-display text-lg font-semibold text-neutral-900">
                Area Keahlian Utama
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {psychologist.focusAreas.map((focusArea) => (
                  <div key={focusArea.title} className="rounded-[24px] border border-neutral-200 bg-white p-5">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary-300/40 text-primary-600">✦</div>
                    <h3 className="mt-4 font-display text-2xl font-semibold text-neutral-900">{focusArea.title}</h3>
                    <p className="mt-3 text-small text-neutral-700">{focusArea.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-10 border-y border-primary-300/70 py-5 text-body text-neutral-700">
                <span className="font-semibold text-neutral-900">Layanan via:</span>{" "}
                {psychologist.sessionTypes.join(" • ")}
              </div>
            </Card>

            <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
              <Card className="relative overflow-hidden border-none bg-neutral-900 p-6 text-white shadow-[0_32px_80px_rgba(15,23,36,0.2)] sm:p-8" data-reveal data-reveal-delay="0.12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(103,232,249,0.28),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]" />
                <div className="relative">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60">Booking Preview</p>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-300">Biaya Sesi</p>
                      <div className="mt-3 flex items-baseline gap-2">
                        <p className="font-display text-4xl font-semibold text-white">{formatRupiah(psychologist.sessionFee)} / sesi</p>
                      </div>
                      {psychologist.originalFee ? (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="rounded-full bg-accent-500 px-2 py-0.5 text-xs font-semibold text-white">
                            -{Math.round((1 - psychologist.sessionFee / psychologist.originalFee) * 100)}%
                          </span>
                          <span className="text-small text-white/45 line-through">{formatRupiah(psychologist.originalFee)}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-6 rounded-[26px] border border-white/10 bg-white/8 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">Slot berikutnya</p>
                    <p className="mt-2 text-base font-semibold text-white">{nextSlotSummary ?? "Pilih tanggal dan waktu yang tersedia"}</p>
                  </div>

                  <ul className="mt-6 space-y-3 text-small text-white/78">
                    <li>• {psychologist.sessionDuration} menit</li>
                    <li>• Sesi 1-on-1</li>
                    <li>• {psychologist.sessionTypes.join(" • ")}</li>
                  </ul>

                  <Link
                    className={`${buttonClasses({ variant: "secondary", size: "md", fullWidth: true })} mt-6 w-full`}
                    href={{
                      pathname: `/booking/${psychologist.id}`,
                      query: selectedDate && selectedTime ? { date: selectedDate, time: selectedTime } : undefined,
                    }}
                  >
                    Buat Janji
                  </Link>
                  <Link
                    className={`${buttonClasses({ variant: "ghost", size: "md", fullWidth: true })} mt-3 w-full bg-white/10 text-white hover:bg-white/15`}
                    href={`mailto:halo@lumina.consulting?subject=${encodeURIComponent(`Konsultasi dengan ${psychologist.name}`)}`}
                  >
                    Tanya Admin
                  </Link>
                </div>
              </Card>

              <Card className="p-6 sm:p-8" data-reveal data-reveal-delay="0.18">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-3xl font-semibold text-neutral-900">Pilih Jadwal</h2>
                  <span className="rounded-full bg-neutral-100 px-3 py-2 text-small font-medium text-neutral-500">{availableDates.length} tanggal</span>
                </div>

                <p className="mt-3 text-small leading-7 text-neutral-600">
                  Pilih tanggal dan jam yang paling nyaman. Pilihanmu akan langsung dibawa ke halaman booking.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  {availableDates.map((date) => {
                    const isActive = date === selectedDate;

                    return (
                      <button
                        key={date}
                        className={`rounded-2xl border px-4 py-3 text-small font-medium transition ${
                          isActive
                            ? "border-primary-300 bg-primary-600 text-white shadow-glow"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-primary-300"
                        }`}
                        onClick={() => setSelectedDate(date)}
                        type="button"
                      >
                        {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(`${date}T00:00:00`))}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                  {availableTimes.map((time) => {
                    const isActive = time === selectedTime;

                    return (
                      <button
                        key={time}
                        className={`rounded-2xl border px-4 py-3 text-small font-semibold transition ${
                          isActive
                            ? "border-primary-300 bg-primary-600 text-white shadow-glow"
                            : "border-neutral-300 bg-white text-neutral-700 hover:border-primary-300"
                        }`}
                        onClick={() => setSelectedTime(time)}
                        type="button"
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>
          </section>
        </Container>

        <section className="mt-20 bg-primary-300/20 py-16">
          <Container>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between" data-reveal>
              <div>
                <h2 className="font-display text-4xl font-semibold text-neutral-900">Lihat Psikolog Lainnya</h2>
                <p className="mt-2 text-body text-neutral-700">Psikolog profesional lainnya yang mungkin sesuai dengan kebutuhanmu.</p>
              </div>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {relatedPsychologists.map((item, index) => (
                <PsychologistCard key={item.id} psychologist={item} revealDelay={index * 0.08} />
              ))}
            </div>
          </Container>
        </section>

        <CtaBanner />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = psychologists.map((p) => ({ params: { id: p.id } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ psychologist: Psychologist | null }> = async (context) => {
  const id = String(context.params?.id ?? "");
  const psychologist = psychologists.find((p) => p.id === id) ?? null;

  return {
    props: {
      psychologist,
    },
  };
};