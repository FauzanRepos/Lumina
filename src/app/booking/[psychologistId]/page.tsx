import type { Metadata } from "next";
import profileCards from '@/public/content/site/psychologists.json';
import type { Psychologist } from "@/types/content";
import { Suspense } from "react";
import BookingClient from "./BookingClient";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/Card";

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
    psychologistId: p.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ psychologistId: string }> }): Promise<Metadata> {
  const { psychologistId } = await params;
  const psychologist = psychologists.find((p) => p.id === psychologistId);
  if (!psychologist) return { title: "Booking Session" };

  return {
    title: `Booking ${psychologist.name} | Lumina Consulting`,
    description: `Booking session with ${psychologist.name} at Lumina Consulting.`,
    alternates: {
      canonical: `/booking/${psychologist.id}`,
    },
  };
}

export default async function BookingDetailPage({ params }: { params: Promise<{ psychologistId: string }> }) {
  const { psychologistId } = await params;
  const psychologist = psychologists.find((p) => p.id === psychologistId) ?? null;

  return (
    <Suspense fallback={
      <main className="pb-24 pt-12">
        <Container>
          <Card className="p-8 sm:p-10">
            <h1 className="font-display text-3xl font-semibold text-neutral-900">Memuat detail booking...</h1>
          </Card>
        </Container>
      </main>
    }>
      <BookingClient psychologist={psychologist} />
    </Suspense>
  );
}
