"use client";

import { useEffect, useRef } from "react";
import { SplitText } from "gsap/SplitText";
import { gsap } from "./gsap-scroll";

gsap.registerPlugin(SplitText);

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
    duration = 0.8,
    stagger = 0.06,
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

    // A restored deep-link must stay readable immediately. Splitting/hiding a
    // heading that is already on screen is the refresh flash users perceived.
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.98) return;

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
              ...(scrub
                ? { end: "top 45%", scrub: 1 }
                : {
                    once,
                    ...(!once && {
                      toggleActions: "play none none reverse",
                    }),
                  }),
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
