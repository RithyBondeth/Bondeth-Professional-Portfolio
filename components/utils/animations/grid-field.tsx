import { GridPattern } from "@/components/ui/grid-pattern";

/* ─────────────────────────────────────────────────────────────────────────────
   Grid Field — the site's ambient background: MagicUI's `GridPattern`, an SVG
   `<pattern>` of hairlines with a handful of cells filled in, skewed the way
   the component's own demo skews it.

   Same behaviour contract the grain field it replaced was held to:
   - Mounted ONCE from the root layout, fixed to the viewport, aria-hidden. Not
     per-section: a copy per section puts a seam at every section boundary,
     where one instance's grid ends and the next one's starts over — and with a
     12° skew the two would not even meet at the same angle.
   - Landing sections carry no background of their own, so this shows through.

   Unlike the shader backgrounds this replaces, it is a SERVER component and
   ships no client JavaScript at all. It needs none: an SVG pattern is
   rasterised once and never repaints, so there is nothing for reduced motion or
   a coarse pointer to switch off, and the theme swap is two `dark:` variants
   rather than a React subscription. That also means no first-paint gap to cover
   with a CSS stand-in — the grid is in the server-rendered HTML.
   ──────────────────────────────────────────────────────────────────────────── */

/* ---------------------------------- Palette --------------------------------- */
/* The two colours are theme tokens, not the component's stock `gray-400/30`,
   which is a fixed grey that would sit unchanged on a #f8f9fb page and a
   #0a0f18 one. Lines take `--border`, filled cells `--primary`.

   The alpha on the filled cells is a contrast budget. Every landing section is
   transparent, so this grid IS the ground body copy sits on, and a filled cell
   is 43px square — wide enough to sit entirely behind a word.

   dark: ground #0a0f18 (L 0.0047), text #a1a1a1 (L 0.356). 4.5:1 caps the
   composite at L 0.0402, and --primary there is #7dd3fc at L 0.580, so the fill
   cannot exceed 6.2% — hence 5%.

   light: ground #f8f9fb (L 0.955), text #303546 (L 0.0357). The same rule caps
   the composite at ≥ L 0.336, and --primary there is #08375d at L 0.0357, which
   would allow 67%. 8% is a taste call, not a limit.

   The hairlines get more room in both themes than the cells do, since even at
   full opacity --border lands at L 0.372 (light) and L 0.0408 (dark) — the
   light one clears the floor outright, the dark one sits at the ceiling, and
   60% pulls it to a comfortable 5.1:1. */
const GRID_INK =
  "stroke-border/55 fill-primary/8 dark:stroke-border/60 dark:fill-primary/5";

/** 44px, not the component's stock 40. It divides the 1408px `max-w-6xl`
 *  content column into a whole number of cells, so the column edges land on
 *  grid lines instead of a pixel off them. */
const CELL = 44;

/* The filled cells, in grid coordinates from the pattern's top-left.
   Coordinates are absolute, NOT responsive — a phone shows roughly the first
   eight columns, so the list is weighted toward low x to make sure a handful
   still land on screen at 375px rather than all clustering off the right edge
   of the viewport. */
const SQUARES: Array<[number, number]> = [
  [2, 6],
  [7, 9],
  [5, 12],
  [1, 16],
  [3, 20],
  [9, 24],
  [6, 30],
  [13, 8],
  [18, 18],
  [24, 12],
  [16, 33],
  [29, 26],
];

/** A soft vignette rather than the demo's `400px circle at center`, which is
 *  sized for a 500px card and would leave a porthole of grid in the middle of a
 *  page. Written as a style rather than a Tailwind arbitrary value because the
 *  value has spaces in it, which Tailwind cannot parse — the class silently
 *  never compiles. The skew applies to the mask too, which is what tilts the
 *  fade-out along the same 12° as the lines. */
const VIGNETTE =
  "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)";

/* ------------------------------ The React layer ----------------------------- */
export function GridField({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      data-print-hide
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background ${className ?? ""}`}
    >
      <GridPattern
        width={CELL}
        height={CELL}
        x={-1}
        y={-1}
        squares={SQUARES}
        style={{ maskImage: VIGNETTE, WebkitMaskImage: VIGNETTE }}
        // Overscanned vertically and skewed, straight from the component's
        // demo: a 12° skew on a viewport-sized box would drag empty corners
        // into view, so it is drawn at 200% height and pulled up 30%.
        className={`inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 ${GRID_INK}`}
      />
    </div>
  );
}
