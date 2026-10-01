"use client";

import { MOTION } from "@/lib/motion-timing";
import { useReducedMotion } from "@/components/utils/animations/use-motion";

import { useEffect, useRef } from "react";
import { gsap } from "@/components/utils/animations/gsap-scroll";

/**
 * Scroll-enter motion for the static lab-card vignettes. Wrap a vignette
 * panel and tag the elements inside it:
 * - `data-lab-bar`  → retrieval score bars grow scaleX 0→1 from the left, staggered
 * - `data-lab-tile` → A/B result tiles pop in on the "snap" ease, staggered
 * Plays once per visit; static (server-rendered state) under reduced motion.
 */
export function LabVignetteFx(props: {
  children: React.ReactNode;
  className?: string;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { children, className } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;

    const bars = el.querySelectorAll<HTMLElement>("[data-lab-bar]");
    const tiles = el.querySelectorAll<HTMLElement>("[data-lab-tile]");
    if (!bars.length && !tiles.length) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tweens: gsap.core.Tween[] = [];
      if (bars.length) {
        tweens.push(
          gsap.fromTo(
            bars,
            { scaleX: 0, transformOrigin: "0% 50%" },
            {
              scaleX: 1,
              duration: MOTION.entrance / 1000,
              ease: "smooth",
              stagger: MOTION.stagger / 1000,
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            },
          ),
        );
      }
      if (tiles.length) {
        tweens.push(
          gsap.fromTo(
            tiles,
            { opacity: 0, scale: 0.96 },
            {
              opacity: 1,
              scale: 1,
              duration: MOTION.entrance / 1000,
              ease: "snap",
              stagger: MOTION.stagger / 1000,
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            },
          ),
        );
      }
      return () => {
        tweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });
      };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Never strand content hidden — rest at the server-rendered state.
      gsap.set(bars, { scaleX: 1 });
      gsap.set(tiles, { opacity: 1, scale: 1 });
    });

    return () => mm.revert();
  }, [reduceMotion]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
