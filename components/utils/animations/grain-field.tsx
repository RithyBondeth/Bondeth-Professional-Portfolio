"use client";

import { useSyncExternalStore } from "react";
import { GrainGradient } from "@paper-design/shaders-react";
import { useTheme } from "@/components/utils/theme/theme-provider";

/* ─────────────────────────────────────────────────────────────────────────────
   Grain Field — the Paper Shaders "Grain Gradient" (shape: corners) preset,
   the one from paper.design's "Design Beyond Limits" hero.

   Behaviour contract:
   - Mounted ONCE from the root layout, fixed to the viewport, aria-hidden. Not
     per-section: a copy per section puts a seam at every section boundary,
     where one instance's field ends and the next one's starts over.
   - Reduced motion, or a coarse pointer → speed 0, a single static frame.
     (A full-bleed layer that re-rasterises every frame is exactly what a
     phone cannot spare during a scroll.)
   - Theme-aware: the corners preset is black-backed by design, so dark keeps
     it verbatim; light walks the same three hues onto a white ground and
     softens them so the site's dark inks still read on top.
   - The wrapper carries a plain CSS radial-gradient approximation, which is
     what shows before the WebGL context is up and if WebGL is missing.
   ──────────────────────────────────────────────────────────────────────────── */

/* ---------------------------------- Palette --------------------------------- */
/* Neither palette is the demo's verbatim, and both are off it for the same
   reason: this canvas is the literal ground every paragraph on the site sits
   on, so each band has to be a surface the body ink still reads against.

   The demo's ramp (#2b2bff → #3fd2ff → #e8a5ff on black) cannot be that. Its
   cyan sits at relative luminance 0.544; dark-theme `--field-muted-foreground`
   (#a1a1a1) is 0.356, which pairs at 1.46:1 — and even pure #fafafa over that
   cyan is only 1.70:1. The demo survives it because its sole text is huge bold
   white, which only owes 3:1. A tagline does not get that discount.

   So `dark` walks the three hues down onto the black ground until every band
   clears luminance 0.040 — the ceiling at which #a1a1a1 still makes 4.5:1.
   Measured: #1e2a78 = 0.033, #0f3a4d = 0.037, #3d2a6b = 0.037. The corner
   geometry, the bend and the grain all survive; only the neon comes off.
   `intensity` and `noise` go UP to compensate — on a darker ramp the grain is
   what keeps the field from reading as flat murk.

   `light` keeps the demo's hues pulled far toward white. It needs the opposite
   bound — dark ink on a light ground — and clears it comfortably: the floor for
   #303546 (0.036) is luminance 0.338, and the three tints land at 0.55 / 0.72 /
   0.68. */
const PALETTES = {
  dark: {
    back: "#000000",
    colors: ["#1e2a78", "#0f3a4d", "#3d2a6b"],
    softness: 0.6,
    intensity: 0.42,
    noise: 0.42,
  },
  light: {
    back: "#ffffff",
    colors: ["#a9c4ff", "#a5e6ff", "#eaccff"],
    softness: 0.75,
    intensity: 0.22,
    noise: 0.18,
  },
} as const;

const SPEED = 0.6;

/* ---------------------------------- Hooks ----------------------------------- */
/** True when the shader must hold still: reduced motion OR a coarse pointer. */
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
export function GrainField({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const isStatic = useStaticFrame();
  const p = PALETTES[resolvedTheme];

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className ?? ""}`}
      // Rough CSS stand-in (corner glows on the back colour) for the first
      // paint and for no-WebGL sessions.
      style={{
        backgroundColor: p.back,
        backgroundImage:
          `radial-gradient(60% 60% at 0% 100%, ${p.colors[0]}55, transparent 70%), ` +
          `radial-gradient(60% 60% at 100% 0%, ${p.colors[1]}55, transparent 70%), ` +
          `radial-gradient(50% 50% at 50% 50%, ${p.colors[2]}33, transparent 70%)`,
      }}
    >
      <GrainGradient
        // Fresh mount per theme, so a theme switch swaps GL contexts instead of
        // retuning a live one mid-frame.
        key={resolvedTheme}
        className="block h-full w-full"
        colorBack={p.back}
        colors={[...p.colors]}
        shape="corners"
        softness={p.softness}
        intensity={p.intensity}
        noise={p.noise}
        speed={isStatic ? 0 : SPEED}
      />
    </div>
  );
}
