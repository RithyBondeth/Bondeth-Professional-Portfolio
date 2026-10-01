"use client";

/**
 * Lightweight shared GSAP setup. Route-specific plugins deliberately live in
 * their own modules so importing a small animation does not ship the complete
 * GSAP plugin suite on every page.
 */
import { isMotionReduced } from "@/lib/motion-preference";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

/* ------------------------------- Custom eases ------------------------------ */
/**
 * "smooth" — a long, luxurious deceleration (fast start, feather-soft
 * landing). The house ease for entrances and reveals.
 * "snap" — quicker, punchier variant for small UI (chips, counters, hovers).
 */
if (typeof window !== "undefined") {
  if (!CustomEase.get("smooth")) CustomEase.create("smooth", "0.22, 1, 0.36, 1");
  if (!CustomEase.get("snap")) CustomEase.create("snap", "0.33, 1, 0.68, 1");
}

/**
 * Scramble character pool for terminal-style "decrypt" effects — matches the
 * site's code aesthetic. Pass to scrambleText: { chars: SCRAMBLE_CHARS }.
 */
export const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#01";

/**
 * One-shot read of the user's motion preference, for animations driven by hand
 * (rAF loops, canvas) rather than by GSAP. Use useReducedMotion() in client
 * animation effects so a live change also cancels existing work.
 *
 * Returns false during SSR, so the server renders the animated variant and the
 * client decides on mount.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return isMotionReduced();
}

export { gsap, CustomEase };
