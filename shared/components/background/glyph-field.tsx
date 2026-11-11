"use client";

import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";

import { useEffect, useRef } from "react";

/** Density ramp, sparse to dense. Index 0 (space) is never drawn. */
const RAMP = " .,:;-~=+*o%#@";
/** What the field "decrypts" into under the cursor. */
const SCRAMBLE = "01{}[]<>/\\=+*#$%&@?!";
const GLYPHS = Array.from(new Set((RAMP + SCRAMBLE).replace(/ /g, "")));
const GLYPH_INDEX = new Map(GLYPHS.map((glyph, index) => [glyph, index]));
const RAMP_INDEX = Array.from(RAMP).map(
  (glyph) => GLYPH_INDEX.get(glyph) ?? -1,
);
const SCRAMBLE_INDEX = Array.from(SCRAMBLE).map(
  (glyph) => GLYPH_INDEX.get(glyph) ?? -1,
);

const HOVER_RADIUS = 170;
/** Per-frame retention of cursor heat, so the cursor leaves a fading wake. */
const HEAT_DECAY = 0.9;
/** The field drifts at a fraction of scroll speed, so it reads as depth. */
const SCROLL_PARALLAX = 0.18;

interface Grid {
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
  /** Per-column visibility: quieter behind the centred content column. */
  columnWeight: Float32Array;
  heat: Float32Array;
  ridgeA: Float32Array;
  ridgeB: Float32Array;
}

function readTheme() {
  const root = getComputedStyle(document.documentElement);
  return {
    ink: root.getPropertyValue("--foreground").trim() || "#141413",
    accent: root.getPropertyValue("--brand-pixel").trim() || "#d97757",
    font:
      root.getPropertyValue("--font-jetbrains").trim() ||
      "ui-monospace, SFMono-Regular, Menlo, monospace",
    dark: document.documentElement.dataset.theme === "dark",
  };
}

