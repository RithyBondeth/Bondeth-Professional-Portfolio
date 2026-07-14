"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollSmoother, ScrollTrigger } from "./gsap";

/**
 * Site-wide inertial scrolling via GSAP ScrollSmoother. Wraps everything
 * that scrolls (page content + footer); the fixed navbar and portaled
 * command palette stay outside and are unaffected.
 *
 * Enabled only for mouse/trackpad pointers with no reduced-motion
 * preference — on touch devices and for reduced-motion users the wrapper
 * divs are inert and scrolling stays native. `effects: true` activates
 * data-speed / data-lag parallax attributes anywhere inside the content.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Route changes swap the content under the smoother: pick up any data-speed
  // / data-lag elements the new page mounted, and re-measure triggers.
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;
    const id = requestAnimationFrame(() => {
      smoother.effects("[data-speed], [data-lag]");
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      {
        fine: "(pointer: fine)",
        motionOK: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { fine, motionOK } = ctx.conditions as {
          fine: boolean;
          motionOK: boolean;
        };
        if (!fine || !motionOK) return;
        if (!wrapperRef.current || !contentRef.current) return;

        const smoother = ScrollSmoother.create({
          wrapper: wrapperRef.current,
          content: contentRef.current,
          // Catch-up lag in seconds. Keep this LOW — anything near 1 makes
          // the page feel heavy and underwater; 0.15 keeps just a whisper of
          // inertia while tracking the wheel almost 1:1.
          smooth: 0.15,
          effects: true,
          ignoreMobileResize: true,
        });
        return () => smoother.kill();
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={wrapperRef} id="smooth-wrapper" className="flex-1">
      <div ref={contentRef} id="smooth-content" className="min-h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
