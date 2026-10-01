"use client";

import { useEffect } from "react";

const EASE = 0.09;
const SETTLE_PX = 0.4;

/**
 * Eases the ambient background's warm glow after the cursor. Renders nothing:
 * it only writes a transform to #ambient-glow, and the animation loop runs only
 * while the glow is still catching up, so an idle cursor costs no frames.
 *
 * Fine pointers only — on touch there is no cursor, and a glow jumping to each
 * tap reads as a glitch rather than light.
 */
export function AmbientPointerGlow() {
  useEffect(() => {
    const glow = document.getElementById("ambient-glow");
    if (!glow) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const half = glow.offsetWidth / 2;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let x = targetX;
    let y = targetY;
    let frame = 0;

    const tick = () => {
      x += (targetX - x) * EASE;
      y += (targetY - y) * EASE;
      glow.style.transform = `translate3d(${x - half}px, ${y - half}px, 0)`;
      frame =
        Math.abs(targetX - x) > SETTLE_PX || Math.abs(targetY - y) > SETTLE_PX
          ? requestAnimationFrame(tick)
          : 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      glow.dataset.active = "";
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      delete glow.dataset.active;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
