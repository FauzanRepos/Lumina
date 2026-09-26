"use client";

import { Image } from "@/components/Image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { buttonClasses } from "@/components/Button";
import { cx } from "@/lib/cx";
import heroContent from "@/public/content/site/hero.json";

type HeroWord = {
  id: string;
  text: string;
  color: string;
  delay: number;
  duration: number;
};

export function Hero(): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const rotatingTextRef = useRef<HTMLSpanElement | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const words = useMemo<HeroWord[]>(() => {
    if (!Array.isArray(heroContent.content) || heroContent.content.length === 0) {
      return [
        {
          id: "fallback",
          text: "for you",
          color: "#60A5FA",
          delay: 0,
          duration: 280,
        },
      ];
    }

    return heroContent.content as HeroWord[];
  }, []);

  const activeWord = words[activeWordIndex] ?? words[0];
  const maxWordLength = useMemo(() => Math.max(...words.map((item) => item.text.length)), [words]);

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

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || words.length < 2) {
      return undefined;
    }

    let timerId = 0;
    const currentRotatingElement = rotatingTextRef.current;

    const getDisplayTime = (index: number): number => {
      const currentWord = words[index] ?? words[0];
      return Math.max(1800, currentWord.delay + currentWord.duration + 1500);
    };

    const scheduleNext = (index: number): void => {
      timerId = window.setTimeout(() => {
        const element = rotatingTextRef.current;

        if (!element) {
          const nextIndex = (index + 1) % words.length;
          setActiveWordIndex(nextIndex);
          scheduleNext(nextIndex);
          return;
        }

        gsap.to(element, {
          opacity: 0,
          y: -14,
          duration: 0.24,
          ease: "power2.in",
          onComplete: () => {
            const nextIndex = (index + 1) % words.length;
            setActiveWordIndex(nextIndex);

            requestAnimationFrame(() => {
              if (!rotatingTextRef.current) {
                return;
              }

              gsap.fromTo(
                rotatingTextRef.current,
                { opacity: 0, y: 14 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.3,
                  ease: "power2.out",
                },
              );
            });

            scheduleNext(nextIndex);
          },
        });
      }, getDisplayTime(index));
    };

    scheduleNext(0);

    return () => {
      window.clearTimeout(timerId);
      if (currentRotatingElement) {
        gsap.killTweensOf(currentRotatingElement);
      }
    };
  }, [words]);

  return (
    <section className="relative overflow-hidden pb-12 pt-8 sm:pb-16 sm:pt-12 lg:pb-20" id="top" ref={ref}>
      <div className="absolute inset-0 -z-10 bg-hero-glow bg-no-repeat opacity-90 filter blur-2xl" aria-hidden />

      <div className="grid items-center gap-4 md:grid-cols-2 md:gap-6 lg:gap-8">
        <div data-hero-copy className="order-2 mx-auto max-w-xl space-y-6 text-center md:order-1 md:mx-0 md:text-left">
          <div className="space-y-4">
            <h1 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-[1.04] text-neutral-900 sm:text-4xl lg:text-5xl xl:text-[64px] md:mx-0">
              Lumina is here{" "}
              <span className="inline-flex align-baseline" style={{ color: activeWord.color, minWidth: `${maxWordLength + 0.5}ch` }}>
                <span className="inline-block" ref={rotatingTextRef}>{activeWord.text}</span>
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-body text-neutral-700 sm:text-lg md:mx-0">
              Akses layanan psikologi berkualitas &amp; relevan dengan perkembangan zaman untuk meraih potensi diri yang terbaik.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
            <Link
              className={cx(buttonClasses({ size: "md" }), "w-full sm:w-auto")}
              href="/psychologists"
            >
              Book Now
            </Link>
            <Link
              className="inline-flex min-h-[52px] w-full items-center justify-center whitespace-nowrap rounded-full border border-neutral-300 bg-white px-7 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 sm:w-auto sm:text-base"
              href="/services"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2 relative mx-auto w-full max-w-[740px]" data-hero-visual>
          <div className="absolute -left-4 top-16 h-24 w-24 rounded-full bg-white/70 blur-2xl" data-hero-float />
          <div className="absolute -right-5 bottom-12 h-32 w-32 rounded-full bg-primary-300/70 blur-3xl" data-hero-float />
          <div className="relative overflow-hidden">
            <Image
              alt="Lumina Consulting psychologists collage"
              className="h-auto w-full rounded-[30px]"
              height={787}
              priority
              src="/content/upload/hero-psychologist-collage.webp"
              width={752}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
