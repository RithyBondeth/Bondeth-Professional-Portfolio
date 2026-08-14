"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef } from "react";

/**
 * Scrolls its children horizontally in an infinite loop and pauses on
 * hover — the children must be duplicated by the caller for a seamless wrap.
 */
export function MarqueeTrack(props: {
  children: React.ReactNode;
  /** "rtl" scrolls right-to-left, "ltr" scrolls left-to-right */
  direction?: "rtl" | "ltr";
  /** seconds per full loop */
  duration?: number;
  className?: string;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { children, direction = "rtl", duration = 30, className } = props;

  const trackRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const rampPlaybackRate = useCallback((target: number, durationMs: number) => {
    const animation = trackRef.current?.getAnimations()[0];
    if (!animation) return;

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    const initialRate = animation.playbackRate;
    const startedAt = performance.now();

    const updateRate = (now: number) => {
      const progress = Math.min((now - startedAt) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      animation.playbackRate = initialRate + (target - initialRate) * eased;

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(updateRate);
      } else {
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(updateRate);
  }, []);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => rampPlaybackRate(0, 450)}
      onMouseLeave={() => rampPlaybackRate(1, 550)}
      onFocusCapture={() => rampPlaybackRate(0, 300)}
      onBlurCapture={() => rampPlaybackRate(1, 450)}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "max-content",
          willChange: "transform",
          animation: `marquee-${direction} ${duration}s linear infinite`,
        }}
        className="marquee-track"
      >
        {children}
      </div>
    </div>
  );
}
