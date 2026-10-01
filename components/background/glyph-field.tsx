"use client";

import { useEffect, useRef } from "react";

/* --------------------------------- Glyphs ---------------------------------- */
/** Density ramp, sparse to dense. Index 0 (space) is never drawn. */
const RAMP = " .,:;-~=+*o%#@";
/** What the field "decrypts" into under the cursor. */
const SCRAMBLE = "01{}[]<>/\\=+*#$%&@?!";
const GLYPHS = Array.from(new Set((RAMP + SCRAMBLE).replace(/ /g, "")));
const GLYPH_INDEX = new Map(GLYPHS.map((glyph, index) => [glyph, index]));
const RAMP_INDEX = Array.from(RAMP).map((glyph) => GLYPH_INDEX.get(glyph) ?? -1);
const SCRAMBLE_INDEX = Array.from(SCRAMBLE).map((glyph) => GLYPH_INDEX.get(glyph) ?? -1);

/* -------------------------------- Tuning ----------------------------------- */
const HOVER_RADIUS = 170;
/** Per-frame retention of cursor heat, so the cursor leaves a fading wake. */
const HEAT_DECAY = 0.9;
/** The field drifts at a fraction of scroll speed, so it reads as depth. */
const SCROLL_PARALLAX = 0.35;

interface IGrid {
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
  /** Per-column visibility: quieter behind the centred content column. */
  columnWeight: Float32Array;
  heat: Float32Array;
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
      context.fillText(glyph, index * cellW + cellW / 2, row * cellH + cellH / 2);
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
 * Density comes from slow, domain-warped sine waves (a "plasma"), so the
 * characters thicken and thin like weather. The field drifts at parallax speed
 * with the scroll. Near the cursor, glyphs light up in the brand colour and
 * scramble into code characters, leaving a wake that fades behind it.
 *
 * Cost control: glyphs are blitted from a pre-rendered atlas, empty cells are
 * skipped, the loop is capped at 30fps (20 on touch devices), and requestAnimationFrame
 * pauses in background tabs. Reduced motion renders one still frame.
 */
export function GlyphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frameInterval = 1000 / (finePointer ? 30 : 20);

    let theme = readTheme();
    let dpr = 1;
    let atlas: HTMLCanvasElement | null = null;
    let grid: IGrid | null = null;
    let frame = 0;
    let lastFrame = 0;
    let disposed = false;
    // Pointer target and its eased follower, in CSS px.
    let targetX = -9999;
    let targetY = -9999;
    let pointerX = -9999;
    let pointerY = -9999;

    const layout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const compact = width < 640;
      const cellW = compact ? 11 : 12;
      const cellH = compact ? 17 : 18;
      const cols = Math.ceil(width / cellW);
      const rows = Math.ceil(height / cellH);

      const columnWeight = new Float32Array(cols);
      for (let col = 0; col < cols; col++) {
        const fromCentre = Math.abs(col / (cols - 1) - 0.5) * 2;
        columnWeight[col] = 0.45 + 0.55 * Math.pow(fromCentre, 1.6);
      }

      grid = { cols, rows, cellW, cellH, columnWeight, heat: new Float32Array(cols * rows) };
      atlas = buildAtlas(cellW, cellH, dpr, theme);
    };

    const draw = (now: number) => {
      if (!grid || !atlas) return;
      const { cols, rows, cellW, cellH, columnWeight, heat } = grid;
      const time = reduceMotion ? 0 : now / 1000;
      const scrollRows = (window.scrollY * SCROLL_PARALLAX) / cellH;
      const baseAlpha = theme.dark ? 0.11 : 0.15;
      const srcW = cellW * dpr;
      const srcH = cellH * dpr;
      const scrambleTick = Math.floor(time * 14);

      pointerX += (targetX - pointerX) * 0.35;
      pointerY += (targetY - pointerY) * 0.35;

      context.clearRect(0, 0, cols * cellW, rows * cellH);

      for (let row = 0; row < rows; row++) {
        const y = row + scrollRows;
        const cy = row * cellH + cellH / 2;
        const dy = cy - pointerY;

        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;

          // Cursor heat: the lens, plus a decaying wake.
          let warmth = heat[index] * HEAT_DECAY;
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

          if (warmth > 0.08) {
            const pick = hash(index * 7.13 + scrambleTick);
            glyph = SCRAMBLE_INDEX[Math.floor(pick * SCRAMBLE_INDEX.length)];
            // Capped well below opaque: the lens passes behind body text.
            alpha = 0.1 + warmth * 0.48;
            tone = 1;
          } else {
            // Domain-warped plasma, roughly in [-3, 3].
            const x = col;
            const wave =
              Math.sin(x * 0.085 + time * 0.32 + Math.sin(y * 0.07 + time * 0.2) * 1.8) +
              Math.sin(y * 0.11 - time * 0.26 + Math.sin(x * 0.05 - time * 0.15) * 1.5) +
              Math.sin((x + y) * 0.045 + time * 0.21);
            // Keep only the upper part of the range, so the field stays sparse.
            const density = ((wave / 3 + 1) / 2 - 0.42) / 0.58;
            if (density <= 0) continue;
            const step = 1 + Math.min(RAMP.length - 2, Math.floor(density * (RAMP.length - 1)));
            glyph = RAMP_INDEX[step];
            alpha = baseAlpha * (0.35 + density * 0.65) * columnWeight[col];
            tone = 0;
          }

          context.globalAlpha = alpha;
          context.drawImage(
            atlas,
            glyph * srcW,
            tone * srcH,
            srcW,
            srcH,
            col * cellW,
            row * cellH,
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
      if (reduceMotion) draw(0);
      else frame = requestAnimationFrame(loop);
    };

    // Measure glyphs in the real monospace face, not a fallback.
    const fontReady = document.fonts?.load(`500 12px ${theme.font}`) ?? Promise.resolve();
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

    window.addEventListener("resize", onResize);
    if (finePointer && !reduceMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      themeObserver.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="ambient-glyphs" />;
}
