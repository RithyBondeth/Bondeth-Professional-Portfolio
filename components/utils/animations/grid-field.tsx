"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollSmoother } from "@/components/utils/animations/gsap";
import { GridPattern } from "@/components/ui/grid-pattern";

/* ─────────────────────────────────────────────────────────────────────────────
   Grid Field — the site's ambient background: MagicUI's `GridPattern`, an SVG
   `<pattern>` of hairlines skewed the way the component's own demo skews it,
   streaming upward as the page scrolls so that descending reads as falling
   THROUGH the grid, with a scatter of cells fading in and out over the top.

   Same behaviour contract the grain field it replaced was held to:
   - Mounted ONCE from the root layout, fixed to the viewport, aria-hidden. Not
     per-section: a copy per section puts a seam at every section boundary,
     where one instance's grid ends and the next one's starts over — and with a
     12° skew the two would not even meet at the same angle.
   - Landing sections carry no background of their own, so this shows through.
   - Reduced motion holds the lattice still and every cell fully painted.

   MOVEMENT is what makes this read as animated; the cell fade alone did not.
   That is a consequence of the layout rather than a preference — see the
   contrast budget below for why the cells cannot be bright enough in dark mode
   for a fade to register. There are three layers of it, and they compose by
   nesting rather than by fighting over one `transform`:

     scroll fall (here, GSAP)  →  idle drift (CSS)  →  skew (CSS)

   The idle drift is what keeps the field alive when the page is sitting still;
   the fall is what the reader actually feels.

   It is a CLIENT component, which the two shader backgrounds before it also
   were, but for a smaller reason: everything except the scroll binding is
   still CSS and server-rendered markup. The grid is in the SSR HTML and
   correct before hydration — only the falling waits for JS. GSAP is already
   in the bundle on every route (SmoothScroll, the hero), so the marginal cost
   is this file.
   ──────────────────────────────────────────────────────────────────────────── */

/* ---------------------------------- Palette --------------------------------- */
/* The two colours are theme tokens, not the component's stock `gray-400/30`,
   which is a fixed grey that would sit unchanged on a #f8f9fb page and a
   #0a0f18 one. Lines take `--border`, filled cells `--primary`.

   The alpha on the filled cells is a contrast budget, and it is also the reason
   the cell fade could never have carried this on its own. Every landing section
   is transparent, so this grid IS the ground body copy sits on; a filled cell
   is 43px square, wide enough to sit entirely behind a word; and the content
   column is `max-w-6xl`, so on a 1440px viewport text covers ~94% of the width
   and there is no empty margin to hide a brighter effect in. The animation does
   not relax any of it: it drives element `opacity`, which MULTIPLIES the fill
   alpha, so a cell at the top of its cycle is exactly as dark as a static one
   and every number below still describes the worst case.

   dark: ground #0a0f18 (L 0.0047), text #a1a1a1 (L 0.356). 4.5:1 caps the
   composite at L 0.0402, and --primary there is #7dd3fc at L 0.580, so the fill
   cannot exceed 6.2% — hence 5%. A fade between 0 and 5% is not something the
   eye reports as movement, which is what the drift is for.

   light: ground #f8f9fb (L 0.955), text #303546 (L 0.0357). The same rule caps
   the composite at ≥ L 0.336, and --primary there is #08375d at L 0.0357, which
   would allow 67%. 14% is a taste call, not a limit — the cells read clearly
   here, and this theme is the one where the fade does pull its weight.

   The hairlines get more room in both themes than the cells do, since even at
   full opacity --border lands at L 0.372 (light) and L 0.0408 (dark) — the
   light one clears the floor outright, the dark one sits at the ceiling, and
   60% pulls it to a comfortable 5.1:1. */
const LINE_INK = "stroke-border/55 dark:stroke-border/60";
const CELL_INK = "stroke-transparent fill-primary/14 dark:fill-primary/5";

/** 44px, not the component's stock 40. It divides the 1408px `max-w-6xl`
 *  content column into a whole number of cells, so the column edges land on
 *  grid lines instead of a pixel off them. */
const CELL = 44;

/* The filled cells, in grid coordinates from the pattern's top-left.
   Coordinates are absolute, NOT responsive — a phone shows roughly the first
   eight columns, so the list is weighted toward low x to make sure a good
   handful still land on screen at 375px rather than all clustering off the
   right edge of the viewport.

   ORDER IS LOAD-BEARING, which is not obvious from reading it. `.grid-breathe`
   assigns each cell its duration and delay by `nth-child`, so a list written in
   reading order would put every cell in a screen region on the same phase and
   make the field pulse in visible bands. The three x-ranges are interleaved so
   that neighbouring positions are never neighbouring children. */
const SQUARES: Array<[number, number]> = [
  [1, 16],
  [13, 8],
  [24, 12],
  [2, 6],
  [18, 18],
  [29, 26],
  [3, 20],
  [10, 25],
  [22, 19],
  [5, 12],
  [15, 31],
  [27, 8],
  [7, 9],
  [9, 13],
  [31, 30],
  [6, 30],
  [16, 33],
  [25, 34],
  [0, 24],
  [12, 21],
  [21, 24],
  [4, 27],
  [19, 10],
  [8, 14],
  [11, 28],
  [2, 33],
  [7, 22],
  [5, 35],
];

