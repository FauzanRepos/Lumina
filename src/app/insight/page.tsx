import type { Metadata } from "next";
import { getAllInsightArticles } from "@/lib/insights";
import InsightIndexClient from "./InsightIndexClient";

export const metadata: Metadata = {
  title: "Insight | Lumina Consulting",
  description: "Lumina Insight menghadirkan artikel dan refleksi singkat seputar kesehatan mental dengan nada yang hangat, jernih, dan mudah dibawa ke keseharian.",
  alternates: {
    canonical: "/insight",
  },
};

export default async function InsightPage() {
  const articles = await getAllInsightArticles();
  return <InsightIndexClient insightArticles={articles} />;
}
