"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Jumps to an in-page section using the browser's native, interruptible scroll.
 * Native scrolling preserves refresh restoration and avoids placing the whole
 * application inside a fixed, transformed wrapper.
 */
export function scrollToSection(id: string, animate = true) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({ behavior: animate ? "smooth" : "auto", block: "start" });
  return true;
}

/**
 * Keeps the existing layout boundary while leaving scrolling native. The old
 * site-wide virtual scroller changed this wrapper to `position: fixed` during
 * hydration, which could blank restored/hash positions until GSAP refreshed.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Cross-route hash links can resolve before the destination section mounts.
  // Retry for a few frames; normal refresh restoration remains browser-owned.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    let frame = 0;
    let attempts = 0;
    const findTarget = () => {
      if (scrollToSection(hash, false) || attempts >= 4) return;
      attempts += 1;
      frame = requestAnimationFrame(findTarget);
    };
    frame = requestAnimationFrame(findTarget);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div id="smooth-wrapper" className="flex-1">
      <div id="smooth-content" className="min-h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}
