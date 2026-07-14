"use client";

import { useEffect, useRef } from "react";
import { gsap, SCRAMBLE_CHARS } from "./gsap";

interface IScrambleTextProps {
  /** Final text. Rendered server-side as-is so SEO/no-JS users see it. */
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  /** Seconds the decrypt takes. */
  duration?: number;
  delay?: number;
  /** Characters used while scrambling. Defaults to the terminal pool. */
  chars?: string;
  /** ScrollTrigger start position. Default "top 90%". */
  start?: string;
  /** Replay the decrypt every time the element re-enters the viewport. */
  replay?: boolean;
}

/**
 * Terminal "decrypt" effect: text resolves out of a scramble of glyphs when
 * it scrolls into view. Made for the mono eyebrow labels ("// about.tsx",
 * "$ contact --init") — pure text swaps, so layout never shifts more than
 * the final string's width. Static under reduced motion.
 */
export function ScrambleText(props: IScrambleTextProps) {
  /* ---------------------------------- Props --------------------------------- */
  const {
    text,
    className,
    as: Tag = "span",
    duration = 1,
    delay = 0,
    chars = SCRAMBLE_CHARS,
    start = "top 90%",
    replay = false,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const ref = useRef<HTMLElement | null>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.to(el, {
        duration,
        delay,
        scrambleText: {
          text,
          chars,
          speed: 0.4,
          revealDelay: delay > 0 ? 0 : 0.1,
        },
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: replay ? "restart none none none" : "play none none none",
          once: !replay,
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        // Never strand a half-scrambled label.
        el.textContent = text;
      };
    });

    return () => mm.revert();
  }, [text, duration, delay, chars, start, replay]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {text}
    </Tag>
  );
}
