"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "./gsap";

type TSplitGranularity = "lines" | "words" | "chars";

interface ISplitRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Tag to render — headings should pass their real level for semantics. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
  /**
   * What slides up inside the line masks. "lines" is the safest for localized
   * (Khmer) copy — it never cuts inside a grapheme cluster or unspaced word.
   */
  type?: TSplitGranularity;
  delay?: number;
  duration?: number;
  /** Seconds between each line/word/char. */
  stagger?: number;
  ease?: string;
  /** ScrollTrigger start position. Default "top 88%". */
  start?: string;
  /** Freeze after the first play instead of replaying on every entry. */
  once?: boolean;
  /** Tie progress to scroll instead of playing on enter. */
  scrub?: boolean;
}

/**
 * Masked text reveal: splits the rendered text with SplitText and slides each
 * line/word/char up from behind an overflow mask — the signature "premium"
 * heading entrance. Falls back to static text under reduced motion, and
 * re-splits automatically on resize/font-load (autoSplit).
 */
export function SplitReveal(props: ISplitRevealProps) {
  /* ---------------------------------- Props --------------------------------- */
  const {
    children,
    className,
    as: Tag = "div",
    type = "lines",
    delay = 0,
    duration = 1.1,
    stagger = 0.08,
    ease = "smooth",
    start = "top 88%",
    once = false,
    scrub = false,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const ref = useRef<HTMLElement | null>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const split = SplitText.create(el, {
        // Always split lines so the masks exist; add finer pieces on demand.
        type: type === "lines" ? "lines" : `lines,${type}`,
        mask: "lines",
        autoSplit: true,
        onSplit(self) {
          const targets =
            type === "chars"
              ? self.chars
              : type === "words"
                ? self.words
                : self.lines;
          return gsap.from(targets, {
            yPercent: 115,
            duration,
            delay: scrub ? 0 : delay,
            ease,
            stagger,
            scrollTrigger: {
              trigger: el,
              start,
              end: scrub ? "top 45%" : undefined,
              scrub: scrub ? 1 : false,
              once: scrub ? false : once,
              toggleActions:
                scrub || once ? undefined : "play none none reverse",
            },
          });
        },
      });
      return () => split.revert();
    });
    // Reduced motion: leave the server-rendered text untouched.

    return () => mm.revert();
  }, [type, delay, duration, stagger, ease, start, once, scrub]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
