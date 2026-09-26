"use client";

import { Image } from "@/components/Image";
import Link from "next/link";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { Container } from "@/components/layout/Container";
import { formatInsightDate } from "@/lib/formatting";
import { getInsightCoverImage } from "@/lib/insight-images";
import { usePageReveal } from "@/lib/usePageReveal";
import type { InsightArticle } from "@/types/content";

function ArticleListItem({
  article,
  revealDelay,
}: {
  article: InsightArticle;
  revealDelay?: string;
}): JSX.Element {
  return (
    <Link
      className="group flex gap-4 rounded-[20px] p-2 transition hover:bg-white/70"
      data-reveal
      data-reveal-delay={revealDelay}
      href={article.href}
    >
      <div className="relative h-[88px] w-[120px] flex-shrink-0 overflow-hidden rounded-[16px] bg-primary-300/20">
        <Image
          alt=""
          className="h-full w-full object-cover"
          fill
          sizes="120px"
          src={getInsightCoverImage(article.slug)}
        />
      </div>
      <div className="min-w-0 flex-1 py-1">
        <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-neutral-900 transition group-hover:text-primary-600">
          {article.title}
        </h3>
        <p className="mt-2 text-xs text-neutral-500">
          {article.author} • {formatInsightDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  );
}

export default function InsightIndexClient({
  insightArticles,
}: {
  insightArticles: InsightArticle[];
}): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const [featuredArticle, ...moreArticles] = insightArticles;

  if (!featuredArticle) {
    return (
      <main className="pb-4" ref={pageRef}>
        <Container className="pt-10 sm:pt-14">
          <Card className="rounded-[34px] p-8 sm:p-10">
            <p className="text-small font-semibold uppercase tracking-[0.24em] text-primary-600">Lumina Insight</p>
            <h1 className="mt-4 font-display text-2xl font-semibold text-neutral-900 sm:text-3xl">No insights published yet.</h1>
            <p className="mt-4 text-body leading-8 text-neutral-700">
              Tambahkan artikel baru melalui Decap CMS atau folder <code>content/blog</code> untuk mengisi halaman ini.
            </p>
          </Card>
        </Container>
      </main>
    );
  }

  return (
    <main className="pb-4" ref={pageRef}>
      <Container className="pt-10 sm:pt-14">
        <h1 className="font-display text-2xl font-semibold text-neutral-900 sm:text-3xl" data-reveal>
          Artikel Terbaru
        </h1>

        <section className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
          <Link className="block overflow-hidden rounded-[24px]" data-reveal href={featuredArticle.href}>
            <div className="relative aspect-[4/3] w-full">
              <Image
                alt=""
                className="object-cover"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={getInsightCoverImage(featuredArticle.slug)}
              />
            </div>
          </Link>

          <div data-reveal data-reveal-delay="0.08">
            <Link href={featuredArticle.href}>
              <h2 className="font-display text-2xl font-semibold leading-tight text-neutral-900 transition hover:text-primary-600 sm:text-3xl">
                {featuredArticle.title}
              </h2>
            </Link>
            <p className="mt-4 line-clamp-3 text-body leading-8 text-neutral-700">{featuredArticle.excerpt}</p>
            <p className="mt-6 text-small text-neutral-500">
              {featuredArticle.author} • {formatInsightDate(featuredArticle.publishedAt)}
            </p>
          </div>
        </section>

        <div className="my-12 border-t border-neutral-200" />

        <section className="grid gap-2 md:grid-cols-2">
          {moreArticles.slice(0, 6).map((article, index) => (
            <ArticleListItem
              key={article.id}
              article={article}
              revealDelay={(0.06 * (index + 1)).toString()}
            />
          ))}
        </section>

        {moreArticles.length > 6 ? (
          <div className="mt-8 flex justify-end" data-reveal>
            <Link className={buttonClasses({ size: "md" })} href={featuredArticle.href}>
              Lihat Semua
            </Link>
          </div>
        ) : null}
      </Container>

      <CtaBanner />
    </main>
  );
}
