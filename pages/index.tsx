import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { Hero } from "@/components/Hero";
import { InsightArtwork } from "@/components/InsightArtwork";
import { Container } from "@/components/layout/Container";
import { benefits, quizOptions, testimonials } from "@/data/site";
import { psychologists } from "@/data/psychologists";
import { getAllInsightArticles } from "@/lib/insights";
import { formatInsightDate } from "@/lib/formatting";
import { cx } from "@/lib/cx";
import { usePageReveal } from "@/lib/usePageReveal";
import type { InsightArticle } from "@/types/content";

const optionToneClass = {
  sky: "border-primary-400 bg-primary-300/35 text-primary-700 shadow-[0_18px_45px_rgba(93,155,247,0.14)]",
  mint: "border-accent-300 bg-accent-300/55 text-emerald-700 shadow-[0_18px_45px_rgba(155,227,200,0.16)]",
  peach: "border-amber-200 bg-amber-50 text-amber-700 shadow-[0_18px_45px_rgba(255,219,188,0.2)]",
  lavender: "border-violet-200 bg-violet-50 text-violet-700 shadow-[0_18px_45px_rgba(221,214,254,0.2)]",
  amber: "border-orange-200 bg-orange-50 text-orange-700 shadow-[0_18px_45px_rgba(255,209,158,0.2)]",
};

const optionDotToneClass = {
  sky: "bg-primary-500",
  mint: "bg-emerald-500",
  peach: "bg-amber-500",
  lavender: "bg-violet-500",
  amber: "bg-orange-500",
};

const benefitIconByKey = {
  home: "/homepage/icon-benefit-home.png",
  sofa: "/homepage/icon-benefit-sofa.png",
  time: "/homepage/icon-benefit-clock.png",
} as const;

const psychologistPortraitById: Record<string, string> = {
  "olaffiqih-wibowo": "/homepage/psychologist-olaffiqih-wibowo.png",
  "ni-made-rai-kistyanti": "/homepage/psychologist-ni-made-rai-kistyanti.png",
  "nanda-adhiningtyas": "/homepage/psychologist-nanda-adhiningtyas.png",
  nurhamidah: "/homepage/psychologist-nurhamidah.png",
};

const homepagePsychologistIds = [
  "olaffiqih-wibowo",
  "ni-made-rai-kistyanti",
  "nanda-adhiningtyas",
  "nurhamidah",
  "ganesha-pradana",
] as const;

const homepagePsychologists = homepagePsychologistIds
  .map((id) => psychologists.find((psychologist) => psychologist.id === id))
  .filter((psychologist): psychologist is (typeof psychologists)[number] => Boolean(psychologist));

function AssetPlaceholder({ className, label }: { className?: string; label: string }): JSX.Element {
  return (
    <div className={cx("grid place-items-center rounded-[28px] border border-dashed border-primary-300/80 bg-primary-300/18 p-6 text-center", className)}>
      <span className="rounded-full bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </span>
    </div>
  );
}

