"use client";

import { useEffect, useRef } from "react";

interface IGradientWaveProps {
  /** Overall strength, `0` → invisible, `1` → full. Scales every ribbon's alpha. */
  intensity?: number;
  /** Drift-rate multiplier. `1` is the house default (~30s per cycle). */
  speed?: number;
  /** Extra classes for the wrapper. */
  className?: string;
}

/**
 * The ribbons, back to front.
 *
 * Each one is the band between two sine composites — NOT a fill from a curve
 * down to the floor. Filling to the floor stacks every layer at the bottom of
 * the frame, which is what made the old version darkest along its own bottom
 * edge; discrete ribbons let white space run between them, which is the whole
 * character of this effect.
 *
 * The gaps between them matter as much as the ribbons: three bands totalling
 * ~0.86 of the height leave real white showing, and because `amp` is close to
 * each band's own thickness, the ribbons swing across those gaps and close them
 * on one side of the frame while opening them on the other. That is what makes
 * the white read as diagonal wedges rather than as flat horizontal stripes.
 *
 * `top`/`thickness` are fractions of height, `amp` is the sine's swing (also a
 * fraction of height), `freq` is cycles across the width, `speed` is cycles per
 * second, and `phase` offsets each ribbon so their crests never line up.
 *
 * Frequencies stay well under 1 — a full sine cycle across the viewport reads
 * as a mechanical ripple, while two-thirds of one reads as a single sweep
 * crossing the frame, which is the shape the reference is built from.
 */
const RIBBONS = [
  { top: -0.08, thickness: 0.24, amp: 0.15, freq: 0.62, speed: 0.02, phase: 0 },
  { top: 0.32, thickness: 0.28, amp: 0.17, freq: 0.5, speed: 0.031, phase: 2.2 },
  { top: 0.7, thickness: 0.34, amp: 0.13, freq: 0.72, speed: 0.024, phase: 4.1 },
] as const;

/**
 * One hue, several alphas — the reference is monochrome sky blue on white, and
 * the depth in it comes entirely from ribbons overlapping at different opacities,
 * not from a spectrum. Mixing hues (the earlier cyan/violet/rose version) reads
 * as a different effect altogether.
 *
 * Light mode paints sky blue onto near-white. Dark mode keeps the same hue but
 * drops it to roughly a third of the alpha: over #0a0a0a the ribbons have to
 * read as a glow, and anything near the light-mode alpha turns the page navy.
 */
const PALETTES = {
  light: { rgb: [96, 178, 235], alphas: [0.3, 0.4, 0.36] },
  dark: { rgb: [56, 140, 210], alphas: [0.13, 0.18, 0.16] },
} as const;

/**
 * Backing-store scale, as a fraction of CSS pixels — deliberately NOT keyed to
 * devicePixelRatio.
 *
 * The ribbons are enormous, low-frequency and translucent, so a fifth-resolution
 * buffer upscaled by the compositor is indistinguishable from a full-resolution
 * one once the wrapper's blur lands on top, at a twenty-fifth of the fill cost.
 */
const RENDER_SCALE = 0.2;
/** Redraw rate. The drift is slow enough that 24fps reads as continuous. */
const MAX_FPS = 24;
/** Elapsed time the single static frame is drawn at (reduced motion / touch). */
const SETTLED_TIME = 8;
/** Horizontal sampling pitch, in backing-store pixels. */
const STEP = 4;

/**
 * Flowing sky-blue ribbons on a 2D canvas — the site's ambient background.
 *
 * This is mounted ONCE, fixed to the viewport, in the root layout. It is
 * deliberately not per-section: a copy per section meant every section boundary
 * carried a seam where one instance's bloom faded out and the next one's began.
 * Sections are transparent and let this single layer show through instead.
 *
 * Behaviour contract (the house canvas contract, as in `DotMatrix`):
 * - Reduced motion → one settled frame is drawn, then the loop never runs.
 * - Coarse pointers → likewise static. This is a blurred, full-bleed layer whose
 *   contents change every frame; re-rasterising that during scroll is exactly
 *   what a phone cannot spare, and the ribbons read as ambient colour whether or
 *   not they move.
 * - The loop pauses while the tab is hidden.
 * - Follows `data-theme` live, so a theme toggle repaints without a remount.
 * - Purely decorative, so the canvas is hidden from assistive tech.
 */
