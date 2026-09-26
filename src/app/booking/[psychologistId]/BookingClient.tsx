"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { gsap } from "gsap";

import { Button, buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { TextInput } from "@/components/TextInput";
import { Container } from "@/components/layout/Container";
import profileCards from '@/public/content/site/psychologists.json';
import type { Psychologist } from "@/types/content";
import servicesContent from '@/public/content/site/services.json';
import { cx } from "@/lib/cx";
import { formatRupiah, formatSessionDate } from "@/lib/formatting";
import { usePageReveal } from "@/lib/usePageReveal";
import { submitSessionBooking } from "@/lib/webhook";

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

const servicesData = servicesContent as unknown as { content: any[] };
const serviceCategories: any[] = servicesData.content ?? [];

type BookingStep = 1 | 2 | 3;

interface BookingErrors {
  date?: string;
  time?: string;
  sessionType?: string;
  notes?: string;
  nama?: string;
  email?: string;
  whatsapp?: string;
  submit?: string;
}

const stepLabels: { id: BookingStep; label: string }[] = [
  { id: 1, label: "Pilih Waktu" },
  { id: 2, label: "Detail Sesi" },
  { id: 3, label: "Konfirmasi" },
];

function getRequestedService(serviceId: string) {
  return serviceCategories.flatMap((category) => category.items).find((item) => item.id === serviceId);
}

export default function BookingClient({ psychologist: initialPsychologist }: { psychologist: Psychologist | null }): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const stepContentRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const psychologistIdFromQuery = searchParams.get("psychologistId") ?? "";
  const requestedServiceId = searchParams.get("service") ?? "";
  const queryDate = searchParams.get("date") ?? "";
  const queryTime = searchParams.get("time") ?? "";

  const fallbackPsychologist = useMemo(
    () => psychologists.find((entry) => entry.id === psychologistIdFromQuery) ?? null,
    [psychologistIdFromQuery]
  );

  const psychologist = initialPsychologist ?? fallbackPsychologist;
  const requestedService = useMemo(() => getRequestedService(requestedServiceId), [requestedServiceId]);

  const [step, setStep] = useState<BookingStep>(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [notes, setNotes] = useState("");
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState<BookingErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!psychologist) {
      return;
    }

    const availableDates = Object.keys(psychologist.availability);
    const nextDate = queryDate && psychologist.availability[queryDate] ? queryDate : availableDates[0] ?? "";

    setSelectedDate(nextDate);
    setSessionType((current) => current || psychologist.sessionTypes[0] || "");
  }, [psychologist, queryDate]);

  useEffect(() => {
    if (!psychologist || !selectedDate) {
      return;
    }

    const nextTimes = psychologist.availability[selectedDate] ?? [];
    const nextTime = queryTime && nextTimes.includes(queryTime) ? queryTime : nextTimes[0] ?? "";

    setSelectedTime((current) => (nextTimes.includes(current) ? current : nextTime));
  }, [psychologist, queryTime, selectedDate]);

  useEffect(() => {
    if (requestedService && !notes) {
      setNotes(`Saya ingin membahas ${requestedService.title.toLowerCase()} dalam sesi ini.`);
    }
  }, [notes, requestedService]);

  const availableDates = psychologist ? Object.keys(psychologist.availability) : [];
  const availableTimes = psychologist && selectedDate ? psychologist.availability[selectedDate] ?? [] : [];
  const confirmationCode = useMemo(() => {
    const id = psychologist?.id ?? psychologistIdFromQuery;
    return `LUM-2026-${String(id).slice(0, 2).toUpperCase() || "00"}${selectedDate.replaceAll("-", "").slice(-4) || "0000"}`;
  }, [psychologist, psychologistIdFromQuery, selectedDate]);

  useEffect(() => {
    if (!stepContentRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const nodes = stepContentRef.current.querySelectorAll("[data-step-panel]");

    gsap.fromTo(
      nodes,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.06, clearProps: "opacity,transform" }
    );

    return () => {
      gsap.killTweensOf(nodes);
      gsap.set(nodes, { clearProps: "opacity,transform" });
    };
  }, [step, selectedDate]);

  function validateStepOne(): boolean {
    const nextErrors: BookingErrors = {};

    if (!selectedDate) {
      nextErrors.date = "Date must be within the next 90 days.";
    }

    if (!selectedTime) {
      nextErrors.time = "Please select an available time slot.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateStepTwo(): boolean {
    const nextErrors: BookingErrors = {};

    if (!sessionType) {
      nextErrors.sessionType = "Tipe sesi wajib dipilih.";
    }

    if (notes.length > 500) {
      nextErrors.notes = "Catatan sesi tidak boleh melebihi 500 karakter.";
    }

    if (!nama.trim()) {
      nextErrors.nama = "Nama lengkap wajib diisi.";
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRe.test(email.trim())) {
      nextErrors.email = "Masukkan alamat email yang valid.";
    }

    const waRe = /^[0-9+()'\-\s]{8,25}$/;
    if (!whatsapp.trim() || !waRe.test(whatsapp.trim())) {
      nextErrors.whatsapp = "Masukkan nomor WhatsApp yang valid (8–25 karakter).";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleContinue(): void {
    if (!validateStepOne()) {
      return;
    }

    setStep(2);
  }

  async function handleConfirm(): Promise<void> {
    if (!validateStepTwo()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const result = await submitSessionBooking({
      psikolog: psychologist!.name,
      tanggal: selectedDate,
      waktu: selectedTime,
      sesi: sessionType,
      nama: nama.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      catatan: notes.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.ok) {
      setStep(3);
    } else if (result.status === 409) {
      setErrors({ submit: "Anda sudah mendaftarkan sesi pada tanggal ini dengan email atau nomor WhatsApp yang sama." });
    } else {
      setErrors({ submit: result.message || "Terjadi kesalahan. Silakan coba lagi." });
    }
  }

  if (!psychologist) {
    return (
      <main className="pb-24 pt-12">
        <Container>
          <Card className="p-8 sm:p-10">
            <h1 className="font-display text-3xl font-semibold text-neutral-900">Jadwal booking belum tersedia</h1>
            <p className="mt-3 text-body text-neutral-700">Pilih psikolog terlebih dahulu untuk melanjutkan proses booking.</p>
            <Link className={`${buttonClasses({ variant: "primary", size: "md" })} mt-6 inline-flex`} href="/psychologists">
              Pilih psikolog
            </Link>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="pb-24 pt-8 sm:pt-12" ref={pageRef}>
      <Container>
        <div className="flex flex-wrap gap-3" data-reveal>
          {stepLabels.map((item) => (
            <div
              key={item.id}
              className={cx(
                "rounded-full border px-4 py-2 text-small font-semibold",
                item.id === step
                  ? "border-primary-300 bg-primary-600 text-white shadow-glow"
                  : "border-neutral-300 bg-white text-neutral-500"
              )}
            >
              {item.id}. {item.label}
            </div>
          ))}
        </div>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6 sm:p-8" data-reveal>
            <div className="max-w-2xl" data-step-panel>
              <h1 className="font-display text-4xl font-semibold text-neutral-900 sm:text-5xl">Pesan Sesi dengan {psychologist.name.split(",")[0]}</h1>
              <p className="mt-4 text-body text-neutral-700">
                Pilih jadwal yang terasa paling pas, tambahkan konteks singkat, lalu konfirmasi sesi dalam dua langkah sederhana.
              </p>
            </div>

            {Object.keys(errors).length > 0 ? (
              <div className="mt-6 rounded-[24px] border border-rose-200 bg-rose-50 px-5 py-4 text-small text-rose-600">
                {errors.submit || errors.date || errors.time || errors.sessionType || errors.notes || errors.nama || errors.email || errors.whatsapp}
              </div>
            ) : null}

            <div className="mt-8" ref={stepContentRef}>
              {step === 1 ? (
                <div className="space-y-8">
                  <div data-step-panel>
                    <h2 className="font-display text-3xl font-semibold text-neutral-900">Pilih Tanggal</h2>
                    <div className="mt-4 flex flex-wrap gap-3">
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
                            {new Intl.DateTimeFormat("id-ID", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            }).format(new Date(`${date}T00:00:00`))}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div data-step-panel>
                    <h2 className="font-display text-3xl font-semibold text-neutral-900">Pilih Waktu</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {availableTimes.map((time) => {
                        const isActive = time === selectedTime;

                        return (
                          <button
                            key={time}
                            className={`rounded-2xl border px-4 py-4 text-small font-semibold transition ${
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
                  </div>

                  <Button onClick={handleContinue} size="lg" variant="primary" data-step-panel>
                    Lanjutkan
                  </Button>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-8">
                  <div data-step-panel>
                    <h2 className="font-display text-3xl font-semibold text-neutral-900">Tipe Sesi</h2>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {psychologist.sessionTypes.map((type) => {
                        const isActive = sessionType === type;

                        return (
                          <button
                            key={type}
                            className={`rounded-2xl border px-4 py-4 text-small font-semibold transition ${
                              isActive
                                ? "border-primary-300 bg-primary-600 text-white shadow-glow"
                                : "border-neutral-300 bg-white text-neutral-700 hover:border-primary-300"
                            }`}
                            onClick={() => setSessionType(type)}
                            type="button"
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div data-step-panel>
                    <label className="block">
                      <span className="mb-2 block font-display text-3xl font-semibold text-neutral-900">Catatan Sesi</span>
                      <textarea
                        className="min-h-[140px] w-full rounded-[24px] border border-neutral-300 bg-white px-4 py-4 text-body text-neutral-900 outline-none"
                        maxLength={500}
                        onBlur={validateStepTwo}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="Tuliskan konteks singkat yang ingin Anda bahas pada sesi ini."
                        value={notes}
                      />
                    </label>
                    <div className="mt-2 flex items-center justify-between text-small text-neutral-500">
                      <span>{errors.notes}</span>
                      <span>{notes.length}/500</span>
                    </div>
                  </div>

                  <div className="space-y-4" data-step-panel>
                    <h2 className="font-display text-3xl font-semibold text-neutral-900">Data Diri</h2>
                    <TextInput
                      error={errors.nama}
                      label="Nama Lengkap"
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Nama lengkap Anda"
                      type="text"
                      value={nama}
                    />
                    <TextInput
                      error={errors.email}
                      label="Email"
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      type="email"
                      value={email}
                    />
                    <TextInput
                      error={errors.whatsapp}
                      label="Nomor WhatsApp"
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+62 812 3456 7890"
                      type="tel"
                      value={whatsapp}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3" data-step-panel>
                    <Button onClick={() => setStep(1)} size="lg" variant="secondary">
                      Kembali
                    </Button>
                    <Button loading={isSubmitting} onClick={handleConfirm} size="lg" variant="primary">
                      Konfirmasi Pemesanan
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-6">
                  <Card className="bg-primary-300/25 p-6 sm:p-8" data-step-panel>
                    <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">Kode Konfirmasi</p>
                    <h2 className="mt-3 font-display text-4xl font-semibold text-neutral-900">{confirmationCode}</h2>
                    <p className="mt-4 text-body text-neutral-700">
                      Sesi Anda sudah dikonfirmasi. Email konfirmasi akan dikirim ke alamat yang terhubung dengan akun Anda.
                    </p>
                  </Card>

                  <div className="flex flex-wrap gap-3" data-step-panel>
                    <Link className={buttonClasses({ variant: "secondary", size: "md" })} href="/">
                      Kembali ke Beranda
                    </Link>
                    <Link className={buttonClasses({ variant: "primary", size: "md" })} href={`/psychologists/${psychologist.id}`}>
                      Lihat Jadwal Saya
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>

          <div className="space-y-5 xl:sticky xl:top-28 xl:self-start">
            <Card className="p-6 sm:p-8" data-reveal data-reveal-delay="0.12">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-primary-300/40 font-display text-2xl font-semibold text-neutral-900">
                  {psychologist.initials}
                </div>
                <div>
                  <h2 className="font-display text-3xl font-semibold text-neutral-900">{psychologist.name}</h2>
                  <p className="mt-2 text-small font-medium text-primary-600">
                    {psychologist.title} • {psychologist.university}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 text-small text-neutral-700">
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-100 px-4 py-3">
                  <span>Tanggal & waktu</span>
                  <span className="font-semibold text-neutral-900">{selectedDate ? formatSessionDate(selectedDate, selectedTime) : "Pilih jadwal"}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-100 px-4 py-3">
                  <span>Tipe sesi</span>
                  <span className="font-semibold text-neutral-900">{sessionType || "Belum dipilih"}</span>
                </div>
                {requestedService ? (
                  <div className="flex items-center justify-between gap-4 rounded-2xl bg-neutral-100 px-4 py-3">
                    <span>Layanan</span>
                    <span className="font-semibold text-neutral-900">{requestedService.title}</span>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 rounded-[28px] bg-primary-600 p-6 text-white">
                <p className="text-small font-semibold uppercase tracking-[0.2em] text-white/70">Biaya Sesi</p>
                <p className="mt-3 font-display text-4xl font-semibold">{formatRupiah(psychologist.sessionFee)}</p>
                <p className="mt-3 text-small text-white/80">{psychologist.sessionDuration} menit • sesi 1-on-1</p>
              </div>
            </Card>
          </div>
        </section>
      </Container>
    </main>
  );
}
