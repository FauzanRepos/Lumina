"use client";

import { Image } from "@/components/Image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";

import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { Hero } from "@/components/Hero";
import { InsightArtwork } from "@/components/InsightArtwork";
import { PsychologistCard } from "@/components/PsychologistCard";
import { Container } from "@/components/layout/Container";
import siteContent from '@/lib/site';
import profileCards from '@/public/content/site/psychologists.json';
import type { Psychologist, InsightArticle } from "@/types/content";
import { formatInsightDate } from "@/lib/formatting";
import { cx } from "@/lib/cx";
import { usePageReveal } from "@/lib/usePageReveal";

const siteData = siteContent as unknown as {
  benefits?: import("@/types/content").Benefit[];
  testimonials?: import("@/types/content").Testimonial[];
};

const benefits = siteData.benefits ?? [];
const testimonials = siteData.testimonials ?? [];

const benefitIconByKey = {
  home: "/icon/section-home.svg",
  sofa: "/icon/section-sofa.svg",
  time: "/icon/section-time.svg",
} as const;

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
  featured: Boolean(p.featured),
  featuredOrder: Number(p.featuredOrder ?? 0),
}));

const homepagePsychologists = psychologists
  .filter((p) => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));

interface HomeClientProps {
  insightArticles: InsightArticle[];
}