/** Every glyph pre-rendered once per colour, so each frame is pure blits. */
function buildAtlas(
  cellW: number,
  cellH: number,
  dpr: number,
  theme: ReturnType<typeof readTheme>,
) {
  const atlas = document.createElement("canvas");
  atlas.width = Math.ceil(GLYPHS.length * cellW * dpr);
  atlas.height = Math.ceil(cellH * 2 * dpr);
  const context = atlas.getContext("2d");
  if (!context) return null;

  context.scale(dpr, dpr);
  context.font = `500 ${Math.round(cellH * 0.66)}px ${theme.font}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  [theme.ink, theme.accent].forEach((colour, row) => {
    context.fillStyle = colour;
    GLYPHS.forEach((glyph, index) => {
      context.fillText(
        glyph,
        index * cellW + cellW / 2,
        row * cellH + cellH / 2,
      );
    });
  });
  return atlas;
}

/** Cheap deterministic hash for the scramble flicker. */
function hash(value: number) {
  const x = Math.sin(value * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * A field of monospace glyphs across the page background — the Codex-style
 * ASCII texture, drawn with Canvas 2D rather than WebGL so it costs no extra
 * dependency.
 *
 * Two folded ribbons carry fine contour bands, with coral catching the
 * crests and a quieter centre keeping text legible. The field drifts at parallax speed
 * with the scroll. Near the cursor, glyphs light up in the brand colour and
 * scramble into code characters, leaving a wake that fades behind it.
 *
 * Cost control: glyphs are blitted from a pre-rendered atlas, empty cells are
 * skipped, the loop is capped at 24fps (12 on touch devices), and requestAnimationFrame
 * pauses in background tabs. Reduced motion renders one still frame.
 */
export function GlyphField() {
  const reduceMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const frameInterval = 1000 / (finePointer ? 24 : 12);

    let theme = readTheme();
    let dpr = 1;
    let atlas: HTMLCanvasElement | null = null;
    let grid: Grid | null = null;
    let frame = 0;
    let lastFrame = 0;
    let previousDraw = 0;
    let disposed = false;
    let ready = false;
    // Pointer target and its eased follower, in CSS px.
    let targetX = -9999;
    let targetY = -9999;
    let pointerX = -9999;
    let pointerY = -9999;

    const layout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, finePointer ? 2 : 1.25);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const compact = width < 640;
      const cellW = compact ? 12 : 10;
      const cellH = compact ? 18 : 16;
      const cols = Math.ceil(width / cellW);
      const rows = Math.ceil(height / cellH);

      const columnWeight = new Float32Array(cols);
      for (let col = 0; col < cols; col++) {
        const fromCentre = Math.abs(col / (cols - 1) - 0.5) * 2;
        columnWeight[col] = 0.24 + 0.76 * Math.pow(fromCentre, 1.3);
      }

      grid = {
        cols,
        rows,
        cellW,
        cellH,
        columnWeight,
        heat: new Float32Array(cols * rows),
        ridgeA: new Float32Array(cols),
        ridgeB: new Float32Array(cols),
      };
      atlas = buildAtlas(cellW, cellH, dpr, theme);
    };

    const draw = (now: number) => {
      if (!grid || !atlas) return;
      const { cols, rows, cellW, cellH, columnWeight, heat, ridgeA, ridgeB } =
        grid;
      const time = reduceMotion ? 0 : now / 1000;
      const elapsed = previousDraw
        ? Math.min(now - previousDraw, 100)
        : frameInterval;
      previousDraw = now;
      const retention = Math.pow(HEAT_DECAY, elapsed / (1000 / 30));
      const scrollRows = (window.scrollY * SCROLL_PARALLAX) / cellH;
      const baseAlpha = theme.dark ? 0.22 : 0.23;
      const srcW = cellW * dpr;
      const srcH = cellH * dpr;
      const scrambleTick = Math.floor(time * 14);

      const ease = 1 - Math.pow(0.65, elapsed / (1000 / 30));
      pointerX += (targetX - pointerX) * ease;
      pointerY += (targetY - pointerY) * ease;

      // Warp each column once per frame, rather than repeating it per glyph.
      for (let col = 0; col < cols; col++) {
        const x = col / cols - 0.5;
        ridgeA[col] =
          x * 2.4 + Math.sin(x * 5.1 + time * 0.13) * 1.2 - time * 0.11;
        ridgeB[col] =
          -x * 3.1 + Math.cos(x * 4.2 - time * 0.1) * 1.1 + time * 0.09 + 2.1;
      }

      context.clearRect(0, 0, cols * cellW, rows * cellH);

      for (let row = 0; row < rows; row++) {
        const y = row + scrollRows;
        const cy = row * cellH + cellH / 2;
        const dy = cy - pointerY;

        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;

          // Cursor heat: the lens, plus a decaying wake.
          let warmth = finePointer ? heat[index] * retention : 0;
          if (Math.abs(dy) < HOVER_RADIUS) {
            const dx = col * cellW + cellW / 2 - pointerX;
            if (Math.abs(dx) < HOVER_RADIUS) {
              const reach = 1 - Math.sqrt(dx * dx + dy * dy) / HOVER_RADIUS;
              if (reach > warmth) warmth = reach * reach * (3 - 2 * reach);
            }
          }
          heat[index] = warmth;

          let glyph: number;
          let alpha: number;
          let tone: number;
          let offsetX = 0;
          let offsetY = 0;

          if (warmth > 0.08) {
            const pick = hash(index * 7.13 + scrambleTick);
            glyph = SCRAMBLE_INDEX[Math.floor(pick * SCRAMBLE_INDEX.length)];
            // Capped well below opaque: the lens passes behind body text.
            alpha = (0.08 + warmth * 0.3) * (0.5 + columnWeight[col] * 0.5);
            const dx = col * cellW + cellW / 2 - pointerX;
            const distance = Math.hypot(dx, dy) || 1;
            offsetX = (dx / distance) * warmth * 6;
            offsetY = (dy / distance) * warmth * 6;
            tone = 1;
          } else {
            // Two folded ribbons repeat vertically, so scrolling reveals a
            // continuous field. Narrow contour bands describe their surfaces.
            const depth = y / rows;
            const distanceA = Math.abs(Math.sin(depth * 6.2 + ridgeA[col]));
            const distanceB = Math.abs(Math.sin(depth * 5.4 + ridgeB[col]));
            const surfaceA = Math.exp(-distanceA * distanceA * 10);
            const surfaceB = Math.exp(-distanceB * distanceB * 10) * 0.82;
            const ribbon = Math.max(surfaceA, surfaceB);
            if (ribbon < 0.035) continue;
            const distance = surfaceA > surfaceB ? distanceA : distanceB;
            const contour = Math.pow(
              0.5 + 0.5 * Math.cos(distance * 34 - time * 0.25),
              12,
            );
            const density = Math.min(1, ribbon * (0.26 + contour * 0.7));
            const step =
              1 +
              Math.min(
                RAMP.length - 2,
                Math.floor(density * (RAMP.length - 1)),
              );
            glyph = RAMP_INDEX[step];
            tone = contour > 0.5 && ribbon > 0.4 ? 1 : 0;
            alpha = baseAlpha * (0.22 + density * 0.78) * columnWeight[col];
            if (tone === 1) alpha *= 1.35;
          }

          context.globalAlpha = alpha;
          context.drawImage(
            atlas,
            glyph * srcW,
            tone * srcH,
            srcW,
            srcH,
            col * cellW + offsetX,
            row * cellH + offsetY,
            cellW,
            cellH,
          );
        }
      }
      context.globalAlpha = 1;
    };

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;
      draw(now);
    };

    const start = () => {
      if (disposed) return;
      layout();
      ready = true;
      cancelAnimationFrame(frame);
      if (reduceMotion) draw(0);
      else if (!document.hidden) frame = requestAnimationFrame(loop);
    };

    // Measure glyphs in the real monospace face, not a fallback.
    const fontReady =
      document.fonts?.load(`500 12px ${theme.font}`) ?? Promise.resolve();
    fontReady.then(start, start);

    const onResize = () => {
      layout();
      if (reduceMotion) draw(0);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      // Jump instead of easing in from off-screen on the first move.
      if (pointerX < -999) {
        pointerX = targetX;
        pointerY = targetY;
      }
    };

    const onPointerLeave = () => {
      targetX = targetY = pointerX = pointerY = -9999;
    };

    // Re-ink the atlas when the theme flips.
    const themeObserver = new MutationObserver(() => {
      theme = readTheme();
      if (grid) atlas = buildAtlas(grid.cellW, grid.cellH, dpr, theme);
      if (reduceMotion) draw(0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const onVisibilityChange = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousDraw = lastFrame = 0;
      if (ready && !document.hidden && !reduceMotion && !disposed)
        frame = requestAnimationFrame(loop);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onPointerLeave);
    if (finePointer && !reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onPointerLeave);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener(
        "pointerleave",
        onPointerLeave,
      );
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} aria-hidden className="ambient-glyphs" />;
}
