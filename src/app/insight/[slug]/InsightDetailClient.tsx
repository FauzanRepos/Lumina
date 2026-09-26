"use client";

import { Image } from "@/components/Image";
import Link from "next/link";

import { buttonClasses } from "@/components/Button";
import { Card } from "@/components/Card";
import { CtaBanner } from "@/components/CTABanner";
import { Container } from "@/components/layout/Container";
import { formatInsightDate } from "@/lib/formatting";
import { authorSlugFromName, getInsightCoverImage } from "@/lib/insight-images";
import { usePageReveal } from "@/lib/usePageReveal";
import type { InsightArticle } from "@/types/content";

function RelatedArticleItem({
  article,
}: {
  article: InsightArticle;
}): JSX.Element {
  return (
    <Link className="group flex gap-4 rounded-[20px] p-2 transition hover:bg-white/70" href={article.href}>
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

export default function InsightDetailClient({
  article,
  relatedArticles,
}: {
  article: InsightArticle;
  relatedArticles: InsightArticle[];
}): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>(article.slug);
  const authorSlug = authorSlugFromName(article.author);
  const coverImage = getInsightCoverImage(article.slug);

  return (
    <main className="pb-4" ref={pageRef}>
      <section className="relative min-h-[320px] overflow-hidden sm:min-h-[420px] lg:min-h-[480px]">
        <Image alt="" className="object-cover" fill priority sizes="100vw" src={coverImage} />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/25 to-transparent" />
        <Container className="relative flex h-full min-h-[320px] items-end pb-10 pt-28 sm:min-h-[420px] sm:pb-12 lg:min-h-[480px]">
          <h1 className="max-w-4xl font-display text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>
        </Container>
      </section>

      <Container className="mt-10">
        <div className="grid gap-8 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start" data-reveal>
            <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full bg-primary-300/30 xl:mx-0">
              <Image
                alt={article.author}
                className="object-cover"
                fill
                sizes="80px"
                src={`/content/upload/psychologist-olaffiqih-wibowo.webp`}
              />
            </div>
            <div>
              <Link className="font-display text-lg font-semibold text-neutral-900 transition hover:text-primary-600" href={`/insight/author/${authorSlug}`}>
                {article.author}
              </Link>
              <p className="mt-2 text-small text-neutral-500">
                {formatInsightDate(article.publishedAt)} • {article.readTime}
              </p>
            </div>
            <button
              className={buttonClasses({ size: "sm", variant: "ghost" })}
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.share) {
                  void navigator.share({
                    title: article.title,
                    url: window.location.href,
                  });
                }
              }}
              type="button"
            >
              Share
            </button>
          </aside>

          <article data-reveal data-reveal-delay="0.08">
            <Card className="rounded-[34px] p-8 sm:p-10">
              {article.intro ? <p className="text-lg leading-8 text-neutral-700">{article.intro}</p> : null}

              {article.highlightQuote ? (
                <div className="mt-8 rounded-[28px] bg-primary-300/18 p-6 sm:p-8">
                  <p className="font-display text-3xl font-semibold leading-tight text-neutral-900 sm:text-[36px]">
                    “{article.highlightQuote}”
                  </p>
                  {article.highlightAttribution ? (
                    <p className="mt-4 text-small font-medium text-neutral-500">{article.highlightAttribution}</p>
                  ) : null}
                </div>
              ) : null}

              <div
                className="mt-10 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:text-neutral-900 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:text-neutral-900 [&_p]:mt-4 [&_p]:text-base [&_p]:leading-8 [&_p]:text-neutral-700 [&_ul]:mt-4 [&_ul]:space-y-3 [&_ul]:pl-5 [&_li]:text-base [&_li]:leading-8 [&_li]:text-neutral-700"
                dangerouslySetInnerHTML={{ __html: article.contentHtml }}
              />
            </Card>
          </article>
        </div>
      </Container>

      <Container className="mt-20">
        <section className="space-y-8">
          <div className="flex items-center gap-4" data-reveal>
            <div className="h-px flex-1 bg-neutral-200" />
            <h2 className="font-display text-2xl font-semibold text-neutral-900 sm:text-3xl">Baca Artikel Lainnya</h2>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <div className="space-y-2">
            {relatedArticles.map((relatedArticle) => (
              <RelatedArticleItem key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </section>
      </Container>

      <CtaBanner />
    </main>
  );
}
