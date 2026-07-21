"use client";

import { useEffect, useRef, useState } from "react";

interface IPixelRippleProps {
  /**
   * Whether the ripple is playing. Drive this from the host card's hover /
   * focus state — the canvas has no pointer handlers of its own so it can sit
   * under the card's content without ever intercepting events.
   */
  active: boolean;
  /** Grid pitch in CSS pixels — distance between pixel origins. */
  gap?: number;
  /** Shimmer rate, 1–100. Higher oscillates faster once a pixel is grown. */
  speed?: number;
  className?: string;
}

/** Largest edge length a pixel reaches, in CSS pixels. Also the cell box. */
const MAX_DOT = 2.4;
/** Smallest edge length the shimmer dips to before reversing. */
const MIN_DOT = 0.5;
/** Edge length removed per frame while fading out. */
const FADE_STEP = 0.12;
/** Alpha pool — each cell holds one for its lifetime, so the grid reads varied. */
const ALPHAS = [0.35, 0.55, 0.8, 1];
/** Redraw rate. This is an interactive hover, so it wants real frames. */
const MAX_FPS = 60;

/**
 * How long to keep a ripple canvas mounted after the pointer leaves — long
 * enough for the drain to finish. The wipe takes ~20 frames (MAX_DOT /
 * FADE_STEP), so this is generous.
 */
const DRAIN_MS = 600;

/**
 * Hover state for a card that hosts a {@link PixelRipple}, with the canvas
 * mounted only while it is needed.
 *
 * The caller (the skills marquee) sits inside a `MarqueeTrack`, which
 * duplicates its children many times over — hundreds of badges per row — so
 * rendering a canvas into every one of them would allocate hundreds of pixel
 * grids for the sake of the single badge a pointer can actually be over.
 *
 * `mounted` stays true for {@link DRAIN_MS} past the pointer leaving so the
 * fade-out can play, and re-entering within that window keeps the existing
 * canvas rather than tearing down and rebuilding its cells.
 *
 * Spread `hoverProps` onto the card, gate the canvas on `mounted`, and pass
 * `hovered` as the ripple's `active`.
 */
export function useRippleHover() {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  /* Mounting happens in the enter handler; this effect only owns the unmount,
     which is genuinely deferred work rather than a render-time derivation. */
  useEffect(() => {
    if (hovered || !mounted) return;
    const timer = window.setTimeout(() => setMounted(false), DRAIN_MS);
    return () => window.clearTimeout(timer);
  }, [hovered, mounted]);

  return {
    hovered,
    mounted,
    hoverProps: {
      onPointerEnter: () => {
        setMounted(true);
        setHovered(true);
      },
      onPointerLeave: () => setHovered(false),
    },
  };
}

