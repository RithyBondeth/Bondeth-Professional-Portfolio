"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Fades a single wrapper in with a slight upward motion once it scrolls
 * into view — use this for headings and standalone blocks.
 */
export function AnimateIn(props: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { children, className, delay = 0, y = 40, duration = 0.8 } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const ref = useRef<HTMLDivElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [delay, y, duration]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Staggers the direct children of the wrapper in one by one once the
 * wrapper scrolls into view — use this for lists, grids, and card decks.
 */
export function StaggerIn(props: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  y?: number;
  duration?: number;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const {
    children,
    className,
    stagger = 0.12,
    delay = 0,
    y = 40,
    duration = 0.7,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const ref = useRef<HTMLDivElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(el.children),
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          stagger,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [stagger, delay, y, duration]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
