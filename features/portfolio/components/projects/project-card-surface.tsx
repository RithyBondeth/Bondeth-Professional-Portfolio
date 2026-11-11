"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";

/** Only the active card does pointer work; content stays server-rendered. */
export function ProjectCardSurface({ children }: { children: ReactNode }) {
  const surface = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const point = useRef({ x: 0, y: 0 });
  const reducedMotion = useReducedMotion();

  function reset() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    for (const property of [
      "--project-rotate-x",
      "--project-rotate-y",
      "--project-light-x",
      "--project-light-y",
    ]) {
      surface.current?.style.removeProperty(property);
    }
  }

  useEffect(() => {
    if (reducedMotion) reset();
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [reducedMotion]);

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (
      reducedMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;

    point.current = { x: event.clientX, y: event.clientY };
    if (frame.current !== null) return;

    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      const node = surface.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = Math.max(
        0,
        Math.min(1, (point.current.x - rect.left) / rect.width),
      );
      const y = Math.max(
        0,
        Math.min(1, (point.current.y - rect.top) / rect.height),
      );
      node.style.setProperty("--project-rotate-x", `${(0.5 - y) * 4}deg`);
      node.style.setProperty("--project-rotate-y", `${(x - 0.5) * 4}deg`);
      node.style.setProperty("--project-light-x", `${x * 100}%`);
      node.style.setProperty("--project-light-y", `${y * 100}%`);
    });
  }

  return (
    <div
      ref={surface}
      className="project-card-surface relative h-full rounded-lg"
      onPointerEnter={followPointer}
      onPointerMove={followPointer}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  );
}
