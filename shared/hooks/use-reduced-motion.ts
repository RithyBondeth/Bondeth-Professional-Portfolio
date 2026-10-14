"use client";

/**
 * React hooks for hand-driven motion — animations built on requestAnimationFrame
 * rather than a GSAP timeline. Every client animation uses this preference
 * hook so device preference changes share the same lifecycle.
 */
import {
  isMotionReduced,
  subscribeToMotionPreference,
} from "@/shared/lib/motion-preference";
import { useSyncExternalStore } from "react";

/**
 * Tracks the device reduced-motion preference, including live changes.
 *
 * Reports false during SSR and on the first client render, so the markup the
 * server produced still matches at hydration; the real value lands immediately
 * afterwards.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    isMotionReduced,
    () => false,
  );
}
