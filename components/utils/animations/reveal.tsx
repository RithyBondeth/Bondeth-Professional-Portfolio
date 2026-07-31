"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's only entrance animation: a 12px fade-up, once, on first entry.
 *
 * The transition itself lives in `globals.css` under `[data-reveal]`; this
 * component's whole job is to flip the attribute to `"in"` when the element
 * first crosses into view. That keeps the animation off the JS main thread,
 * makes it free under `prefers-reduced-motion` (the CSS neutralizes it), and
 * means an element that never scrolls into view still ends up visible — the
 * safety timeout below guarantees it.
 */

/** Shared observer wiring. Returns the ref to attach and the attribute value. */
function useRevealed<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    const supported = typeof IntersectionObserver !== "undefined";

    const io = supported
      ? new IntersectionObserver(
          (entries) => {
            if (!entries.some((e) => e.isIntersecting)) return;
            setShown(true);
            io?.disconnect();
          },
          // Fire a little before the element is fully on screen so the fade has
          // finished by the time the reader's eye reaches it.
          { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
        )
      : null;
    io?.observe(el);

    // Anything still hidden after 3s is shown regardless — an element inside a
    // collapsed or off-screen container must never be permanently invisible.
    // With no IntersectionObserver at all this fires on the next tick, so the
    // content simply appears instead of the page staying blank. (A timeout
    // rather than a direct setState: setting state in an effect body triggers
    // a cascading render, which React lint rightly rejects.)
    const safety = window.setTimeout(() => setShown(true), supported ? 3000 : 0);

    return () => {
      io?.disconnect();
      window.clearTimeout(safety);
    };
  }, [shown]);

  return [ref, shown ? "in" : "out"] as const;
}

function delayStyle(delay: number): React.CSSProperties | undefined {
  return delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined;
}

/* ---------------------------------- Reveal --------------------------------- */
export function Reveal(props: {
  children: React.ReactNode;
  className?: string;
  /** Milliseconds of delay before this element starts. */
  delay?: number;
}) {
  const { children, className, delay = 0 } = props;
  const [ref, state] = useRevealed<HTMLDivElement>();

  return (
    <div ref={ref} data-reveal={state} style={delayStyle(delay)} className={className}>
      {children}
    </div>
  );
}

/* ------------------------------- RevealGroup ------------------------------- */
/**
 * Staggers direct children of a grid or flex container. Each child is wrapped
 * in its own animated div, so the wrapper must be the layout container (the
 * wrappers become its items). Not for use around `<li>` — put `Reveal` inside
 * each list item instead.
 */
export function RevealGroup(props: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Milliseconds between each child. */
  stagger?: number;
  childClassName?: string;
}) {
  const { children, className, delay = 0, stagger = 70, childClassName } = props;
  const [ref, state] = useRevealed<HTMLDivElement>();
  const items = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={className}>
      {items.map((child, i) => (
        <div
          key={i}
          data-reveal={state}
          className={childClassName}
          style={{ "--reveal-delay": `${delay + i * stagger}ms` } as React.CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/* -------------------------------- RevealRule ------------------------------- */
/** A hairline that draws itself in from the left when its section arrives. */
export function RevealRule(props: {
  className?: string;
  delay?: number;
  strong?: boolean;
}) {
  const { className, delay = 0, strong = false } = props;
  const [ref, state] = useRevealed<HTMLHRElement>();

  return (
    <hr
      ref={ref}
      data-reveal-rule={state}
      style={delayStyle(delay)}
      className={cn(strong ? "rule-strong" : "rule", className)}
    />
  );
}
