#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
import dotenv from 'dotenv';

dotenv.config();

const md = new MarkdownIt({ html: true });
const BLOG_DIR = path.join(process.cwd(), 'public', 'content', 'blog');
const SITE_DIR = path.join(process.cwd(), 'public', 'content', 'site');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'blog-data');

function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

function parseMarkdownPost(content, slug) {
  const { data, content: body } = matter(content);

  let htmlContent = md.render(body);
  const basePath = process.env.DEPLOYMENT_PATH || '';
  if (basePath && basePath !== '/') {
    htmlContent = htmlContent.replace(/src="\/([^"]+)"/g, `src="${basePath}/$1"`);
  }
  const slugName = data.slug || slug;
  
  const publishedAtRaw = data.date || data.publishedAt || new Date().toISOString();
  const publishedAt = publishedAtRaw instanceof Date ? publishedAtRaw.toISOString() : String(publishedAtRaw);
  const readTime = data.readTime || estimateReadTime(body);

  return {
    id: slugName,
    slug: slugName,
    href: `/insight/${slugName}`,
    label: data.label || data.category || 'Insight',
    title: data.title || 'Untitled',
    excerpt: data.description || data.excerpt || body.substring(0, 160).replace(/[#*`_]/g, ''),
    format: data.format || 'article',
    author: data.author || '',
    authorRole: data.authorRole || data.author_role || '',
    category: data.category || '',
    publishedAt,
    readTime,
    accent: data.accent || 'sky',
    artworkVariant: data.artworkVariant || 'wave',
    intro: data.intro || '',
    highlightQuote: data.highlightQuote || data.highlight_quote || null,
    highlightAttribution: data.highlightAttribution || data.highlight_attribution || null,
    keyTakeaways: Array.isArray(data.keyTakeaways) ? data.keyTakeaways : [],
    featured: Boolean(data.featured),
    contentHtml: htmlContent,
  };
}

function buildBlogData() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let posts = [];
  if (fs.existsSync(BLOG_DIR)) {
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
    posts = files.map((f) => {
      const slug = f.replace(/\.mdx?$/, '');
      const content = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8');
      return parseMarkdownPost(content, slug);
    });

    posts.sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'posts.json'), JSON.stringify(posts, null, 2));
  console.log(`✅ Blog data compiled: ${posts.length} posts`);

  // Generate cover-images.json dynamically from uploads
  let coverImages = [];
  const uploadDir = path.join(process.cwd(), 'public', 'content', 'upload');
  if (fs.existsSync(uploadDir)) {
    coverImages = fs.readdirSync(uploadDir)
      .filter((f) => f.endsWith('.webp') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
      .filter((f) => f !== 'branding.webp' && f !== 'hero-psychologist-collage.webp')
      .map((f) => `/content/upload/${f}`);
  }
  if (coverImages.length === 0) {
    coverImages = [
      "/content/upload/service-1.1.webp",
      "/content/upload/service-2.1.webp",
      "/content/upload/service-3.1.webp"
    ];
  }
  fs.writeFileSync(path.join(OUTPUT_DIR, 'cover-images.json'), JSON.stringify(coverImages, null, 2));
  console.log(`✅ Cover images list compiled: ${coverImages.length} images`);

  // Generate sitemap.xml
  const baseUrl = (process.env.PUBLIC_SITE_URL || 'https://luminaconsulting.id') + (process.env.DEPLOYMENT_PATH || '');
  const staticPages = ['', '/services', '/psychologists', '/insight', '/booking'];
  const urls = [...staticPages.map((p) => `${baseUrl}${p}`)];

  posts.forEach((post) => {
    urls.push(`${baseUrl}/insight/${post.slug}`);
  });

  const psychFile = path.join(SITE_DIR, 'psychologists.json');
  if (fs.existsSync(psychFile)) {
    try {
      const psychData = JSON.parse(fs.readFileSync(psychFile, 'utf-8'));
      const items = psychData.content || psychData || [];
      items.forEach((item) => {
        if (item.id) urls.push(`${baseUrl}/psychologists/${item.id}`);
      });
    } catch (e) {
      console.error('Failed to parse psychologists.json for sitemap:', e);
    }
  }

  const xmlItems = urls
    .map(
      (url) => `\n  <url>\n    <loc>${url}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${xmlItems}\n</urlset>`;
  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), xml);
  console.log(`✅ Sitemap compiled: ${urls.length} urls`);
}

buildBlogData();
