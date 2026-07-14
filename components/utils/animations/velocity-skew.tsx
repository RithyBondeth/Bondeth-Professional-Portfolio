"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Skews its content in proportion to scroll velocity — fast scrolling makes
 * marquee rows lean into the motion like they have inertia, then they ease
 * back upright as the scroll settles. Purely decorative; disabled under
 * reduced motion.
 */
export function VelocitySkew(props: {
  children: React.ReactNode;
  className?: string;
  /** Max lean in degrees. */
  maxSkew?: number;
}) {
  const { children, className, maxSkew = 5 } = props;
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const skewTo = gsap.quickTo(inner, "skewX", {
        duration: 0.5,
        ease: "power3.out",
      });
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          skewTo(gsap.utils.clamp(-maxSkew, maxSkew, self.getVelocity() / -280));
        },
      });
      const settle = () => skewTo(0);
      ScrollTrigger.addEventListener("scrollEnd", settle);
      return () => {
        ScrollTrigger.removeEventListener("scrollEnd", settle);
        st.kill();
        gsap.set(inner, { skewX: 0 });
      };
    });

    return () => mm.revert();
  }, [maxSkew]);

  return (
    <div ref={ref} className={className}>
      <div ref={innerRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
