"use client";

import { useReducedMotion } from "@/components/utils/animations/use-motion";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Pinned horizontal showcase: scrolling down pins the section and slides the
 * track sideways; once the last card is in view, the page scrolls on as
 * normal.
 *
 * The motion is pure CSS — the section exposes a `--hscroll` view timeline and
 * the track's translate is scrubbed against it, so it runs on the compositor
 * in lockstep with the scroll. JavaScript only measures how far the track has
 * to travel (`--travel`), which also sets how much extra height the section
 * needs to pin for exactly that distance.
 *
 * Until that measurement lands — and permanently without scroll timelines or
 * under reduced motion — it stays a native, swipeable, snap-scrolling strip.
 */
export function HorizontalScroll(props: {
  children: React.ReactNode;
  header?: React.ReactNode;
  trackClassName?: string;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const { children, header, trackClassName, className } = props;
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const pinned = travel > 0 && !reduceMotion;

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;
    if (!CSS.supports("animation-timeline: view()")) return;
    if (reduceMotion) return;

    const measure = () => {
      setTravel(Math.max(0, Math.ceil(track.scrollWidth - viewport.clientWidth)));
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(track);
    measure();
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div
      className={`hscroll ${className ?? ""}`}
      data-pinned={pinned || undefined}
      style={pinned ? ({ "--travel": `${travel}px` } as CSSProperties) : undefined}
    >
      <div className="hscroll-stage flex min-h-svh flex-col justify-center gap-8 py-16 sm:py-20">
        {header ? (
          <div className="mx-auto w-full max-w-6xl shrink-0 px-6">{header}</div>
        ) : null}
        <div ref={viewportRef} className="overflow-clip">
          <div
            ref={trackRef}
            className={[
              "flex gap-5 px-6 pb-4",
              pinned
                ? "hscroll-track w-max"
                : "snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              trackClassName ?? "",
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
