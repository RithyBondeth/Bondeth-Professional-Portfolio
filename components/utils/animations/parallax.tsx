"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap";

/**
 * Drifts its children vertically as the section scrolls through the viewport,
 * creating depth. A positive `speed` makes the element lag behind the scroll
 * (moves down slower); a negative one makes it lead (floats up faster).
 *
 * Respects prefers-reduced-motion — motion is simply skipped there.
 */
export function Parallax(props: {
  children: React.ReactNode;
  className?: string;
  /** Drift distance in px across the full scroll pass. Signed. Default 80. */
  speed?: number;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { children, className, speed = 80 } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const ref = useRef<HTMLDivElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        el,
        { y: -speed / 2 },
        {
          y: speed / 2,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [speed]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
