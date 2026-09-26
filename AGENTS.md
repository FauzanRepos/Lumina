<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Lumina Project Rules

## 1. Static Generation Only — No Server-Side Rendering

- All pages **must** use static generation (`generateStaticParams`, static exports).
- **Do not** use server-side rendering (`getServerSideProps`, dynamic server routes, or any per-request server rendering).
- The build output must be a fully static site (`output: 'export'` in `next.config`).
- No server-dependent features: no API routes, no server actions, no middleware that requires a Node.js runtime at serve-time.
- If a page needs dynamic data, fetch it at **build time** or on the **client side** — never on the server at request time.

## 2. Decap CMS Only

- **Decap CMS** (formerly Netlify CMS) is the only permitted content management system.
- Do not introduce any other CMS, headless CMS, or content platform (e.g., Sanity, Contentful, Strapi, WordPress, etc.).
- All content should be managed through Decap CMS with Git-based workflows (content stored as flat files in the repository).
- CMS configuration lives in `public/admin/config.yml`.
- Decap CMS only modifies files inside `public/content/` (subdirectories: `blog/`, `site/`, `upload/`).
- **Do not** store or edit CMS-managed content outside of `public/content/`.

## 3. Custom Pre-Build Scripts

Two custom Node.js scripts run **before** the Next.js build. They live in `scripts/`.

### `build-blog-json` — Content & Sitemap Generator
- Reads flat-file content from `public/content/` (markdown, YAML, etc.) and generates JSON data files consumed by the app at build time.
- Also generates the sitemap and any other derived static data.
- Must run before `next build` and `next dev` (wired into `npm run build` and `npm run dev`).

### `convert-images` — Image Compression / WebP Conversion
- Converts and compresses images to WebP (or other optimised formats).
- Run on-demand via a dedicated npm script (e.g., `npm run images:webp`).
- Original source images live in `public/content/upload/`; optimised outputs go to the appropriate public directory.

### Script Rules
- All content generation, sitemap generation, and data transformation **must** happen in these scripts — not inside Next.js build plugins, API routes, or server-side code.
- Keep scripts self-contained in `scripts/` with no runtime dependency on the Next.js server.
