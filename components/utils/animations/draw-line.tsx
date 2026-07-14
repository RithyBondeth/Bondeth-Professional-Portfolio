"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap";

/**
 * A line that draws itself as its surrounding container scrolls through the
 * viewport (scaleY from the top, scrubbed) — made for timelines and section
 * rules. Style the line entirely via className (width/color/position); this
 * component only owns the scale. Fully drawn under reduced motion.
 */
export function DrawLine(props: { className?: string }) {
  const { className } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            // The parent block is the journey — the line completes as the
            // reader reaches its end.
            trigger: el.parentElement ?? el,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 1,
          },
        },
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(el, { scaleY: 1 });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} aria-hidden className={className} style={{ transformOrigin: "top" }} />
  );
}
