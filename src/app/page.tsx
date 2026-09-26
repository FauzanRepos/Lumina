import type { Metadata } from "next";
import { getAllInsightArticles } from "@/lib/insights";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Lumina Consulting",
  description: "Lumina Consulting membantu Anda menemukan psikolog, layanan, dan alur booking yang terasa jelas dan tenang.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  const articles = await getAllInsightArticles();
  return <HomeClient insightArticles={articles} />;
}
