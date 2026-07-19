"use client";

import { useEffect, useRef } from "react";

interface IDotMatrixProps {
  /** Dot colours as `[r, g, b]` triples; each cell picks one deterministically. */
  colors?: number[][];
  /** Alpha pool the twinkle samples from. */
  opacities?: number[];
  /** Grid pitch in CSS pixels — distance between dot origins. */
  gap?: number;
  /** Dot edge length in CSS pixels. */
  dotSize?: number;
  /** 0.1 slower → 1.0 faster. Scales the intro sweep. */
  animationSpeed?: number;
  className?: string;
}

/** Seconds each cell holds an alpha before resampling. */
const TWINKLE_PERIOD = 5;
/** Redraw rate — the twinkle is random, so a low rate reads the same and costs less. */
const MAX_FPS = 15;
/** Elapsed time the static (reduced-motion) frame is drawn at, past the intro sweep. */
const SETTLED_TIME = 10;

/** Cheap deterministic hash → [0, 1). Stable per cell so dots don't crawl. */
function rand(x: number, y: number, seed: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Animated dot-matrix rendered on a 2D canvas — dots fade in from the centre
 * outward, then twinkle by resampling their alpha on a slow cycle.
 *
 * Behaviour contract (mirrors HeroBackground):
 * - Reduced motion → one settled frame is drawn, then the loop never runs.
 * - The loop pauses while offscreen or the tab is hidden.
 * - Rendering is capped at 2× devicePixelRatio and {@link MAX_FPS}.
 * - Purely decorative, so the canvas is hidden from assistive tech.
 */
export function DotMatrix(props: IDotMatrixProps) {
  /* ---------------------------------- Props --------------------------------- */
  const {
    colors = [[34, 211, 238]],
    opacities = [0.1, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.6],
    gap = 10,
    dotSize = 2,
    animationSpeed = 0.6,
    className,
  } = props;

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
    let visible = true;
    let start = 0;
    let lastDraw = 0;
    let w = 0;
    let h = 0;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Every rgba() string we can ever need, indexed [colour][alpha]. Assigning
       fillStyle parses the string, so building these per cell per frame cost
       ~80ms on a tall section; hoisting them makes the draw ~13× cheaper. */
    const styles = colors.map((c) =>
      opacities.map((a) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`),
    );

    /* Per-cell geometry that never changes with time — rebuilt only on resize. */
    let cellX = new Float32Array(0);
    let cellY = new Float32Array(0);
    let cellIntro = new Float32Array(0);
    let cellShow = new Float32Array(0);
    let cellColor = new Uint8Array(0);

    /* One reusable scratch list per (colour, alpha) pair, so a draw sets
       fillStyle once per style instead of once per dot. */
    const buckets: number[][] = Array.from(
      { length: colors.length * opacities.length },
      () => [],
    );

    const buildCells = () => {
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const n = cols * rows;
      cellX = new Float32Array(n);
      cellY = new Float32Array(n);
      cellIntro = new Float32Array(n);
      cellShow = new Float32Array(n);
      cellColor = new Uint8Array(n);

      // Centre the grid so leftover space is split evenly on both edges.
      const offsetX = (w - (cols - 1) * gap) / 2;
      const offsetY = (h - (rows - 1) * gap) / 2;
      const cx = (cols - 1) / 2;
      const cy = (rows - 1) / 2;
      const maxDist = Math.hypot(cx, cy) || 1;

      let k = 0;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++, k++) {
          const showOffset = rand(i, j, 0);
          cellX[k] = offsetX + i * gap;
          cellY[k] = offsetY + j * gap;
          cellShow[k] = showOffset;
          // Cells farther from centre reveal later, jittered so the wavefront
          // reads organic rather than as a clean ring.
          cellIntro[k] =
            (Math.hypot(i - cx, j - cy) / maxDist) * 0.6 + showOffset * 0.3;
          cellColor[k] = Math.floor(showOffset * colors.length) % colors.length;
        }
      }
    };

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, w, h);

      const swept = elapsed * animationSpeed;
      const alphaCount = opacities.length;
      for (let b = 0; b < buckets.length; b++) buckets[b].length = 0;

      for (let k = 0; k < cellX.length; k++) {
        if (swept < cellIntro[k]) continue;

        const bucket = Math.floor(elapsed / TWINKLE_PERIOD + cellShow[k]);
        const ai =
          Math.floor(rand(cellX[k], cellY[k], bucket + 1) * alphaCount) %
          alphaCount;
        if (opacities[ai] <= 0) continue;

        const list = buckets[cellColor[k] * alphaCount + ai];
        list.push(cellX[k], cellY[k]);
      }

      for (let b = 0; b < buckets.length; b++) {
        const list = buckets[b];
        if (!list.length) continue;
        ctx.fillStyle =
          styles[Math.floor(b / alphaCount)][b % alphaCount];
        for (let k = 0; k < list.length; k += 2) {
          ctx.fillRect(list[k], list[k + 1], dotSize, dotSize);
        }
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      if (!start) start = now;
      // Throttle: the twinkle resamples slowly, so drawing every frame is waste.
      if (now - lastDraw >= 1000 / MAX_FPS) {
        lastDraw = now;
        draw((now - start) / 1000);
      }
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running || reduceMq.matches || !visible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
      // Drop the origin so the intro replays from scratch on resume.
      start = 0;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildCells();
      // Reduced motion never animates, so repaint its single frame on resize.
      if (reduceMq.matches) draw(SETTLED_TIME);
    };

    resize();

    if (reduceMq.matches) {
      draw(SETTLED_TIME);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) play();
        else pause();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onMotionChange = () => {
      pause();
      if (reduceMq.matches) draw(SETTLED_TIME);
      else play();
    };
    reduceMq.addEventListener("change", onMotionChange);

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onMotionChange);
    };
  }, [colors, opacities, gap, dotSize, animationSpeed]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block h-full w-full ${className ?? ""}`}
    />
  );
}
