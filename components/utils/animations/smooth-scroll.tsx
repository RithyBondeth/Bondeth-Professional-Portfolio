"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, ScrollSmoother, ScrollTrigger } from "./gsap";

/**
 * Jumps to an in-page section by id, going through ScrollSmoother's own
 * `scrollTo` when it's active. A native `scrollIntoView`/hash jump doesn't
 * account for the smoother's virtualized scroll position and lands in the
 * wrong spot, so every internal "#section" link must route through here
 * instead of a plain anchor href.
 */
export function scrollToSection(id: string, animate = true) {
  const el = document.getElementById(id);
  if (!el) return false;
  const smoother = ScrollSmoother.get();
  if (smoother) {
    smoother.scrollTo(el, animate, "top top");
  } else {
    el.scrollIntoView({ behavior: animate ? "smooth" : "auto", block: "start" });
  }
  return true;
}

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
  // / data-lag elements the new page mounted, re-measure triggers, and land
  // on whatever section the URL hash points at (e.g. arriving at /en#about
  // from a Link click on another route).
  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;
    const id = requestAnimationFrame(() => {
      smoother.effects("[data-speed], [data-lag]");
      ScrollTrigger.refresh();
      if (window.location.hash) {
        scrollToSection(window.location.hash.slice(1), false);
      }
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
        if (window.location.hash) {
          requestAnimationFrame(() =>
            scrollToSection(window.location.hash.slice(1), false),
          );
        }
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