export default function HomeClient({ insightArticles }: HomeClientProps): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const psychologistRailRef = useRef<HTMLDivElement | null>(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [featuredInsight, ...secondaryInsights] = insightArticles;

  function scrollPsychologists(direction: number): void {
    psychologistRailRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  }



  return (
    <main ref={pageRef}>
      <Container>
        <Hero />
      </Container>

      <Container className="mt-8 md:mt-72 lg:mt-96">
        <section className="space-y-8" id="healing-starts">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center" data-reveal>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent-300/40 border border-accent-300/30 flex-shrink-0">
              <Image alt="Healing starts icon" height={48} src="/icon/hand.svg" width={48} />
            </div>
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-semibold leading-snug text-neutral-900 sm:text-3xl">
                <span className="text-accent-500">Healing</span> starts where you <span className="text-primary-600">feel</span> most like yourself
              </h2>
              <p className="text-sm text-neutral-700 leading-6">
                Pengalaman konseling individu yang personal, aman, dan sepenuhnya online ketika kamu membutuhkannya.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card
                key={benefit.id}
                className="h-full rounded-[34px] bg-white p-6 sm:p-8 border border-primary-300/25 shadow-1"
                data-reveal
                data-reveal-delay={(index * 0.08).toString()}
              >
                <div className="mb-8 flex justify-start">
                  <div className="flex items-center justify-center h-16 w-16 rounded-[18px] bg-primary-300/12 border border-primary-300/20">
                    <div className="rounded-full bg-white p-3 shadow-1">
                      <Image alt={benefit.title} height={36} src={benefitIconByKey[benefit.icon]} width={36} />
                    </div>
                  </div>
                </div>
                <h3 className="font-display text-2xl font-semibold text-neutral-900">{benefit.title}</h3>
                <p className="mt-4 text-small leading-7 text-neutral-700">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </section>
      </Container>

      <Container className="mt-8 md:mt-72 lg:mt-96">
        <section className="space-y-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" data-reveal>
            <div className="flex items-center justify-center gap-4 lg:justify-start">
              <div className="inline-flex h-14 w-14 items-center justify-center">
                <Image alt="Our Psychologists icon" height={55} src="/icon/heart.svg" width={64} />
              </div>
              <div className="text-center lg:text-left">
                <h2 className="font-display text-2xl font-semibold text-neutral-900 sm:text-3xl">
                  Our Psychologists
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
                href="/psychologists"
              >
                Lihat Semua
              </Link>
              <button
                aria-label="Scroll psychologist list left"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 transition hover:bg-neutral-100"
                onClick={() => scrollPsychologists(-1)}
                type="button"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                aria-label="Scroll psychologist list right"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 transition hover:bg-neutral-100"
                onClick={() => scrollPsychologists(1)}
                type="button"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" ref={psychologistRailRef}>
            {homepagePsychologists.map((psychologist, index) => (
              <div key={psychologist.id} className="w-[220px] flex-shrink-0">
                <PsychologistCard
                  compact
                  psychologist={psychologist}
                  revealDelay={index * 0.08}
                />
              </div>
            ))}
          </div>
        </section>
      </Container>

      <Container className="mt-8 md:mt-72 lg:mt-96">
        <section className="space-y-8">
          <div className="text-center" data-reveal>
            <h2 className="font-display text-2xl font-semibold text-neutral-900 sm:text-3xl">They Use Our Services</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="rounded-[30px] bg-white/95 p-6 sm:p-8 flex flex-col border border-primary-300/25"
                data-reveal
                data-reveal-delay={(index * 0.08).toString()}
              >
                <div className="relative flex flex-col gap-4 flex-1">
                  <span className="absolute right-0 top-0 font-display text-5xl leading-none text-primary-300">"</span>
                  <p className="pr-8 text-base leading-7 text-neutral-800 font-medium">{testimonial.quote}</p>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-primary-300/40 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900">{testimonial.author}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-end pt-2" data-reveal>
            <button
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
              onClick={() => setShowTestimonialModal(true)}
            >
              Lihat Semua
            </button>
          </div>
        </section>
      </Container>

      {featuredInsight ? (
        <Container className="mt-8 md:mt-72 lg:mt-96" id="insights">
          <section className="space-y-12">
            <div className="text-center" data-reveal>
              <h2 className="font-display text-2xl font-semibold text-neutral-900 sm:text-3xl">Lumina Insights</h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
              <Card className="rounded-[34px] p-6 sm:p-8 lg:p-10 flex flex-col justify-between" data-reveal>
                <div>
                  <div className="flex items-start justify-between">
                    <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-600">
                      INSIGHTS
                    </span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-50">
                      <svg className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                  <Link href={featuredInsight.href}>
                    <h3 className="mt-8 font-display text-2xl font-semibold leading-tight text-neutral-900 transition hover:text-primary-600 sm:text-3xl lg:text-[32px]">
                      {featuredInsight.title}
                    </h3>
                  </Link>
                  <p className="mt-4 text-sm leading-6 text-neutral-700 sm:text-base sm:leading-7">{featuredInsight.excerpt}</p>
                </div>
                <div className="mt-12 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-700">
                    {featuredInsight.author.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium text-neutral-600 sm:text-sm">
                    {featuredInsight.author}
                  </span>
                </div>
              </Card>

              <div className="grid gap-8 auto-rows-max">
                <Card className="overflow-hidden rounded-[34px] p-0 flex flex-col sm:flex-row bg-primary-50/50 border-0" data-reveal data-reveal-delay="0.1">
                  <div className="relative h-48 sm:h-auto sm:w-[40%] bg-neutral-200">
                    <Image fill src="/content/upload/service-3.2.webp" alt="Quote scenery" className="object-cover" />
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-8 sm:w-[60%]">
                    <span className="inline-flex w-fit rounded-full bg-primary-200/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-700 mb-4">
                      Quote of the Day
                    </span>
                    <p className="font-display text-lg font-medium leading-snug text-neutral-900 italic">
                      "If there is meaning in life at all, then there must be meaning in suffering."
                    </p>
                    <p className="mt-4 text-xs font-medium text-neutral-500">
                      - Viktor E. Frankl in "Man's Search for Meaning"
                    </p>
                  </div>
                </Card>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Card className="flex min-h-[140px] flex-col items-center justify-center rounded-[34px] bg-neutral-100/80 p-6 text-center" data-reveal data-reveal-delay="0.2">
                    <Image alt="" className="mb-3 opacity-50" height={32} src="/icon/menu-insights.svg" width={32} />
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Podcast</p>
                    <p className="mt-2 text-sm font-semibold text-neutral-400">Coming Soon</p>
                  </Card>
                  <Card className="flex min-h-[140px] flex-col items-center justify-center rounded-[34px] bg-neutral-100/80 p-6 text-center" data-reveal data-reveal-delay="0.28">
                    <Image alt="" className="mb-3 opacity-50" height={32} src="/icon/hand.svg" width={32} />
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">Recovery Journaling</p>
                    <p className="mt-2 text-sm font-semibold text-neutral-400">Coming Soon</p>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </Container>
      ) : null}



      <CtaBanner />

      {/* Testimonials Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] rounded-[32px] p-6 sm:p-8 flex flex-col bg-white overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-semibold text-neutral-900">Semua Testimoni</h2>
              <button
                onClick={() => setShowTestimonialModal(false)}
                className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-neutral-100 transition text-neutral-900 text-2xl font-light"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-6 pr-2">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="relative rounded-[28px] border border-primary-300/40 bg-white p-6">
                  <span className="absolute right-5 top-4 font-display text-5xl leading-none text-primary-300">"</span>
                  <p className="pr-10 text-base leading-7 text-neutral-800 font-medium">{testimonial.quote}</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-primary-300/30 pt-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-neutral-900">{testimonial.author}</p>
                      <p className="text-xs text-neutral-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </main>
  );
}
