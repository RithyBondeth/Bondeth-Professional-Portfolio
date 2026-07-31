"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Jumps to an in-page section by id.
 *
 * v0.2.0 removed GSAP ScrollSmoother: inertial/virtualized scrolling is a
 * distinctly "web-app" sensation, and the editorial design wants the page to
 * behave like a document. Scrolling is native again, so this is a thin wrapper
 * over `scrollIntoView` — kept as a function because every in-page nav link
 * calls it, and because the fixed masthead needs a scroll-margin offset that
 * lives in the section markup (`scroll-mt-*`).
 */
export function scrollToSection(id: string, animate = true) {
  const el = document.getElementById(id);
  if (!el) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    behavior: animate && !reduce ? "smooth" : "auto",
    block: "start",
  });
  return true;
}

/**
 * Passthrough layout wrapper. It no longer virtualizes scroll; it only keeps
 * the flex column that the root layout depends on, and lands on the URL hash
 * after a client-side navigation (arriving at `/en#about` from another route
 * mounts the content *after* the browser has already tried to jump).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.location.hash) return;
    const id = requestAnimationFrame(() =>
      scrollToSection(window.location.hash.slice(1), false),
    );
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return <div className="flex flex-1 flex-col">{children}</div>;
}
