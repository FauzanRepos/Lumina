import coverImages from "../../public/blog-data/cover-images.json";

// Only use non-psychologist images as article covers (service scenes are more
// contextually appropriate than headshots).
const articleCoverImages = coverImages.filter(
  (src) => !src.includes("/psychologist-")
);

const imagePool = articleCoverImages.length > 0 ? articleCoverImages : coverImages;

export function getInsightCoverImage(slug: string, basePath = ""): string {
  let hash = 0;
  for (let index = 0; index < slug.length; index += 1) {
    hash = (hash + slug.charCodeAt(index)) % imagePool.length;
  }
  return `${basePath}${imagePool[hash]}`;
}

export function authorSlugFromName(author: string): string {
  return author
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
