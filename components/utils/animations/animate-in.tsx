"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap";

/* ------------------------------- Reveal types ------------------------------ */
/**
 * The direction / character a reveal travels in before it settles.
 * - up / down / left / right → slides in from that edge
 * - zoom-in  → grows from small to full size (starts scaled down)
 * - zoom-out → shrinks from large to full size (starts scaled up)
 * - none     → pure fade / blur, no movement
 */
export type TRevealFrom =
  | "up"
  | "down"
  | "left"
  | "right"
  | "zoom-in"
  | "zoom-out"
  | "none";

interface IRevealTuning {
  /** How far (px) the element slides for up/down/left/right. */
  distance?: number;
  /** Extra scale on top of the direction (1 = none). */
  scale?: number;
  /** Degrees of rotation to unwind while entering. */
  rotate?: number;
  /** Blur (px) that sharpens to 0 while entering — adds a cinematic focus-pull. */
  blur?: number;
}

/**
 * Builds the "from" (start) vars for a reveal given a direction. The tween
 * animates every one of these back to its resting value (0 / 1).
 */
function buildFromVars(from: TRevealFrom, tune: Required<IRevealTuning>) {
  const { distance, scale, rotate, blur } = tune;
  const base: gsap.TweenVars = {
    opacity: 0,
    ...(rotate ? { rotate } : {}),
    ...(blur ? { filter: `blur(${blur}px)` } : {}),
  };

  switch (from) {
    case "up":
      return { ...base, y: distance, scale };
    case "down":
      return { ...base, y: -distance, scale };
    case "left":
      return { ...base, x: -distance, scale };
    case "right":
      return { ...base, x: distance, scale };
    case "zoom-in":
      return { ...base, scale: scale * 0.82 };
    case "zoom-out":
      return { ...base, scale: scale * 1.18 };
    case "none":
    default:
      return { ...base, scale };
  }
}

/** The resting vars every reveal lands on. */
const TO_VARS: gsap.TweenVars = {
  opacity: 1,
  x: 0,
  y: 0,
  scale: 1,
  rotate: 0,
  filter: "blur(0px)",
};

/* ------------------------------- Shared props ------------------------------ */
interface IRevealCommon extends IRevealTuning {
  children: React.ReactNode;
  className?: string;
  /** Direction / character of the entrance. Default "up". */
  from?: TRevealFrom;
  delay?: number;
  duration?: number;
  ease?: string;
  /**
   * When true the animation is tied to scroll position (scrubbed) so the
   * element progresses as you scroll instead of firing once. Great for hero
   * pieces you want to feel physically connected to the wheel.
   */
  scrub?: boolean;
  /** ScrollTrigger start position. Default "top 88%". */
  start?: string;
  /**
   * By default a reveal replays every time the element enters the viewport —
   * it reverses when you scroll back up past it and plays again on the way
   * down. Set `once` to freeze it after the first play. Ignored when `scrub`
   * is on (scrubbed tweens always track scroll in both directions).
   */
  once?: boolean;
  /**
   * Back-compat shim for the old API: `y` maps onto `distance` when `from`
   * isn't given explicitly, preserving existing call sites.
   */
  y?: number;
}

/* -------------------------------- AnimateIn -------------------------------- */
/**
 * Reveals a single wrapper as it scrolls into view. Now supports any
 * direction, zoom, rotation and blur — pass `from` to pick the character.
 */
export function AnimateIn(props: IRevealCommon) {
  /* ---------------------------------- Props --------------------------------- */
  const {
    children,
    className,
    from = "up",
    delay = 0,
    duration = 0.7,
    // House ease from ./gsap — long deceleration, feather-soft landing.
    ease = "smooth",
    scrub = false,
    start = "top 88%",
    once = false,
    distance,
    scale = 1,
    rotate = 0,
    blur = 0,
    y,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const ref = useRef<HTMLDivElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tune: Required<IRevealTuning> = {
      distance: distance ?? y ?? 40,
      scale,
      rotate,
      blur,
    };

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(el, buildFromVars(from, tune), {
        ...TO_VARS,
        duration,
        delay: scrub ? 0 : delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          end: scrub ? "top 45%" : undefined,
          scrub: scrub ? 1 : false,
          once: scrub ? false : once,
          // Replay on every entry (and reverse on the way back up) unless the
          // caller opted into a one-shot reveal.
          toggleActions:
            scrub || once ? undefined : "play none none reverse",
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(el, TO_VARS);
    });

    return () => mm.revert();
  }, [
    from,
    delay,
    duration,
    ease,
    scrub,
    start,
    once,
    distance,
    scale,
    rotate,
    blur,
    y,
  ]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* -------------------------------- StaggerIn -------------------------------- */
/**
 * Staggers the direct children of the wrapper in one by one as it enters
 * view. Supports every direction / zoom that AnimateIn does, so grids and
 * card decks can fly in from the side or scale up in sequence.
 */
export function StaggerIn(
  props: IRevealCommon & {
    stagger?: number;
    /** Order children animate in — "start" (default), "end", "center", "random". */
    staggerFrom?: "start" | "end" | "center" | "edges" | "random";
  },
) {
  /* ---------------------------------- Props --------------------------------- */
  const {
    children,
    className,
    from = "up",
    stagger = 0.08,
    staggerFrom = "start",
    delay = 0,
    duration = 0.6,
    // House ease from ./gsap — long deceleration, feather-soft landing.
    ease = "smooth",
    scrub = false,
    start = "top 85%",
    once = false,
    distance,
    scale = 1,
    rotate = 0,
    blur = 0,
    y,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const ref = useRef<HTMLDivElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tune: Required<IRevealTuning> = {
      distance: distance ?? y ?? 40,
      scale,
      rotate,
      blur,
    };
    const targets = Array.from(el.children);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tween = gsap.fromTo(targets, buildFromVars(from, tune), {
        ...TO_VARS,
        duration,
        delay: scrub ? 0 : delay,
        ease,
        stagger: { each: stagger, from: staggerFrom },
        scrollTrigger: {
          trigger: el,
          start,
          end: scrub ? "top 40%" : undefined,
          scrub: scrub ? 1 : false,
          once: scrub ? false : once,
          // Replay on every entry (and reverse on the way back up) unless the
          // caller opted into a one-shot reveal.
          toggleActions:
            scrub || once ? undefined : "play none none reverse",
        },
      });
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(targets, TO_VARS);
    });

    return () => mm.revert();
  }, [
    from,
    stagger,
    staggerFrom,
    delay,
    duration,
    ease,
    scrub,
    start,
    once,
    distance,
    scale,
    rotate,
    blur,
    y,
  ]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
