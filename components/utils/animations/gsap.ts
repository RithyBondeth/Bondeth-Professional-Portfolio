"use client";

/**
 * Central GSAP setup — the single place plugins are registered and shared
 * eases are defined. Every animation component imports gsap/plugins from
 * here instead of "gsap" directly, so registration happens exactly once
 * and new plugins become available everywhere by adding them below.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  ScrambleTextPlugin,
  Flip,
  CustomEase,
  ScrollSmoother,
);

/* ------------------------------- Custom eases ------------------------------ */
/**
 * "smooth" — a long, luxurious deceleration (fast start, feather-soft
 * landing). The house ease for entrances and reveals.
 * "snap" — quicker, punchier variant for small UI (chips, counters, hovers).
 */
if (typeof window !== "undefined") {
  if (!CustomEase.get("smooth")) CustomEase.create("smooth", "0.625, 0.05, 0, 1");
  if (!CustomEase.get("snap")) CustomEase.create("snap", "0.5, 0.05, 0.2, 1");
}

/**
 * Scramble character pool for terminal-style "decrypt" effects — matches the
 * site's code aesthetic. Pass to scrambleText: { chars: SCRAMBLE_CHARS }.
 */
export const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#01";

/**
 * One-shot read of the user's motion preference, for animations driven by hand
 * (rAF loops, canvas) rather than by GSAP. Inside a GSAP timeline prefer
 * `gsap.matchMedia()`, which also handles the preference changing mid-session.
 *
 * Returns false during SSR, so the server renders the animated variant and the
 * client decides on mount.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export {
  gsap,
  ScrollTrigger,
  ScrollToPlugin,
  SplitText,
  ScrambleTextPlugin,
  Flip,
  CustomEase,
  ScrollSmoother,
};
