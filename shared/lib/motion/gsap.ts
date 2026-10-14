"use client";

/**
 * Lightweight shared GSAP setup. Route-specific plugins deliberately live in
 * their own modules so importing a small animation does not ship the complete
 * GSAP plugin suite on every page.
 */
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

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

export { gsap };
