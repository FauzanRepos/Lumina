import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Services | Lumina Consulting",
  description: "Eksplorasi layanan konsultasi, asesmen, dan kolaborasi Lumina Consulting.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
