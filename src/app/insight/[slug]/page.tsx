import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllInsightArticles, getAllInsightSlugs, getInsightArticleBySlug } from "@/lib/insights";
import InsightDetailClient from "./InsightDetailClient";

export async function generateStaticParams() {
  const slugs = await getAllInsightSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getInsightArticleBySlug(slug);
  if (!article) return { title: "Insight Article" };

  return {
    title: `${article.title} | Lumina Insight`,
    description: article.excerpt,
    alternates: {
      canonical: article.href,
    },
    other: {
      "article:published_time": article.publishedAt,
      "article:author": article.author,
    },
  };
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getInsightArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const allArticles = await getAllInsightArticles();
  const relatedArticles = allArticles.filter((entry) => entry.slug !== article.slug).slice(0, 3);

  return <InsightDetailClient article={article} relatedArticles={relatedArticles} />;
}
