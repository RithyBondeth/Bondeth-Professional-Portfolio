"use client";

import { useReducedMotion } from "@/components/utils/animations/use-motion";

import { useEffect, type RefObject } from "react";

/**
 * Points the mascot's eyes at the cursor by writing `--gaze-x` / `--gaze-y`
 * (grid units) onto `ref`. Pointer events are coalesced to one write per
 * animation frame and never touch React state, so tracking costs no renders.
 *
 * Skipped on touch-first devices (there is no cursor to follow) and under
 * reduced motion.
 */
export function useMascotGaze(
  ref: RefObject<Element | null>,
  { range = 1.4, enabled = true }: { range?: number; enabled?: boolean } = {},
) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const el = ref.current as HTMLElement | SVGElement | null;
    if (!enabled || !el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (reduceMotion) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const apply = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      // Aim from the eye line, roughly 40% down the sprite.
      const dx = pointerX - (rect.left + rect.width / 2);
      const dy = pointerY - (rect.top + rect.height * 0.4);
      const distance = Math.hypot(dx, dy) || 1;
      // Ease in over the first ~240px so a cursor resting on the robot
      // doesn't make him go cross-eyed.
      const reach = Math.min(1, distance / 240) * range;
      el.style.setProperty("--gaze-x", ((dx / distance) * reach).toFixed(2));
      el.style.setProperty("--gaze-y", ((dy / distance) * reach * 0.8).toFixed(2));
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onPointerLeave = () => {
      el.style.setProperty("--gaze-x", "0");
      el.style.setProperty("--gaze-y", "0");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      if (frame) cancelAnimationFrame(frame);
      onPointerLeave();
    };
  }, [ref, range, enabled, reduceMotion]);
}
