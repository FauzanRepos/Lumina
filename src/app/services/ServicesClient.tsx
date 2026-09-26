"use client";

import Link from "next/link";
import { Image } from "@/components/Image";
import { useEffect, useMemo, useRef, useState } from "react";
import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { Container } from "@/components/layout/Container";

import profileCards from '@/public/content/site/psychologists.json';
import type { Psychologist } from "@/types/content";
import servicesContent from '@/public/content/site/services.json';
import { cx } from "@/lib/cx";
import { usePageReveal } from "@/lib/usePageReveal";

import { gsap } from "gsap";

const servicesData = servicesContent as unknown as { content: any[] };
const serviceCategories: any[] = servicesData.content ?? [];

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

const featuredPsychologists = psychologists.slice(0, 4);

export default function ServicesClient(): JSX.Element {
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
    () => activeCategory?.items.find((item: any) => item.id === selectedServiceId) ?? activeCategory?.items[0],
    [activeCategory, selectedServiceId]
  );

  const activeCategoryIndex = serviceCategories.findIndex((c) => c.id === activeCategoryId) + 1;
  const selectedItemIndex = (activeCategory?.items ?? []).findIndex((item: any) => item.id === selectedServiceId) + 1;
  const serviceImage = `/content/upload/service-${activeCategoryIndex}.${selectedItemIndex}.webp`;

  const getItemLabel = (item: any) => item?.label ?? item?.shortLabel ?? "";
  const getItemHighlights = (item: any) => item?.highlights ?? item?.features ?? [];
  const noteTitle = activeCategory?.note?.title ?? "Terima Kasih Sudah Melangkah";
  const noteText = activeCategory?.note?.text ?? activeCategory?.supportingNote ?? activeCategory?.summary ?? "";

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
    <main className="pb-6 pt-8 sm:pt-12" ref={pageRef}>
      <Container>
        <section className="py-8 sm:py-12 lg:py-16">
          <div className="max-w-3xl space-y-4" data-reveal>
            <h1 className="font-display text-4xl font-semibold leading-[1.04] text-neutral-900 sm:text-5xl lg:text-[4rem]">Our Services</h1>
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
                {activeCategory.items.map((item: any) => {
                  const isActive = item.id === selectedService.id;
                  const itemLabel = getItemLabel(item);

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
                      <span>{itemLabel}</span>
                      <span>›</span>
                    </button>
                  );
                })}

                <Card className="border-accent-300/70 bg-accent-300/35 p-5">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent-500 text-sm font-bold text-white">+</span>
                  <p className="mt-3 font-display text-xl font-semibold text-accent-500">{noteTitle}</p>
                  <p className="mt-2 text-small text-neutral-700">{noteText}</p>
                </Card>
              </div>

              <Card className="border-none p-0" data-service-panel>
                <div className="overflow-hidden rounded-[40px] border border-neutral-100 shadow-glow">
                  <Image
                    alt="Sesi konsultasi"
                    className="w-full h-[460px] object-cover object-center rounded-[36px]"
                    src={serviceImage}
                    width={800}
                    height={460}
                    priority
                  />
                </div>
              </Card>

              <div className="space-y-5" data-service-panel>
                <span className="inline-flex rounded-full bg-primary-300/40 px-3 py-2 text-small font-semibold text-primary-600">
                  {activeCategory.label}
                </span>
                <h2 className="font-display text-2xl font-semibold text-neutral-900 sm:text-3xl">{selectedService.title}</h2>
                <p className="text-body text-neutral-700">{selectedService.description}</p>

                <ul className="space-y-4 text-body text-neutral-700">
                  {(getItemHighlights(selectedService) || []).map((feature: any) => (
                    <li key={feature} className="flex gap-3">
                      <span className="mt-1 text-primary-600">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  className={`${buttonClasses({ variant: "primary", size: "lg" })} inline-flex shadow-glow`}
                  href="https://wa.me/6285811180606"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      </Container>

      <CtaBanner />
    </main>
  );
}
