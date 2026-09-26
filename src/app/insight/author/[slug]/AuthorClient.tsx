"use client";

import { Image } from "@/components/Image";
import Link from "next/link";

import { CtaBanner } from "@/components/CTABanner";
import { Container } from "@/components/layout/Container";
import { formatInsightDate } from "@/lib/formatting";
import { getInsightCoverImage } from "@/lib/insight-images";
import { usePageReveal } from "@/lib/usePageReveal";
import type { InsightArticle } from "@/types/content";

function AuthorArticleItem({
  article,
  featured = false,
}: {
  article: InsightArticle;
  featured?: boolean;
}): JSX.Element {
  if (featured) {
    return (
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <Link className="block overflow-hidden rounded-[24px]" href={article.href}>
          <div className="relative aspect-[4/3] w-full">
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src={getInsightCoverImage(article.slug)}
            />
          </div>
        </Link>
        <div>
          <Link href={article.href}>
            <h2 className="font-display text-2xl font-semibold leading-tight text-neutral-900 transition hover:text-primary-600 sm:text-3xl">
              {article.title}
            </h2>
          </Link>
          <p className="mt-4 line-clamp-3 text-body leading-8 text-neutral-700">{article.excerpt}</p>
          <p className="mt-6 text-small text-neutral-500">
            {article.author} • {formatInsightDate(article.publishedAt)}
          </p>
        </div>
      </section>
    );
  }

  return (
    <Link className="group flex gap-4 rounded-[20px] border-t border-neutral-200 py-6 transition hover:bg-white/70" href={article.href}>
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
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">{article.excerpt}</p>
        <p className="mt-3 text-xs text-neutral-500">
          {article.author} • {formatInsightDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  );
}

export default function AuthorClient({
  authorName,
  articles,
  slug,
}: {
  authorName: string;
  articles: InsightArticle[];
  slug: string;
}): JSX.Element {
  const pageRef = usePageReveal<HTMLElement>();
  const [featuredArticle, ...moreArticles] = articles;

  return (
    <main className="pb-4" ref={pageRef}>
      <Container className="pt-10 sm:pt-14">
        <section className="flex flex-col items-start gap-5 sm:flex-row sm:items-center" data-reveal>
          <div className="relative h-24 w-24 overflow-hidden rounded-full bg-primary-300/30">
            <Image
              alt={authorName}
              className="object-cover"
              fill
              sizes="96px"
              src={`/content/upload/psychologist-olaffiqih-wibowo.webp`}
            />
          </div>
          <h1 className="font-display text-2xl font-semibold text-neutral-900 sm:text-3xl">{authorName}</h1>
        </section>

        {featuredArticle ? (
          <div className="mt-10">
            <AuthorArticleItem article={featuredArticle} featured />
          </div>
        ) : null}

        {moreArticles.length > 0 ? <div className="my-12 border-t border-neutral-200" /> : null}

        <section className="space-y-1">
          {moreArticles.map((article) => (
            <AuthorArticleItem key={article.id} article={article} />
          ))}
        </section>
      </Container>

      <CtaBanner />
    </main>
  );
}