/** Cheap deterministic hash → [0, 1). Stable per cell so the grid never crawls. */
function rand(x: number, y: number, seed: number) {
  const s = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Reads whatever `--pixel-color` resolves to and hands back `[r, g, b]`.
 *
 * Assigning to `fillStyle` makes the canvas parse and normalise the value for
 * us, which is why this takes a context: it means the custom property can hold
 * any CSS colour form (hex, `rgb()`, a named colour) without this file owning a
 * colour parser. An unparseable value leaves `fillStyle` at the sentinel, so
 * the mid-grey fallback below is what a typo produces rather than a crash.
 */
function resolveRgb(
  ctx: CanvasRenderingContext2D,
  raw: string,
): [number, number, number] {
  ctx.fillStyle = "#888888";
  ctx.fillStyle = raw.trim() || "#888888";
  const value = ctx.fillStyle as string;

  if (value.startsWith("#")) {
    const n = parseInt(value.slice(1, 7), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  // Canvas normalises anything with alpha to `rgba(r, g, b, a)`.
  const parts = value.match(/[\d.]+/g);
  if (parts && parts.length >= 3) {
    return [Number(parts[0]), Number(parts[1]), Number(parts[2])];
  }
  return [136, 136, 136];
}

/**
 * A grid of pixels that ripples outward from the centre when {@link active}
 * turns on, shimmers while it stays on, and drains away when it turns off.
 * Colour comes from the `--pixel-color` custom property on the canvas, so a
 * host card can retint it per theme in CSS without this component tracking
 * the theme itself.
 *
 * Behaviour contract (the house canvas contract):
 * - Reduced motion → one settled frame on activate, cleared on deactivate.
 * - The loop only ever runs while active, and stops once every pixel is gone.
 * - Cells are allocated on first activation, not on mount, so a page holding
 *   dozens of these pays nothing for the ones that are never hovered.
 * - Rendering is capped at 2× devicePixelRatio and {@link MAX_FPS}.
 * - Purely decorative, so the canvas is hidden from assistive tech.
 */
export function PixelRipple(props: IPixelRippleProps) {
  /* ---------------------------------- Props --------------------------------- */
  const { active, gap = 6, speed = 35, className } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* The effect below is set up once and then driven imperatively; this ref is
     how the `active` prop reaches it without tearing down the cell arrays on
     every hover. */
  const setActiveRef = useRef<(next: boolean) => void>(() => {});

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let isActive = false;
    let built = false;
    let lastDraw = 0;
    let w = 0;
    let h = 0;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const shimmerRate = Math.min(Math.max(speed, 1), 100) * 0.001;

    /* Per-cell constants — rebuilt only when the box resizes. */
    let cellX = new Float32Array(0);
    let cellY = new Float32Array(0);
    let cellDelay = new Float32Array(0);
    let cellStep = new Float32Array(0);
    let cellMax = new Float32Array(0);
    let cellGrow = new Float32Array(0);
    let cellShimmer = new Float32Array(0);
    let cellAlpha = new Uint8Array(0);

    /* Per-cell mutable state — where each pixel is in its life right now. */
    let size = new Float32Array(0);
    let counter = new Float32Array(0);
    /* bit 0 = has finished growing, bit 1 = shimmer is currently shrinking. */
    let flags = new Uint8Array(0);

    /* One reusable scratch list per alpha, so a draw sets fillStyle four times
       instead of once per pixel. Each entry is a flat (x, y, size) triple. */
    const buckets: number[][] = ALPHAS.map(() => []);
    let styles: string[] = [];

    const readStyles = () => {
      const raw = getComputedStyle(canvas).getPropertyValue("--pixel-color");
      const [r, g, b] = resolveRgb(ctx, raw);
      styles = ALPHAS.map((a) => `rgba(${r}, ${g}, ${b}, ${a})`);
    };

    const buildCells = () => {
      const cols = Math.ceil(w / gap);
      const rows = Math.ceil(h / gap);
      const n = Math.max(cols * rows, 0);

      cellX = new Float32Array(n);
      cellY = new Float32Array(n);
      cellDelay = new Float32Array(n);
      cellStep = new Float32Array(n);
      cellMax = new Float32Array(n);
      cellGrow = new Float32Array(n);
      cellShimmer = new Float32Array(n);
      cellAlpha = new Uint8Array(n);
      size = new Float32Array(n);
      counter = new Float32Array(n);
      flags = new Uint8Array(n);

      const cx = w / 2;
      const cy = h / 2;
      /* The wave is paced against the diagonal so cards of different sizes all
         finish their sweep in roughly the same time. */
      const spread = Math.hypot(cx, cy) || 1;

      let k = 0;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++, k++) {
          const x = i * gap;
          const y = j * gap;
          const a = rand(i, j, 1);
          const b = rand(i, j, 2);

          cellX[k] = x;
          cellY[k] = y;
          // Distance from centre, normalised — this is what makes it ripple.
          cellDelay[k] = Math.hypot(x - cx, y - cy) / spread;
          // Jittered per cell so the wavefront reads organic, not as a clean ring.
          cellStep[k] = 0.04 + a * 0.03;
          cellMax[k] = MIN_DOT + b * (MAX_DOT - MIN_DOT);
          cellGrow[k] = 0.08 + a * 0.3;
          cellShimmer[k] = (0.1 + b * 0.8) * shimmerRate;
          cellAlpha[k] = Math.floor(a * ALPHAS.length) % ALPHAS.length;
        }
      }

      built = true;
    };

    /** Advances every pixel one frame and paints. Returns true once all are idle. */
    const step = (grow: boolean) => {
      ctx.clearRect(0, 0, w, h);
      for (let b = 0; b < buckets.length; b++) buckets[b].length = 0;

      let idle = true;

      for (let k = 0; k < size.length; k++) {
        if (grow) {
          // Burn down the delay first — near-centre cells clear it immediately.
          if (counter[k] <= cellDelay[k]) {
            counter[k] += cellStep[k];
            idle = false;
            continue;
          }
          if (size[k] >= cellMax[k]) flags[k] |= 1;

          if (flags[k] & 1) {
            // Grown: oscillate between MIN_DOT and this cell's max, forever.
            if (size[k] >= cellMax[k]) flags[k] |= 2;
            else if (size[k] <= MIN_DOT) flags[k] &= ~2;
            size[k] += flags[k] & 2 ? -cellShimmer[k] : cellShimmer[k];
          } else {
            size[k] += cellGrow[k];
          }
          idle = false;
        } else {
          counter[k] = 0;
          flags[k] = 0;
          if (size[k] <= 0) {
            size[k] = 0;
            continue;
          }
          size[k] -= FADE_STEP;
          idle = false;
        }

        if (size[k] > 0) {
          buckets[cellAlpha[k]].push(cellX[k], cellY[k], size[k]);
        }
      }

      for (let b = 0; b < buckets.length; b++) {
        const list = buckets[b];
        if (!list.length) continue;
        ctx.fillStyle = styles[b];
        for (let i = 0; i < list.length; i += 3) {
          // Keep each pixel centred in its cell as it scales.
          const inset = (MAX_DOT - list[i + 2]) * 0.5;
          ctx.fillRect(
            list[i] + inset,
            list[i + 1] + inset,
            list[i + 2],
            list[i + 2],
          );
        }
      }

      return idle;
    };

    const loop = (now: number) => {
      if (!running) return;
      if (now - lastDraw >= 1000 / MAX_FPS) {
        lastDraw = now;
        // Growing never settles (the shimmer is perpetual), so only the drain
        // can end the loop.
        if (step(isActive) && !isActive) {
          running = false;
          return;
        }
      }
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running) return;
      running = true;
      lastDraw = 0;
      raf = requestAnimationFrame(loop);
    };

    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    /** Paints every pixel at full size in one shot — the reduced-motion state. */
    const drawSettled = () => {
      for (let k = 0; k < size.length; k++) {
        size[k] = cellMax[k];
        counter[k] = cellDelay[k] + 1;
        flags[k] = 1;
      }
      step(true);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      if (rect.width === w && rect.height === h) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Only pay for cells if this card has actually been interacted with.
      if (built) buildCells();
    };

    setActiveRef.current = (next: boolean) => {
      isActive = next;

      if (next) {
        // Colours are resolved per activation, so a theme swap is picked up on
        // the next hover without this component subscribing to the theme.
        readStyles();
        if (!built) {
          resize();
          buildCells();
        }
        if (reduceMq.matches) {
          pause();
          drawSettled();
          return;
        }
        play();
        return;
      }

      if (!built) return;
      if (reduceMq.matches) {
        pause();
        ctx.clearRect(0, 0, w, h);
        return;
      }
      play();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // A hidden tab keeps rAF parked; make sure we don't resume mid-drain.
    const onVisibility = () => {
      if (document.hidden) pause();
      else if (built && isActive && !reduceMq.matches) play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      setActiveRef.current = () => {};
    };
  }, [gap, speed]);

  useEffect(() => {
    setActiveRef.current(active);
  }, [active]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none block h-full w-full ${className ?? ""}`}
    />
  );
}
