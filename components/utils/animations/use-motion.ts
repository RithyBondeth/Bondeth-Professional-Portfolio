"use client";

/**
 * React hooks for hand-driven motion — animations built on requestAnimationFrame
 * rather than a GSAP timeline. GSAP-driven components should keep using
 * `gsap.matchMedia()` and the shared eases from ./gsap.
 */
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/* ----------------------------- Reduced motion ------------------------------ */
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

/**
 * Tracks the user's motion preference, updating if they change it mid-session.
 *
 * Reports false during SSR and on the first client render, so the markup the
 * server produced still matches at hydration; the real value lands immediately
 * afterwards.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

/* --------------------------- Animation frame value -------------------------- */
interface IFrame {
  /** Value to render on this frame. */
  value: number;
  /** True once the animation has reached its end and the loop can stop. */
  done: boolean;
}

/**
 * Runs `frame` once per animation frame while `active`, rendering the value it
 * returns, and rewinds to 0 whenever `active` flips — so the animation replays
 * from the start each time it reactivates (e.g. a section scrolling back into
 * view).
 *
 * `frame` must be stable across renders; wrap it in useCallback.
 *
 * The rewind happens during render, via React's documented "adjust state when a
 * prop changes" pattern, rather than in the effect body. Resetting from an
 * effect would paint one frame of the previous run's final value before the
 * reset landed — the animation would flash its end state, then restart.
 */
export function useAnimationFrameValue(
  active: boolean,
  frame: (elapsedMs: number) => IFrame,
): number {
  const [value, setValue] = useState(0);
  const [lastActive, setLastActive] = useState(active);

  if (lastActive !== active) {
    setLastActive(active);
    setValue(0);
  }

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const next = frame(now - start);
      setValue(next.value);
      if (!next.done) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, frame]);

  return active ? value : 0;
}

/**
 * Eased 0 → `target` count-up, restarting whenever `active` flips back on.
 * Uses the same cubic ease-out as the site's "snap" GSAP ease.
 */
export function useCountUp(
  target: number,
  duration: number,
  active: boolean,
): number {
  const frame = useCallback(
    (elapsedMs: number) => {
      const p = Math.min(elapsedMs / duration, 1);
      return { value: Math.round((1 - Math.pow(1 - p, 3)) * target), done: p >= 1 };
    },
    [target, duration],
  );

  return useAnimationFrameValue(active, frame);
}
