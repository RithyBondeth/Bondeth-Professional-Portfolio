"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/components/utils/animations/gsap";

/** Anything matching this grows the cursor ring into a "target" state. */
const INTERACTIVE =
  'a, button, [role="button"], input, textarea, select, summary, [data-cursor]';

/**
 * Custom cursor: a solid primary dot that sticks to the pointer plus a
 * trailing ring that lags behind and expands over interactive elements
 * (with an optional label via data-cursor-label). Desktop pointers only;
 * reduced-motion users and touch devices never see it (native cursor is
 * hidden via the `has-custom-cursor` class only while active).
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

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
        setEnabled(true);
        return () => setEnabled(false);
      },
    );
    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest?.(INTERACTIVE);
      if (target) {
        const text =
          (target as HTMLElement).dataset?.cursorLabel ?? "";
        if (label) label.textContent = text;
        gsap.to(ring, {
          scale: text ? 2.6 : 1.8,
          backgroundColor: "color-mix(in oklab, var(--primary) 12%, transparent)",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(dot, { scale: 0.5, duration: 0.3 });
      } else {
        if (label) label.textContent = "";
        gsap.to(ring, {
          scale: 1,
          backgroundColor: "transparent",
          duration: 0.3,
          ease: "power3.out",
        });
        gsap.to(dot, { scale: 1, duration: 0.3 });
      }
    };
    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };
    const onDown = () => gsap.to(ring, { scale: 0.85, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.25, ease: "back.out(2)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeaveWindow);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[200]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 -ml-4 -mt-4 size-8 rounded-full border border-primary/50 opacity-0"
      >
        <span
          ref={labelRef}
          className="absolute inset-0 flex items-center justify-center font-code text-[7px] font-semibold uppercase tracking-widest text-primary"
        />
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 -ml-[3px] -mt-[3px] size-1.5 rounded-full bg-primary opacity-0"
      />
    </div>
  );
}
