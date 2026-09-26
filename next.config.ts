import type { NextConfig } from "next";

// Read deployment path from environment
// If set and not "/", this path will be prepended to all routes and assets
// Examples: "/lumina", "/app", "/portal", or leave empty for root "/"
const deploymentPath = process.env.DEPLOYMENT_PATH; console.log("DEPLOYMENT PATH IN NEXT CONFIG IS:", deploymentPath);

const nextConfig: NextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Static export mode - fully compatible with static hosting (Netlify, Vercel, etc)
  // Disables SSR, API routes, and server-side rendering
  // All pages must be pre-generated at build time using getStaticProps/getStaticPaths
  output: "export",
  // Flatten the output structure for easier nginx serving
  distDir: "out",
  images: {
    unoptimized: true,
  },
  // Apply basePath and assetPrefix if deployment path is configured
  ...(deploymentPath && deploymentPath !== '/' ? { 
    basePath: deploymentPath,
    assetPrefix: deploymentPath,
  } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: deploymentPath && deploymentPath !== '/' ? deploymentPath : "",
  },
  // Disable Next.js dev indicators (e.g., "Fast Refresh" overlay) for cleaner UI
  devIndicators: false,
};

export default nextConfig;
