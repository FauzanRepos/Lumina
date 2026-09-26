import Link from "next/link";
import { Image } from "@/components/Image";

import { BrandMark } from "@/components/BrandMark";
import { Container } from "@/components/layout/Container";
import siteContent from '@/lib/site';

const siteData = siteContent as unknown as { footerContacts?: any[]; navigationItems?: any[]; socialLinks?: any[] };
const footerContacts = siteData.footerContacts ?? [];
const navigationItems = siteData.navigationItems ?? [];
const socialLinks = siteData.socialLinks ?? [];

const socialIconSrc: Record<string, string> = {
  LinkedIn: "/icon/LinkedIn.svg",
  Instagram: "/icon/instagram.svg",
  TikTok: "/icon/tiktok.svg",
};

export function Footer(): JSX.Element {
  return (
    <footer className="mt-24 bg-primary-300/30 py-14 sm:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <BrandMark />
            <p className="max-w-xs text-small leading-6 text-neutral-600">
              Let&apos;s Start Today For A Better Future
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg font-semibold">Navigations</h2>
            <ul className="space-y-3 text-small text-neutral-700">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link className="transition hover:text-primary-600" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg font-semibold">Hubungi Kami</h2>
            <ul className="space-y-3 text-small text-neutral-700">
              {footerContacts.map((contact) => (
                <li key={contact.href}>
                  <a
                    className="transition hover:text-primary-600"
                    href={contact.href}
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    {contact.value}
                    {contact.label === "Email" ? "" : ` | ${contact.label}`}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg font-semibold">Media Sosial</h2>
            <div className="flex gap-3">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  aria-label={item.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-300 bg-white shadow-sm transition hover:-translate-y-0.5"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {socialIconSrc[item.label] ? (
                    <Image alt={item.label} className="h-5 w-5" width={20} height={20} src={socialIconSrc[item.label]} />
                  ) : (
                    <span className="text-[11px] font-semibold uppercase text-primary-600">{item.label.slice(0, 2)}</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-primary-300/60 pt-6 text-center text-small text-neutral-500">
          © 2026 Lumina Consulting | PT Cipta Cita Indonesia.
        </p>
      </Container>
    </footer>
  );
}
