"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * A thin top progress bar that tracks how far the reader has scrolled through
 * the article, plus a "back to top" button that appears once they scroll down.
 * The bar is updated via a direct transform on a ref (no re-render per frame).
 */
export function ReadingProgress({ backToTopLabel }: { backToTopLabel: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        const progress = max > 0 ? Math.min(el.scrollTop / max, 1) : 0;
        if (barRef.current) {
          barRef.current.style.transform = `scaleX(${progress})`;
        }
        setShowTop(el.scrollTop > 600);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function scrollToTop() {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <>
      <div
        aria-hidden
        ref={barRef}
        className="fixed inset-x-0 top-0 z-100 h-0.5 origin-left scale-x-0 bg-primary"
      />
      <button
        type="button"
        onClick={scrollToTop}
        aria-label={backToTopLabel}
        className={`fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-full border border-border/60 bg-card/90 text-foreground shadow-lg backdrop-blur transition-all duration-200 hover:border-primary/40 hover:text-primary ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="size-4" aria-hidden />
      </button>
    </>
  );
}
