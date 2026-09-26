import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const basePath = process.env.DEPLOYMENT_PATH || "";
const SITE_URL = process.env.PUBLIC_SITE_URL || "https://luminaconsulting.id";

export const viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Lumina Consulting",
  description: "Akses layanan psikologi berkualitas & relevan dengan perkembangan zaman",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "Lumina Consulting",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakartaSans.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href={`${basePath}/manifest.webmanifest`} />
        <link rel="icon" href={`${basePath}/favicon.svg`} type="image/svg+xml" />
        <link rel="alternate icon" href={`${basePath}/favicon.ico`} />
        <link rel="apple-touch-icon" href={`${basePath}/favicon.svg`} />
        <link rel="mask-icon" href={`${basePath}/favicon.svg`} color="#0ea5b7" />
        <meta property="og:image" content={`${SITE_URL}${basePath}/og-image.svg`} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="min-h-full flex flex-col flex-1">
          <Header />
          <main className="flex-grow flex-shrink-0">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
