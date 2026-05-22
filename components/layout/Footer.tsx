import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { Container } from "@/components/layout/Container";
import { footerContacts, navigationItems, socialLinks } from "@/data/site";

const socialIconByLabel: Record<string, string> = {
  LinkedIn: "in",
  Instagram: "ig",
  TikTok: "tt",
};

export function Footer(): JSX.Element {
  return (
    <footer className="mt-24 bg-primary-300/30 py-14 sm:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <BrandMark />
            <p className="max-w-xs text-small leading-6 text-neutral-600">
              Akses layanan psikologi berkualitas yang relevan dengan perkembangan zaman, dirancang untuk terasa aman dan dekat.
            </p>
          </div>

          <div>
            <h2 className="mb-4 font-display text-lg font-semibold">Navigasi</h2>
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary-300 bg-white text-[11px] font-semibold uppercase text-primary-600 shadow-sm transition hover:-translate-y-0.5"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {socialIconByLabel[item.label]}
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