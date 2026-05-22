import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function Hero(): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-copy] > *", {
        opacity: 0,
        y: 24,
        duration: 0.45,
        ease: "power3.out",
        stagger: 0.08,
      });

      gsap.from("[data-hero-visual]", {
        opacity: 0,
        x: 32,
        scale: 0.96,
        duration: 0.65,
        ease: "power3.out",
      });

      gsap.to("[data-hero-float]", {
        y: -12,
        duration: 3.2,
        ease: "sine.inOut",
        stagger: 0.16,
        repeat: -1,
        yoyo: true,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative overflow-hidden pb-12 pt-8 sm:pb-16 sm:pt-12 lg:pb-20" id="top" ref={ref}>
      <div className="absolute inset-0 -z-10 bg-hero-glow bg-no-repeat opacity-90 filter blur-2xl" aria-hidden />

      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-14">
        <div data-hero-copy className="max-w-xl space-y-6">
          <span className="inline-flex rounded-full border border-white/90 bg-white/90 px-4 py-2 text-small font-semibold uppercase tracking-[0.18em] text-primary-600 shadow-1">
            Dukungan Psikologi Online
          </span>
          <div className="space-y-4">
            <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[0.98] text-neutral-900 sm:text-[66px] lg:text-[76px]">
              Temukan Ruang Aman <span className="text-primary-600">untuk Tumbuh</span>
            </h1>
            <p className="max-w-xl text-body text-neutral-700 sm:text-lg">
              Akses layanan psikologi berkualitas &amp; relevan dengan perkembangan zaman untuk meraih potensi diri yang terbaik.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-neutral-900 px-7 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:text-base"
              href="/psychologists"
            >
              Mulai Sekarang
            </Link>
            <Link
              className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-neutral-300 bg-white px-7 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 sm:text-base"
              href="#healing-starts"
            >
              Pelajari Lebih
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[740px]" data-hero-visual>
          <div className="absolute -left-4 top-16 h-24 w-24 rounded-full bg-white/70 blur-2xl" data-hero-float />
          <div className="absolute -right-5 bottom-12 h-32 w-32 rounded-full bg-primary-300/70 blur-3xl" data-hero-float />
          <div className="relative overflow-hidden">
            <Image
              alt="Lumina Consulting psychologists collage"
              className="h-auto w-full rounded-[30px]"
              height={787}
              priority
              src="/homepage/hero-psychologist-collage.png"
              width={752}
            />
          </div>
        </div>
      </div>
    </section>
  );
}