import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { Container } from "@/components/layout/Container";
import { featuredPsychologists } from "@/data/psychologists";
import { serviceCategories } from "@/data/services";
import { cx } from "@/lib/cx";
import { usePageReveal } from "@/lib/usePageReveal";

const categoryVisualClass: Record<string, string> = {
  "konsultasi-psikologi": "from-neutral-900 via-slate-800 to-primary-500",
  asesmen: "from-slate-900 via-cyan-800 to-primary-500",
  kolaborasi: "from-emerald-900 via-teal-700 to-accent-500",
};

export default function ServicesPage(): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState(serviceCategories[0]?.id ?? "");
  const [selectedServiceId, setSelectedServiceId] = useState(serviceCategories[0]?.items[0]?.id ?? "");

  const activeCategory = useMemo(
    () => serviceCategories.find((category) => category.id === activeCategoryId) ?? serviceCategories[0],
    [activeCategoryId]
  );

  useEffect(() => {
    if (!activeCategory) {
      return;
    }

    setSelectedServiceId(activeCategory.items[0]?.id ?? "");
  }, [activeCategory]);

  const selectedService = useMemo(
    () => activeCategory?.items.find((item) => item.id === selectedServiceId) ?? activeCategory?.items[0],
    [activeCategory, selectedServiceId]
  );

  useEffect(() => {
    if (!showcaseRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const animatedBlocks = showcaseRef.current.querySelectorAll("[data-service-panel]");

    gsap.fromTo(
      animatedBlocks,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.08, clearProps: "opacity,transform" }
    );

    return () => {
      gsap.killTweensOf(animatedBlocks);
      gsap.set(animatedBlocks, { clearProps: "opacity,transform" });
    };
  }, [activeCategoryId, selectedServiceId]);

  return (
    <>
      <Head>
        <title>Services | Lumina Consulting</title>
        <meta content="Eksplorasi layanan konsultasi, asesmen, dan kolaborasi Lumina Consulting." name="description" />
      </Head>

      <main className="pb-6 pt-8 sm:pt-12" ref={pageRef}>
        <Container>
          <section className="rounded-[40px] bg-hero-glow px-1 py-8 sm:px-4 sm:py-12 lg:px-8">
            <div className="max-w-3xl space-y-4" data-reveal>
              <p className="text-small font-semibold uppercase tracking-[0.24em] text-primary-600">Layanan Kami</p>
              <h1 className="font-display text-5xl font-semibold leading-[1.04] text-neutral-900 sm:text-[64px]">Layanan Kami</h1>
              <p className="max-w-2xl text-body text-neutral-700">
                Pilih format pendampingan yang paling sesuai dengan konteksmu, dari sesi individu sampai program psikologi untuk organisasi.
              </p>
            </div>
          </section>
        </Container>

        <Container className="mt-12">
          <section>
            <div className="flex flex-wrap gap-6 border-b border-neutral-200 pb-4" data-reveal>
              {serviceCategories.map((category) => {
                const isActive = category.id === activeCategoryId;

                return (
                  <button
                    key={category.id}
                    className={cx(
                      "border-b-2 pb-4 font-display text-2xl font-medium transition sm:text-3xl",
                      isActive ? "border-primary-600 text-primary-600" : "border-transparent text-neutral-500 hover:text-neutral-900"
                    )}
                    onClick={() => setActiveCategoryId(category.id)}
                    type="button"
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            {activeCategory && selectedService ? (
              <div className="mt-10 grid gap-6 xl:grid-cols-[260px_1fr_0.95fr]" ref={showcaseRef}>
                <div className="space-y-4" data-service-panel>
                  {activeCategory.items.map((item) => {
                    const isActive = item.id === selectedService.id;

                    return (
                      <button
                        key={item.id}
                        className={cx(
                          "flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left font-medium transition",
                          isActive ? "bg-primary-300/45 text-primary-600" : "text-neutral-700 hover:bg-neutral-100"
                        )}
                        onClick={() => setSelectedServiceId(item.id)}
                        type="button"
                      >
                        <span>{item.shortLabel}</span>
                        <span>›</span>
                      </button>
                    );
                  })}

                  <Card className="border-accent-300/70 bg-accent-300/35 p-5">
                    <p className="font-display text-2xl font-semibold text-accent-500">Terima Kasih Sudah Melangkah</p>
                    <p className="mt-3 text-small text-neutral-700">{activeCategory.supportingNote}</p>
                  </Card>
                </div>

                <Card className="relative min-h-[420px] overflow-hidden border-none p-0" data-service-panel>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Sesi konsultasi"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    src="/homepage/hero-psychologist-collage.png"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${categoryVisualClass[activeCategory.id]} opacity-70`} />
                  <div className="absolute bottom-10 left-10 right-10 rounded-[32px] border border-white/20 bg-white/10 p-8 backdrop-blur-md">
                    <p className="text-small font-semibold uppercase tracking-[0.2em] text-white/70">{activeCategory.label}</p>
                    <h2 className="mt-4 font-display text-4xl font-semibold text-white sm:text-5xl">{selectedService.title}</h2>
                    <p className="mt-4 max-w-lg text-body text-white/80">{selectedService.description}</p>
                  </div>
                </Card>

                <div className="space-y-5" data-service-panel>
                  <span className="inline-flex rounded-full bg-primary-300/40 px-3 py-2 text-small font-semibold text-primary-600">
                    {activeCategory.label}
                  </span>
                  <h2 className="font-display text-4xl font-semibold text-neutral-900">{selectedService.title}</h2>
                  <p className="text-body text-neutral-700">{selectedService.description}</p>

                  <ul className="space-y-4 text-body text-neutral-700">
                    {selectedService.features.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span className="mt-1 text-primary-600">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    className={`${buttonClasses({ variant: "primary", size: "lg" })} inline-flex`}
                    href={`/booking/${featuredPsychologists[0].id}?service=${selectedService.id}`}
                  >
                    Buat Janji
                  </Link>
                </div>
              </div>
            ) : null}
          </section>
        </Container>

        <CtaBanner />
      </main>
    </>
  );
}