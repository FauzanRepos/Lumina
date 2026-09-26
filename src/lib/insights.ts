import type { InsightArticle } from "@/types/content";
import postsJson from "@/public/blog-data/posts.json";

export async function getAllInsightArticles(): Promise<InsightArticle[]> {
  return postsJson as InsightArticle[];
}

export async function getAllInsightSlugs(): Promise<string[]> {
  const articles = await getAllInsightArticles();
  return articles.map((a) => a.slug);
}

export async function getInsightArticleBySlug(slug: string): Promise<InsightArticle | undefined> {
  const articles = await getAllInsightArticles();
  return articles.find((a) => a.slug === slug);
}
