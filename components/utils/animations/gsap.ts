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
