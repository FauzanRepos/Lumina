import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllInsightArticles } from "@/lib/insights";
import { authorSlugFromName } from "@/lib/insight-images";
import AuthorClient from "./AuthorClient";

export async function generateStaticParams() {
  const articles = await getAllInsightArticles();
  const slugs = Array.from(new Set(articles.map((article) => authorSlugFromName(article.author)).filter(Boolean)));
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const articles = (await getAllInsightArticles()).filter((article) => authorSlugFromName(article.author) === slug);
  const authorName = articles[0]?.author ?? "Author";

  return {
    title: `${authorName} | Lumina Insight`,
    description: `Artikel oleh ${authorName} di Lumina Insight.`,
    alternates: {
      canonical: `/insight/author/${slug}`,
    },
  };
}

export default async function InsightAuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const articles = (await getAllInsightArticles()).filter((article) => authorSlugFromName(article.author) === slug);

  if (!articles.length) {
    notFound();
  }

  const authorName = articles[0].author;

  return <AuthorClient authorName={authorName} articles={articles} slug={slug} />;
}
