"use client";

import Link from "next/link";
import { Image } from "@/components/Image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

import { BrandMark } from "@/components/BrandMark";
import { buttonClasses } from "@/components/Button";
import { Container } from "@/components/layout/Container";
import siteContent from '@/lib/site';
import { cx } from "@/lib/cx";

const siteData = siteContent as unknown as { navigationItems?: any[] };
const navigationItems = siteData.navigationItems ?? [];

export function Header(): JSX.Element {
  const ref = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const activePath = pathname || "";

  useEffect(() => {
    if (!ref.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: -18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <header className="sticky top-0 z-40 pt-4 sm:pt-6" ref={ref}>
      <Container>
        <div className="rounded-[28px] border border-white/80 bg-white/90 px-4 py-4 shadow-2 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="Lumina Consulting home">
              <BrandMark compact />
            </Link>

            <nav className="hidden items-center gap-7 text-small text-neutral-700 md:flex">
              {navigationItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? activePath === "/"
                    : item.matchPrefix
                      ? activePath.startsWith(item.matchPrefix)
                      : false;

                return (
                  <Link
                    key={item.href}
                    className={cx("font-medium hover:text-primary-600", isActive && "text-primary-600")}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:block">
              <Link
                className={buttonClasses({ size: "sm" })}
                href="/psychologists"
              >
                Book Now
              </Link>
            </div>

            <button
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              className="inline-flex items-center justify-center md:hidden p-2"
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              {menuOpen ? (
                <Image alt="Close navigation" height={20} src="/icon/close.svg" width={20} />
              ) : (
                <span className="relative block h-4 w-5">
                  <span className="absolute left-0 top-0 h-0.5 w-5 bg-neutral-900" />
                  <span className="absolute left-0 top-1.5 h-0.5 w-5 bg-neutral-900" />
                  <span className="absolute left-0 top-3 h-0.5 w-5 bg-neutral-900" />
                </span>
              )}
            </button>
          </div>

          {menuOpen ? (
            <div className="mt-4 rounded-3xl border border-primary-300/60 bg-bg p-4 md:hidden">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="font-display text-lg font-semibold text-neutral-900">Navigations</p>
                <button
                  aria-label="Close navigation"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-neutral-900"
                  onClick={() => setMenuOpen(false)}
                  type="button"
                >
                  <Image alt="" height={20} src="/icon/close.svg" width={20} />
                </button>
              </div>
              <nav className="flex flex-col gap-2">
                {navigationItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? activePath === "/"
                      : item.matchPrefix
                        ? activePath.startsWith(item.matchPrefix)
                        : false;

                  const iconMap: Record<string, string> = {
                    "/": "/icon/menu-home.svg",
                    "/psychologists": "/icon/menu-psychologist.svg",
                    "/services": "/icon/menu-services.svg",
                    "/insight": "/icon/menu-insights.svg",
                  };

                  const iconSrc = iconMap[item.href] || null;

                  return (
                    <Link
                      key={item.href}
                      className={cx(
                        "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition",
                        isActive
                          ? "bg-primary-300/50 text-primary-600"
                          : "text-neutral-700 hover:bg-white"
                      )}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {iconSrc && (
                        <Image
                          alt=""
                          height={24}
                          src={iconSrc}
                          width={24}
                          className="flex-shrink-0"
                        />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <Link
                  className={cx(buttonClasses({ size: "sm", fullWidth: true }), "w-full mt-2")}
                  href="/psychologists"
                  onClick={() => setMenuOpen(false)}
                >
                  Book Now
                </Link>
              </nav>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}
