import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

import type { AccentTone, InsightArticle, InsightArtworkVariant, InsightFormat } from "@/types/content";

interface InsightFrontMatter {
  title: string;
  slug?: string;
  description: string;
  label: string;
  format: InsightFormat;
  author: string;
  authorRole: string;
  category: string;
  date: string;
  readTime: string;
  accent: AccentTone;
  artworkVariant: InsightArtworkVariant;
  intro: string;
  highlightQuote?: string;
  highlightAttribution?: string;
  keyTakeaways?: string[];
  featured?: boolean;
}

const insightDirectory = path.join(process.cwd(), "insight/content/articles");

function normalizePublishedDate(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value.slice(0, 10);
}

async function renderMarkdown(markdown: string): Promise<string> {
  const rendered = await remark().use(html).process(markdown);

  return rendered.toString().trim();
}

async function readInsightFile(fileName: string): Promise<InsightArticle> {
  const fallbackSlug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(insightDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(fileContents);
  const frontMatter = data as InsightFrontMatter;
  const slug = frontMatter.slug ?? fallbackSlug;

  return {
    id: slug,
    slug,
    href: `/insight/${slug}`,
    label: frontMatter.label,
    title: frontMatter.title,
    excerpt: frontMatter.description,
    format: frontMatter.format,
    author: frontMatter.author,
    authorRole: frontMatter.authorRole,
    category: frontMatter.category,
    publishedAt: normalizePublishedDate(frontMatter.date),
    readTime: frontMatter.readTime,
    accent: frontMatter.accent,
    artworkVariant: frontMatter.artworkVariant,
    intro: frontMatter.intro,
    keyTakeaways: frontMatter.keyTakeaways ?? [],
    featured: Boolean(frontMatter.featured),
    contentHtml: await renderMarkdown(content),
    ...(frontMatter.highlightQuote ? { highlightQuote: frontMatter.highlightQuote } : {}),
    ...(frontMatter.highlightAttribution ? { highlightAttribution: frontMatter.highlightAttribution } : {}),
  };
}

function compareInsightArticles(left: InsightArticle, right: InsightArticle): number {
  if (left.featured !== right.featured) {
    return left.featured ? -1 : 1;
  }

  return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
}

export async function getAllInsightArticles(): Promise<InsightArticle[]> {
  const fileNames = fs.readdirSync(insightDirectory).filter((fileName) => fileName.endsWith(".md"));
  const articles = await Promise.all(fileNames.map((fileName) => readInsightFile(fileName)));

  return articles.sort(compareInsightArticles);
}

export async function getAllInsightSlugs(): Promise<string[]> {
  const fileNames = fs.readdirSync(insightDirectory).filter((fileName) => fileName.endsWith(".md"));

  return fileNames.map((fileName) => fileName.replace(/\.md$/, ""));
}

export async function getInsightArticleBySlug(slug: string): Promise<InsightArticle | undefined> {
  const filePath = path.join(insightDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    console.log(`[insight] getInsightArticleBySlug: missing file ${filePath}`);
    return undefined;
  }

  console.log(`[insight] getInsightArticleBySlug: reading file ${filePath}`);

  return readInsightFile(`${slug}.md`);
}