/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  swcMinify: true,
  // Export-friendly output: generate folder/index.html for pages
  trailingSlash: true,
  // Disable Next.js image optimization for static export compatibility
  images: {
    unoptimized: true,
  },
};

export default nextConfig;