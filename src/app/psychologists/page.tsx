import type { Metadata } from "next";
import PsychologistsClient from "./PsychologistsClient";

export const metadata: Metadata = {
  title: "Psychologists | Lumina Consulting",
  description: "Cari psikolog Lumina berdasarkan kebutuhan, tipe sesi, dan jam praktik yang paling sesuai untukmu.",
  alternates: {
    canonical: "/psychologists",
  },
};

export default function PsychologistsPage() {
  return <PsychologistsClient />;
}
