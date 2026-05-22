import type { AppProps } from "next/app";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import "@/styles/globals.css";

export default function App({ Component, pageProps, router }: AppProps): JSX.Element {
  if (router.pathname.startsWith("/admin")) {
    return <Component {...pageProps} />;
  }

  return (
    <div className="min-h-full">
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}