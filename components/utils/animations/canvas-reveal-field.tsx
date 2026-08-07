"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/utils/theme/theme-provider";

/* ─────────────────────────────────────────────────────────────────────────────
   Canvas Reveal Field — the site's ambient background: Aceternity's canvas
   reveal dot matrix (`@/components/ui/canvas-reveal-effect`), tuned until it is
   a surface the body copy still reads on.

   Same behaviour contract the grain field it replaced was held to:
   - Mounted ONCE from the root layout, fixed to the viewport, aria-hidden. Not
     per-section: a copy per section puts a seam at every section boundary,
     where one instance's grid ends and the next one's starts over — and the
     centre-out reveal would restart eleven times down one page.
   - Reduced motion, or a coarse pointer → the CSS dot grid below, no WebGL at
     all. A full-bleed fragment shader that re-rasterises every frame is exactly
     what a phone cannot spare during a scroll, and the effect's whole idea is
     per-dot flicker, so there is no "speed 0" that keeps it and stops it.
   - Theme-aware, with a fresh mount per theme so a switch swaps GL contexts
     instead of retuning a live one mid-frame.
   - The wrapper carries the CSS dot grid underneath regardless, which is what
     shows before the WebGL context is up and if WebGL is missing.
   ──────────────────────────────────────────────────────────────────────────── */

// three + @react-three/fiber are ~600kB of the client bundle for a decorative
// layer, and the <Canvas> renders nothing on the server. Splitting it out keeps
// it off the critical path; the CSS grid below covers the gap before it lands.
const CanvasRevealEffect = dynamic(
  () =>
    import("@/components/ui/canvas-reveal-effect").then(
      (m) => m.CanvasRevealEffect,
    ),
  { ssr: false },
);

/* ---------------------------------- Palette --------------------------------- */
/* The ceiling on `opacities` is a contrast budget, not a taste call.
   Every landing section is transparent, so this grid IS the ground that
   `--field-muted-foreground` sits on, and a 2px dot on a 4px pitch is wide
   enough to sit entirely behind a glyph stroke — it cannot be discounted as
   texture the way the old grain could.

   The shader premultiplies (`fragColor.rgb *= fragColor.a`) and then blends
   SrcAlpha/One onto a transparent buffer, so a dot's effective coverage over
   the page is opacity SQUARED, not opacity. That is what these numbers are
   budgeted against.

   dark: ground #0a0f18 (L 0.0047), text #a1a1a1 (L 0.356). 4.5:1 caps the
   composite at L 0.0402. The brighter of the two dot colours, #7dd3fc, is
   L 0.580, so coverage ≤ 0.061 → opacity ≤ 0.247. Topping out at 0.22
   (coverage 0.048, composite L 0.0325) leaves it at 4.9:1.

   light: ground #f8f9fb (L 0.955), text #303546 (L 0.0357). Same rule caps the
   composite at ≥ L 0.336, and the darkest dot, #0d6cb0, is L 0.139 — coverage
   could run to 0.75 before that bites. The 0.5 ceiling here is purely visual:
   past about a quarter coverage the grid stops reading as a field and starts
   reading as halftone print. */
const PALETTES = {
  dark: {
    back: "#0a0f18",
    // [59,130,246] blue-500 and [125,211,252] — the same sky --primary is.
    colors: [
      [59, 130, 246],
      [125, 211, 252],
    ],
    opacities: [0.05, 0.05, 0.08, 0.08, 0.1, 0.12, 0.14, 0.16, 0.19, 0.22],
    // The CSS stand-in's dot, at the array's mean coverage rather than its max.
    staticDot: "rgba(125, 211, 252, 0.10)",
  },
  light: {
    back: "#f8f9fb",
    // #0d6cb0 (--primary-fill) and #7dd3fc, so the field is the same two blues
    // the buttons and carets are.
    colors: [
      [13, 108, 176],
      [125, 211, 252],
    ],
    opacities: [0.08, 0.08, 0.12, 0.12, 0.18, 0.18, 0.25, 0.32, 0.4, 0.5],
    staticDot: "rgba(13, 108, 176, 0.16)",
  },
} as const;

/** Slow. This is a background that reveals itself once on load, not a hover
 *  effect — at the demo's 3–5 the whole page snaps in before the hero's own
 *  entrance timeline has started. */
const ANIMATION_SPEED = 1.2;

/** Softens the grid where the content column is and leaves it at full strength
 *  toward the edges, so no paragraph is ever read straight off the densest part
 *  of the field. Written as a style rather than a Tailwind arbitrary value
 *  because `rgba(0,0,0,0.35)` inside `[mask-image:…]` has spaces in it, which
 *  Tailwind cannot parse — the class silently never compiles. */
const CENTRE_MASK =
  "radial-gradient(ellipse 80% 65% at 50% 45%, rgba(0,0,0,0.3), rgba(0,0,0,1) 80%)";

/* ---------------------------------- Hooks ----------------------------------- */
/** True when the field must hold still: reduced motion OR a coarse pointer. */
function useStaticFrame() {
  return useSyncExternalStore(
    (onChange) => {
      const mqs = [
        window.matchMedia("(prefers-reduced-motion: reduce)"),
        window.matchMedia("(pointer: coarse)"),
      ];
      mqs.forEach((mq) => mq.addEventListener("change", onChange));
      return () =>
        mqs.forEach((mq) => mq.removeEventListener("change", onChange));
    },
    () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches,
    () => true, // SSR: assume static; hydration flips it on capable clients
  );
}

/* ------------------------------ The React layer ----------------------------- */
export function CanvasRevealField({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const isStatic = useStaticFrame();
  const p = PALETTES[resolvedTheme];

  return (
    <div
      aria-hidden
      data-print-hide
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className ?? ""}`}
      style={{
        backgroundColor: p.back,
        // The plain-CSS grid: first paint, no-WebGL sessions, and the whole
        // story on touch and under reduced motion.
        backgroundImage: `radial-gradient(circle at center, ${p.staticDot} 1px, transparent 1px)`,
        backgroundSize: "4px 4px",
      }}
    >
      {!isStatic && (
        <div
          className="absolute inset-0"
          style={{ maskImage: CENTRE_MASK, WebkitMaskImage: CENTRE_MASK }}
        >
          <CanvasRevealEffect
            // Fresh mount per theme — see the contract above.
            key={resolvedTheme}
            animationSpeed={ANIMATION_SPEED}
            colors={p.colors.map((c) => [...c])}
            opacities={[...p.opacities]}
            dotSize={2}
            // Both off: the container's own `bg-white` and the built-in
            // `from-gray-950` bottom fade are the demo's black-card framing.
            // Here the ground is `--background` and it has to follow the theme.
            containerClassName="bg-transparent"
            showGradient={false}
          />
        </div>
      )}
    </div>
  );
}
