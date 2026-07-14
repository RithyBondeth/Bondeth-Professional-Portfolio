"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "./gsap";

/**
 * Pins the showcase to the viewport and translates its inner track sideways as
 * the user scrolls vertically — the classic "the page goes horizontal" moment.
 *
 * The whole panel (optional `header` + card track) pins together, vertically
 * centred and filling the screen, so the sideways motion begins the instant the
 * section settles into the middle of the viewport — not after a strip of dead
 * space at the end.
 *
 * Behaviour is progressive:
 * - Motion allowed (any screen size, mobile included) → pinned, scrubbed
 *   horizontal scroll driven by vertical scrolling.
 * - Reduced-motion → falls back to a normal, swipe-friendly horizontal overflow
 *   strip (no pinning, no scroll-jacking).
 *
 * The caller lays the items out as flex children of the track.
 */
export function HorizontalScroll(props: {
  children: React.ReactNode;
  /** Rendered above the track and pinned along with it (heading, filters…). */
  header?: React.ReactNode;
  /** Extra classes for the flex track that holds the items. */
  trackClassName?: string;
  /** Section background / padding classes. */
  className?: string;
  /**
   * Change this whenever the set of children changes (e.g. a filter value) so
   * the pinned scroll recalculates its width and travel distance.
   */
  refreshOn?: unknown;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { children, header, trackClassName, className, refreshOn } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    // Mobile browsers fire resize events as the URL bar shows/hides; ignoring
    // them keeps the pin from jumping mid-scroll on phones.
    ScrollTrigger.config({ ignoreMobileResize: true });

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mm = gsap.matchMedia();

    // Pinned, scroll-driven horizontal scroll — every screen size, motion on.
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // GSAP fully drives the sideways motion, so switch the track off native
      // horizontal scrolling / snapping while it's in charge.
      track.style.overflowX = "visible";
      track.style.scrollSnapType = "none";

      // Distance the track must travel so its last card reaches the edge.
      const getScrollAmount = () =>
        Math.max(0, track.scrollWidth - track.clientWidth);

      const tween = gsap.to(track, {
        x: () => -getScrollAmount(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          // The panel is exactly one viewport tall, so pinning it at the top
          // means the sideways motion begins the moment the section fills the
          // screen — right in the middle of the scroll, never at the tail end.
          start: "top top",
          end: () => `+=${getScrollAmount()}`,
          scrub: 1,
          pin: pinRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "x" });
        track.style.overflowX = "";
        track.style.scrollSnapType = "";
      };
    });

    // Recalculate once children have laid out at their new width.
    const refreshId = window.requestAnimationFrame(() =>
      ScrollTrigger.refresh(),
    );

    return () => {
      window.cancelAnimationFrame(refreshId);
      mm.revert();
    };
  }, [refreshOn]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div ref={sectionRef} className={className}>
      {/* Pinned panel — fills and centres in the viewport. `h-svh` (small
          viewport height) keeps the pin height stable on mobile. */}
      <div
        ref={pinRef}
        className="h-svh flex flex-col justify-center overflow-hidden gap-8"
      >
        {header ? (
          <div className="max-w-6xl mx-auto px-6 w-full shrink-0">{header}</div>
        ) : null}

        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className={[
              // Reduced-motion fallback: a normal horizontal swipe strip.
              "flex gap-5 overflow-x-auto snap-x snap-mandatory",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              "will-change-transform px-6",
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
