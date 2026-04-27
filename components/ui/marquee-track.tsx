"use client";

import { useState } from "react";

interface MarqueeTrackProps {
  children: React.ReactNode;
  /** "rtl" scrolls right-to-left, "ltr" scrolls left-to-right */
  direction?: "rtl" | "ltr";
  /** seconds per full loop */
  duration?: number;
}

export function MarqueeTrack({
  children,
  direction = "rtl",
  duration = 30,
}: MarqueeTrackProps) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
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
      >
        {children}
      </div>
    </div>
  );
}