export function GradientWave(props: IGradientWaveProps) {
  /* ---------------------------------- Props --------------------------------- */
  const { intensity = 1, speed = 1, className } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let start = 0;
    let lastDraw = 0;
    let w = 0;
    let h = 0;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarseMq = window.matchMedia("(pointer: coarse)");
    /** True when this instance should render a single frame and never loop. */
    const isStatic = () => reduceMq.matches || coarseMq.matches;

    /* Resolved once per theme change rather than per frame — building rgba()
       strings on a hot canvas path is exactly the waste `DotMatrix` hoists. */
    let fills: string[] = [];

    const buildFills = () => {
      const theme =
        document.documentElement.dataset.theme === "light" ? "light" : "dark";
      const { rgb, alphas } = PALETTES[theme];
      fills = alphas.map(
        (a) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a * intensity})`,
      );
    };

    /** The ribbon's edge at `x`: two sines beating against each other, so the
     *  sweep never repeats on an obvious period. */
    const edge = (
      x: number,
      offset: number,
      amp: number,
      freq: number,
      t: number,
      phase: number,
    ) => {
      const nx = (x / w) * Math.PI * 2;
      return (
        h * offset +
        Math.sin(nx * freq + t + phase) * h * amp +
        Math.sin(nx * freq * 1.7 - t * 1.3 + phase) * h * amp * 0.4
      );
    };

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, w, h);
      if (!fills.length) return;

      for (let i = 0; i < RIBBONS.length; i++) {
        const { top, thickness, amp, freq, speed: rs, phase } = RIBBONS[i];
        const t = elapsed * rs * speed * Math.PI * 2;

        ctx.beginPath();
        // Leading edge, left to right...
        for (let x = 0; x <= w; x += STEP) {
          const y = edge(x, top, amp, freq, t, phase);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        // ...then the trailing edge back, right to left. The two run at
        // slightly different phases so the ribbon's width breathes across the
        // frame instead of tracing a constant-thickness stripe.
        for (let x = w; x >= 0; x -= STEP) {
          ctx.lineTo(
            x,
            edge(x, top + thickness, amp * 0.8, freq, t * 1.15, phase + 1.1),
          );
        }
        ctx.closePath();
        ctx.fillStyle = fills[i];
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      if (!start) start = now;
      if (now - lastDraw >= 1000 / MAX_FPS) {
        lastDraw = now;
        draw((now - start) / 1000);
      }
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running || isStatic()) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
      start = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      w = Math.max(1, Math.floor(rect.width * RENDER_SCALE));
      h = Math.max(1, Math.floor(rect.height * RENDER_SCALE));
      canvas.width = w;
      canvas.height = h;
      // A static instance never reaches the loop, so repaint its frame here.
      if (isStatic()) draw(SETTLED_TIME);
    };

    buildFills();
    resize();
    if (isStatic()) draw(SETTLED_TIME);
    else play();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // No IntersectionObserver here, unlike the per-section canvases this
    // replaced: the layer is fixed to the viewport, so it is always on screen
    // and an observer would only ever report `isIntersecting`.
    const onVisibility = () => {
      if (document.hidden) pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onMediaChange = () => {
      pause();
      if (isStatic()) draw(SETTLED_TIME);
      else play();
    };
    reduceMq.addEventListener("change", onMediaChange);
    coarseMq.addEventListener("change", onMediaChange);

    // The theme toggle rewrites `data-theme` on <html> without remounting this
    // subtree, so the palette has to be re-read from the DOM rather than from a
    // prop. A static instance also needs its one frame redrawn.
    const themeObserver = new MutationObserver(() => {
      buildFills();
      if (isStatic()) draw(SETTLED_TIME);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      pause();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onMediaChange);
      coarseMq.removeEventListener("change", onMediaChange);
    };
  }, [intensity, speed]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className ?? ""}`}
    >
      {/* The blur is what turns the polygon edges into the reference's soft
          ribbon boundaries. It stays modest — a heavy blur washes the ribbons
          into one flat tint and loses the white space between them, which is
          most of the effect. `scale-110` hides the transparent fringe a blur
          pulls in from outside the element's edges. */}
      <canvas
        ref={canvasRef}
        className="block h-full w-full scale-110 blur-[22px]"
      />
    </div>
  );
}
