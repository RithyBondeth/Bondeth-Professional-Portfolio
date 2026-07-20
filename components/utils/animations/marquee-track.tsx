"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

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

  /* -------------------------------- All States ------------------------------- */
  const [paused, setPaused] = useState(false);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          width: "max-content",
          willChange: "transform",
          animation: `marquee-${direction} ${duration}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
        className="marquee-track"
      >
        {children}
      </div>
    </div>
  );
}