function initialsFromName(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export default function HomePage({
  insightArticles,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const psychologistRailRef = useRef<HTMLDivElement | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState(quizOptions[0]?.id ?? "");
  const [featuredInsight, ...secondaryInsights] = insightArticles;

  function scrollPsychologists(direction: number): void {
    psychologistRailRef.current?.scrollBy({
      left: direction * 320,
      behavior: "smooth",
    });
  }

  return (
    <>
      <Head>
        <title>Lumina Consulting</title>
        <meta
          content="Lumina Consulting membantu Anda menemukan psikolog, layanan, dan alur booking yang terasa jelas dan tenang."
          name="description"
        />
      </Head>

      <main ref={pageRef}>
        <Container>
          <Hero />
        </Container>

        <Container className="mt-8 sm:mt-12">
          <section className="space-y-8" id="healing-starts">
            <div className="max-w-3xl space-y-4" data-reveal>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-white shadow-1">
                <Image alt="Healing starts icon" height={77} src="/homepage/icon-healing-hand.png" width={71} />
              </div>
              <p className="text-lg font-semibold text-accent-500">Penyembuhan dimulai saat kamu merasa</p>
              <h2 className="font-display text-4xl font-semibold leading-tight text-neutral-900 sm:text-5xl">
                paling menjadi dirimu sendiri.
              </h2>
              <p className="text-body text-neutral-700">
                Pengalaman konseling individu yang personal, aman, dan sepenuhnya online ketika kamu membutuhkannya.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card
                  key={benefit.id}
                  className="h-full rounded-[30px] bg-white/95 p-6 sm:p-8"
                  data-reveal
                  data-reveal-delay={(index * 0.08).toString()}
                >
                  <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary-300/20">
                    <Image alt={benefit.title} height={48} src={benefitIconByKey[benefit.icon]} width={48} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-neutral-900">{benefit.title}</h3>
                  <p className="mt-4 text-small leading-7 text-neutral-700">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </section>
        </Container>

        <Container className="mt-20">
          <section className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between" data-reveal>
              <div className="flex items-start gap-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-white shadow-1">
                  <Image alt="Our Psychologists icon" height={55} src="/homepage/icon-psychologists-heart.png" width={64} />
                </div>
                <div>
                  <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">Psikolog Kami</p>
                  <h2 className="mt-2 font-display text-4xl font-semibold text-neutral-900 sm:text-5xl">
                    Kenali psikolog kami.
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-lg text-neutral-900 transition hover:bg-neutral-100"
                  onClick={() => scrollPsychologists(-1)}
                  type="button"
                >
                  ←
                </button>
                <button
                  aria-label="Scroll psychologist list right"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-lg text-neutral-900 transition hover:bg-neutral-100"
                  onClick={() => scrollPsychologists(1)}
                  type="button"
                >
                  →
                </button>
              </div>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" ref={psychologistRailRef}>
              {homepagePsychologists.map((psychologist, index) => (
                <Card
                  key={psychologist.id}
                  className="min-w-[272px] rounded-[30px] bg-white/95 p-4 sm:min-w-[296px]"
                  data-reveal
                  data-reveal-delay={(index * 0.08).toString()}
                >
                  <div className="overflow-hidden rounded-[26px] bg-primary-300/20">
                    {psychologistPortraitById[psychologist.id] ? (
                      <Image
                        alt={psychologist.name}
                        className="h-auto w-full"
                        height={320}
                        src={psychologistPortraitById[psychologist.id]}
                        width={316}
                      />
                    ) : (
                      <AssetPlaceholder className="aspect-[79/80] rounded-[26px]" label={`placeholder-${psychologist.id}.png`} />
                    )}
                  </div>
                  <div className="space-y-4 px-1 pb-2 pt-5">
                    <div>
                      <h3 className="font-display text-[26px] font-semibold leading-tight text-neutral-900">{psychologist.name}</h3>
                      <p className="mt-2 text-small font-medium text-primary-600">{psychologist.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {psychologist.specialties.slice(0, 3).map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full bg-primary-300/25 px-3 py-1 text-xs font-semibold text-primary-700"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                    <Link className="inline-flex text-sm font-semibold text-neutral-900 transition hover:text-primary-600" href={`/booking/${psychologist.id}`}>
                      Book Session ↗
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </Container>

        <Container className="mt-20">
          <section className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
              <h2 className="font-display text-4xl font-semibold text-neutral-900">Mereka Menggunakan Layanan Kami</h2>
              <Link
                className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
                href="/services"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={testimonial.id}
                  className="h-full rounded-[30px] bg-white/95 p-6 sm:p-8"
                  data-reveal
                  data-reveal-delay={(index * 0.08).toString()}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-5xl leading-none text-primary-400">“</span>
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-300/30 text-sm font-semibold text-primary-700">
                      {initialsFromName(testimonial.author)}
                    </span>
                  </div>
                  <p className="mt-5 text-small leading-7 text-neutral-700">{testimonial.quote}</p>
                  <div className="mt-7 border-t border-primary-300/50 pt-5">
                    <p className="font-semibold text-neutral-900">{testimonial.author}</p>
                    <p className="text-small text-neutral-500">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </Container>

        {featuredInsight ? (
          <Container className="mt-20" id="insights">
            <section className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-reveal>
                <div>
                  <p className="text-small font-semibold uppercase tracking-[0.2em] text-primary-600">Lumina Insight</p>
                  <h2 className="mt-3 font-display text-4xl font-semibold text-neutral-900 sm:text-5xl">Artikel &amp; sumber daya untuk kesehatan mental.</h2>
                  <p className="mt-3 max-w-2xl text-body text-neutral-700">
                    Tiga bacaan pembuka untuk menunjukkan nada editorial Lumina: hangat, reflektif, dan tetap praktis untuk dibawa ke kehidupan sehari-hari.
                  </p>
                </div>
                <Link
                  className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-neutral-300 bg-white px-5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
                  href="/insight"
                >
                  Jelajahi Insight
                </Link>
              </div>

              <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
                <Card className="overflow-hidden rounded-[34px] p-0" data-reveal>
                  <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
                    <div className="flex flex-col justify-between p-8 sm:p-10">
                      <div>
                        <span className="inline-flex rounded-full bg-primary-300/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                          {featuredInsight.label}
                        </span>
                        <Link href={featuredInsight.href}>
                          <h3 className="mt-5 max-w-lg font-display text-3xl font-semibold leading-tight text-neutral-900 transition hover:text-primary-600 sm:text-[40px]">
                            {featuredInsight.title}
                          </h3>
                        </Link>
                        <p className="mt-4 max-w-xl text-body leading-8 text-neutral-700">{featuredInsight.excerpt}</p>
                      </div>
                      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-small text-neutral-500">
                        <span>
                          {featuredInsight.author} · {formatInsightDate(featuredInsight.publishedAt)}
                        </span>
                        <Link className="font-semibold text-neutral-900 transition hover:text-primary-600" href={featuredInsight.href}>
                          Baca selengkapnya ↗
                        </Link>
                      </div>
                    </div>
                    <InsightArtwork
                      article={featuredInsight}
                      className="min-h-[300px] rounded-none border-0 border-t border-primary-300/60 lg:border-l lg:border-t-0"
                    />
                  </div>
                </Card>

                <div className="grid gap-5">
                  {secondaryInsights.map((article, index) => (
                    <Card
                      key={article.id}
                      className="overflow-hidden rounded-[34px] p-0"
                      data-reveal
                      data-reveal-delay={(0.08 * (index + 1)).toString()}
                    >
                      <div className="grid gap-0 sm:grid-cols-[0.9fr_1.1fr]">
                        <InsightArtwork
                          article={article}
                          className="min-h-[220px] rounded-none border-0 border-b border-primary-300/60 sm:border-b-0 sm:border-r"
                          compact
                        />
                        <div className="flex flex-col justify-between gap-5 p-6">
                          <div>
                            <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                              {article.label}
                            </span>
                            <Link href={article.href}>
                              <h3 className="mt-4 font-display text-2xl font-semibold leading-tight text-neutral-900 transition hover:text-primary-600">
                                {article.title}
                              </h3>
                            </Link>
                            <p className="mt-3 text-small leading-7 text-neutral-700">{article.excerpt}</p>
                          </div>
                          <div className="flex flex-wrap items-center justify-between gap-3 text-small text-neutral-500">
                            <span>{article.readTime}</span>
                            <Link className="font-semibold text-neutral-900 transition hover:text-primary-600" href={article.href}>
                              Open insight ↗
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </Container>
        ) : null}

        <Container className="mt-20" id="quiz">
          <section className="space-y-8">
            <div className="text-center" data-reveal>
              <h2 className="font-display text-4xl font-semibold text-primary-600 sm:text-5xl">Bingung Mulai Dari Mana?</h2>
              <p className="mt-3 text-body text-neutral-700">
                Isi formulir singkat berikut. Asisten psikolog kami akan membantu mengarahkanmu dengan layanan yang terasa paling relevan.
              </p>
            </div>

            <Card className="rounded-[34px] p-6 sm:p-8 lg:p-10" data-reveal>
              <div className="mb-7 h-1.5 rounded-full bg-primary-300/35">
                <div className="h-full w-1/4 rounded-full bg-primary-600" />
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <p className="text-small font-semibold uppercase tracking-[0.18em] text-primary-600">Isi formulir berikut</p>
                  <h3 className="mt-4 font-display text-2xl font-semibold text-neutral-900 sm:text-[32px]">
                    Apa yang membawa Anda ke Lumina Consulting hari ini?
                  </h3>
                  <p className="mt-3 text-small leading-7 text-neutral-600 sm:text-base">
                    Asisten psikolog kami akan membantu mengarahkanmu dengan layanan yang terasa paling relevan.
                  </p>
                </div>
                <span className="hidden rounded-full bg-primary-300/30 px-4 py-2 text-small font-semibold text-primary-600 sm:inline-flex">
                  1/4 Pages
                </span>
              </div>

              <div className="mt-8">
                <div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {quizOptions.map((option) => {
                      const isActive = option.id === selectedQuizOption;

                      return (
                        <button
                          key={option.id}
                          className={cx(
                            "flex min-h-[64px] items-center gap-3 rounded-full border px-5 py-4 text-left text-small font-medium transition",
                            isActive
                              ? optionToneClass[option.accent]
                              : "border-neutral-300 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-300/10"
                          )}
                          onClick={() => setSelectedQuizOption(option.id)}
                          type="button"
                        >
                          <span className={cx("h-3.5 w-3.5 shrink-0 rounded-full", optionDotToneClass[option.accent])} />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <span className="text-small text-neutral-500 sm:hidden">1/4 Pages</span>
                  <span className="hidden text-small text-neutral-500 sm:inline">Pilih topik yang paling mendekati kebutuhanmu saat ini.</span>
                  <Link
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-lg text-white transition hover:bg-neutral-800"
                    href="/psychologists"
                  >
                    →
                  </Link>
                </div>
              </div>
            </Card>
          </section>
        </Container>

        <CtaBanner />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ insightArticles: InsightArticle[] }> = async () => {
  return {
    props: {
      insightArticles: await getAllInsightArticles(),
    },
  };
};