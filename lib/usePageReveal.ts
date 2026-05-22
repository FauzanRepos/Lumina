import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface UsePageRevealOptions {
  selector?: string;
  distance?: number;
  duration?: number;
  threshold?: number;
}

export function usePageReveal<T extends HTMLElement>(
  rerunKey?: string | number | boolean | null,
  { selector = "[data-reveal]", distance = 28, duration = 0.48, threshold = 0.18 }: UsePageRevealOptions = {}
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));

    if (!elements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;

          gsap.fromTo(
            element,
            {
              opacity: 0,
              y: distance,
            },
            {
              opacity: 1,
              y: 0,
              duration: Number(element.dataset.revealDuration ?? duration),
              delay: Number(element.dataset.revealDelay ?? 0),
              ease: element.dataset.revealEase || "power3.out",
              clearProps: "opacity,transform",
            }
          );

          observer.unobserve(element);
        });
      },
      { threshold }
    );

    elements.forEach((element) => {
      gsap.set(element, { opacity: 0, y: distance });
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      gsap.killTweensOf(elements);
      gsap.set(elements, { clearProps: "opacity,transform" });
    };
  }, [distance, duration, rerunKey, selector, threshold]);

  return ref;
}