/** A soft vignette rather than the demo's `400px circle at center`, which is
 *  sized for a 500px card and would leave a porthole of grid in the middle of a
 *  page. Written as a style rather than a Tailwind arbitrary value because the
 *  value has spaces in it, which Tailwind cannot parse — the class silently
 *  never compiles. */
const VIGNETTE =
  "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)";

/* ---------------------------------- Falling --------------------------------- */
/** How far the lattice travels per pixel scrolled. 0.35 puts it at roughly a
 *  third of the page's own speed — enough that scrolling clearly drives it,
 *  little enough that it reads as ground passing underneath rather than as a
 *  second page sliding behind the first. */
const FALL_RATE = 0.35;

/* ------------------------------ The React layer ----------------------------- */
export function GridField({ className }: { className?: string }) {
  const fallRef = useRef<HTMLDivElement>(null);

  /* Scroll drives the lattice upward, so descending the page feels like
     descending THROUGH the grid rather than sliding a picture behind it.

     Two things make this exact rather than approximate:

     - The translation is taken modulo one cell. Without it the offset grows
       without bound and the grid leaves the viewport a few screens in; with it
       the value stays inside (-44, 0] forever. That wrap is invisible for the
       same reason the idle drift's is — a lattice translated by exactly one
       period maps onto itself, and it still holds after the skew, since
       skewY leaves a pure vertical translation unchanged.

     - It prefers ScrollSmoother's own scroll position to window.scrollY.
       ScrollSmoother lags the content behind the native scrollbar by `smooth`
       seconds, so the raw window value LEADS what is actually on screen and the
       grid would run slightly ahead of the page. `scrollTop()` is the position
       the reader can see. The fallback covers touch and reduced-motion
       sessions, where the smoother is never created and native scroll is the
       only truth.

     This reads the position on GSAP's ticker rather than from a
     ScrollTrigger's `onUpdate`. A trigger was the first attempt and it did not
     work: with `start: 0, end: "max"` the end resolves once, at creation, and
     on a page whose height is still settling (fonts, images) it latched onto a
     stale value and stopped firing — the grid sat at y=0 no matter how far
     the page scrolled. A ticker callback has no geometry to go stale, and the
     early-out below means an idle page does no work beyond one comparison.

     GSAP's matchMedia handles the reduced-motion opt-out and re-evaluates it if
     the preference changes mid-session, which is why the gate is here rather
     than in the `@media` block that governs the idle drift. */
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const el = fallRef.current;
      if (!el) return;
      // quickSetter skips GSAP's per-call property parsing — this runs on every
      // frame the page is moving, which is exactly what it is for.
      const setY = gsap.quickSetter(el, "y", "px");
      let last: number | null = null;

      const update = () => {
        const scrolled = ScrollSmoother.get()?.scrollTop() ?? window.scrollY;
        const y = -((scrolled * FALL_RATE) % CELL);
        if (y === last) return;
        last = y;
        setY(y);
      };

      update();
      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    });
    return () => mm.revert();
  }, []);

  return (
    <div
      aria-hidden
      data-print-hide
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background ${className ?? ""}`}
    >
      {/* The vignette is its own element, between the ground colour and the
          grid, for two reasons. It must not mask `bg-background` — that would
          fade the page's own ground to transparent at the corners. And keeping
          it off the animating SVG means the mask is composited once instead of
          being re-evaluated over the full viewport on every frame of the
          breathe loop. */}
      <div
        className="absolute inset-0"
        style={{ maskImage: VIGNETTE, WebkitMaskImage: VIGNETTE }}
      >
        {/* Two instances, not one, and the split is what makes both the drift
            and the fall seamless. Sliding the lattice by exactly one cell maps
            the hairline pattern onto itself, so the wrap is invisible — but the
            highlighted cells sit at fixed coordinates and would snap back a row
            every time it happened. So the lines move and the cells stay put,
            breathing where they are.

            Both are overscanned vertically, straight from the component's demo:
            a 12° skew on a viewport-sized box would drag empty corners into
            view, so each is drawn at 200% height and pulled up 30%. The moving
            layer takes its skew from `.grid-drift` rather than a Tailwind
            utility, since its animation owns the whole `transform`. */}
        {/* The fall is its own wrapper rather than another class on the SVG:
            the SVG's `transform` already belongs to the idle-drift keyframes,
            and a second animation cannot share the property. Nesting composes
            them instead — scroll offset outside, idle drift and skew inside. */}
        <div ref={fallRef} className="absolute inset-0">
          <GridPattern
            width={CELL}
            height={CELL}
            x={-1}
            y={-1}
            className={`inset-x-0 inset-y-[-30%] h-[200%] grid-drift ${LINE_INK}`}
          />
        </div>
        {/* `stroke-transparent` is why this one contributes cells and nothing
            else: GridPattern always draws its hairline path, and a second set
            over the drifting one would beat against it as they slid apart. */}
        <GridPattern
          width={CELL}
          height={CELL}
          x={-1}
          y={-1}
          squares={SQUARES}
          className={`inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 grid-breathe ${CELL_INK}`}
        />
      </div>
    </div>
  );
}
