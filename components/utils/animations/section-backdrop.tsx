"use client";

import { DotMatrix } from "@/components/utils/animations/dot-matrix";

/* Backdrop palette — black & white theme: a neutral grayscale ramp instead of
   the old four-stop colour spectrum, so the dot texture reads as monochrome in
   both themes. Kept as literals because DotMatrix builds rgba() strings on a hot
   canvas path and cannot resolve CSS custom properties per frame.

   Hoisted so their identity is stable across renders (DotMatrix keys its effect
   on these props). */
const BACKDROP_COLORS = [
  [120, 120, 120],
  [160, 160, 160],
  [200, 200, 200],
  [240, 240, 240],
];
const BACKDROP_OPACITIES = [0.1, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.6];

/**
 * Dot-matrix texture for a landing section, masked to a soft centre bloom so it
 * never competes with the content in front of it.
 *
 * Drop it in as the FIRST child of a section carrying `relative isolate`. The
 * `isolate` makes the section a stacking context, so `-z-10` paints the canvas
 * above the section's own background but behind every in-flow child — which
 * means existing content needs no z-index of its own.
 *
 * The canvas is `inset-0`, so it can never overflow the section and the parent
 * does not need `overflow-hidden`.
 */
export function SectionBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_50%_at_50%_40%,black,transparent)]">
      <DotMatrix
        colors={BACKDROP_COLORS}
        opacities={BACKDROP_OPACITIES}
        gap={10}
        dotSize={2}
        animationSpeed={0.6}
      />
    </div>
  );
}
