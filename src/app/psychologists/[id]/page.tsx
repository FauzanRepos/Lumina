import type { Metadata } from "next";
import profileCards from '@/public/content/site/psychologists.json';
import type { Psychologist } from "@/types/content";
import PsychologistProfileClient from "./PsychologistProfileClient";

const profileCardsData = profileCards as unknown as { content: any[] };

const psychologists: Psychologist[] = (profileCardsData.content ?? []).map((p: any) => ({
  id: p.id,
  name: p.name || p.fullName || "",
  fullName: p.fullName || p.name || "",
  title: p.psikolog ?? p.title ?? "",
  university: p.almamater ?? p.university ?? "",
  shortBio: p.bio ?? p.shortBio ?? "",
  bio: Array.isArray(p.bioParagraphs)
    ? p.bioParagraphs
    : p.bio
    ? Array.isArray(p.bio)
      ? p.bio
      : [p.bio]
    : [],
  specialties: p.tags ?? p.specialties ?? [],
  sessionTypes: p.sessionTypes ?? [],
  sessionFee: p.sessionFee ?? 0,
  originalFee: p.originalFee,
  sessionDuration: p.sessionDuration ?? 60,
  initials: p.initials ?? "",
  accent: (p.accent as Psychologist["accent"]) ?? "sky",
  photo: p.photo ?? undefined,
  education: p.education ?? [],
  licenses: p.licenses ?? [],
  focusAreas: p.focusAreas ?? [],
  availability: p.availability ?? {},
}));

export async function generateStaticParams() {
  return psychologists.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const psychologist = psychologists.find((p) => p.id === id);
  if (!psychologist) return { title: "Psychologist Profile" };

  return {
    title: `${psychologist.name} | Lumina Consulting`,
    description: `Profil ${psychologist.name}, ${psychologist.title} di Lumina Consulting.`,
    alternates: {
      canonical: `/psychologists/${psychologist.id}`,
    },
  };
}

export default async function PsychologistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const psychologist = psychologists.find((p) => p.id === id) ?? null;

  return <PsychologistProfileClient psychologist={psychologist} />;
}
