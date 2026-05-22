import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

import { BrandMark } from "@/components/BrandMark";
import { buttonClasses } from "@/components/Button";
import { Container } from "@/components/layout/Container";
import { navigationItems } from "@/data/site";
import { cx } from "@/lib/cx";

export function Header(): JSX.Element {
  const router = useRouter();
  const ref = useRef<HTMLElement | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const activePath = useMemo(() => router.asPath.split("?")[0], [router.asPath]);

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
                Buat Janji
              </Link>
            </div>

            <button
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white md:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              <span className="relative block h-4 w-5">
                <span className={cx("absolute left-0 top-0 h-0.5 w-5 bg-neutral-900 transition", menuOpen && "top-1.5 rotate-45")} />
                <span className={cx("absolute left-0 top-1.5 h-0.5 w-5 bg-neutral-900 transition", menuOpen && "opacity-0")} />
                <span className={cx("absolute left-0 top-3 h-0.5 w-5 bg-neutral-900 transition", menuOpen && "top-1.5 -rotate-45")} />
              </span>
            </button>
          </div>

          {menuOpen ? (
            <div className="mt-4 rounded-3xl border border-primary-300/60 bg-bg p-4 md:hidden">
              <nav className="flex flex-col gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    className="rounded-2xl px-4 py-3 text-small font-medium text-neutral-700 hover:bg-white"
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  className={cx(buttonClasses({ size: "sm", fullWidth: true }), "w-full")}
                  href="/psychologists"
                >
                  Buat Janji
                </Link>
              </nav>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}