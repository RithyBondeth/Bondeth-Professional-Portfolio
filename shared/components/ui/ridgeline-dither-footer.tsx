"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/shared/components/theme/theme-provider";
import { useReducedMotion } from "@/shared/hooks/use-reduced-motion";

const layers = 7;
const seed = 23;
/** Hex → [r, g, b] in 0–255, or null for anything that isn't #rgb / #rrggbb. */
function rdfHex(hex: string) {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return null;
  const h =
    m[1].length === 3
      ? m[1]
          .split("")
          .map((c) => c + c)
          .join("")
      : m[1];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

/** [r, g, b] → one opaque pixel for a little-endian Uint32 view of ImageData. */
function rdfPack(rgb: number[]) {
  return ((255 << 24) | (rgb[2] << 16) | (rgb[1] << 8) | rgb[0]) >>> 0;
}

/** The classic 8×8 Bayer matrix, as thresholds in (0, 1). */
const RDF_BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36,
  14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23,
  61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

/** Palette index for a tone in [0, 1] across `n` colours at Bayer threshold `b`. */
function rdfDither(tone: number, n: number, b: number) {
  const t = tone < 0 ? 0 : tone > 1 ? 1 : tone;
  const v = Math.floor(t * (n - 1) + b);
  return v > n - 1 ? n - 1 : v;
}

/** Integer lattice hash → [0, 1). */
function rdfHash(x: number, y: number, seed: number) {
  let h =
    Math.imul(x | 0, 374761393) +
    Math.imul(y | 0, 668265263) +
    Math.imul(seed | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth value noise in [0, 1). */
function rdfNoise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = rdfHash(xi, yi, seed);
  const b = rdfHash(xi + 1, yi, seed);
  const c = rdfHash(xi, yi + 1, seed);
  const d = rdfHash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Fractal value noise, normalised back into [0, 1). */
function rdfFbm(x: number, y: number, seed: number, octaves: number) {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += rdfNoise(x, y, seed + o * 31) * amp;
    norm += amp;
    x *= 2.03;
    y *= 2.03;
    amp *= 0.5;
  }
  return norm > 0 ? sum / norm : 0;
}

/** Hermite step from e0 to e1, clamped. */
function rdfSmooth(e0: number, e1: number, x: number) {
  const t =
    e1 === e0
      ? x < e0
        ? 0
        : 1
      : Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

/** Ease-out cubic over a progress that may run outside [0, 1]. */
function rdfEase(t: number) {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return 1 - Math.pow(1 - c, 3);
}

/**
 * Crest row of ridge `i` of `layers` (0 is the farthest) for every column of
 * a `cols` × `rows` grid, plus `margin` columns either side for parallax.
 * Farther ridges sit higher with more, smaller peaks; nearer ones are lower,
 * broader and taller.
 */
function rdfRidgeline(
  cols: number,
  rows: number,
  i: number,
  layers: number,
  seed: number,
  margin: number,
) {
  const k = layers > 1 ? i / (layers - 1) : 1;
  const n = cols + margin * 2;
  const out = new Float32Array(n);
  const base = rows * (0.38 + 0.66 * Math.pow(k, 1.4));
  const amp = rows * (0.2 + 0.24 * k);
  const freq = 6 - 3.8 * k;
  // Near ridges climb toward both edges, one side more than the other, so the
  // range opens into a valley. Nothing climbs into the faded band at the top.
  const flankL = rows * 0.5 * k * k * k * (0.55 + 0.6 * rdfHash(i, 11, seed));
  const flankR = rows * 0.5 * k * k * k * (0.55 + 0.6 * rdfHash(i, 13, seed));
  const ceil = rows * 0.17;
  const tilt = (rdfHash(i, 7, seed) - 0.5) * rows * 0.34 * (0.4 + k);
  const s = (seed | 0) * 13 + i * 101;
  for (let x = 0; x < n; x++) {
    const u = (x - margin) / cols;
    const r1 = 1 - Math.abs(rdfNoise(u * freq + i * 3.7, 0.5, s) * 2 - 1);
    const r2 = 1 - Math.abs(rdfNoise(u * freq * 2.3, 3.5, s + 1) * 2 - 1);
    const f = rdfFbm(u * freq * 4.1, 9.5, s + 2, 3);
    const h = r1 * r1 * 0.62 + r2 * 0.24 + f * 0.14;
    const e = Math.min(1.2, Math.abs(u * 2 - 1));
    const y =
      base -
      h * amp +
      tilt * (u - 0.5) * 2 -
      (u < 0.5 ? flankL : flankR) * e * e * Math.sqrt(e);
    out[x] = y < ceil ? ceil - (ceil - y) * 0.25 : y;
  }
  return out;
}

/** Altitude in metres shown for a crest at `crest` rows down a `rows`-tall range. */
function rdfElevation(
  crest: number,
  rows: number,
  layer: number,
  layers: number,
) {
  const up = rows > 0 ? 1 - Math.min(1, Math.max(0, crest / rows)) : 0;
  return Math.round(420 + up * 2600 + (layers - 1 - layer) * 140);
}

export function RidgelineDitherFooter({ lang }: { lang: "en" | "km" }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const altRef = useRef<HTMLDivElement>(null);
  const altTextRef = useRef<HTMLSpanElement>(null);
  const revealAt = useRef<number | null>(null);
  const reduced = useReducedMotion();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!scene || !canvas || !ctx) return;

    const style = getComputedStyle(scene);
    const paper = rdfHex(style.getPropertyValue("--background"));
    const coral = rdfHex(style.getPropertyValue("--brand-pixel"));
    const ink = rdfHex(style.getPropertyValue("--foreground"));
    if (!paper || !coral || !ink) return;

    const mix = (from: number[], to: number[], amount: number) =>
      from.map((channel, index) =>
        Math.round(channel + (to[index] - channel) * amount),
      );
    const darkest = resolvedTheme === "light" ? 0.76 : 0.4;
    const pal = new Uint32Array(
      [
        paper,
        mix(paper, coral, 0.18),
        mix(paper, coral, 0.37),
        mix(paper, coral, 0.63),
        mix(paper, coral, 0.88),
        mix(coral, ink, 0.25),
        mix(coral, ink, darkest),
      ].map(rdfPack),
    );
    const nTones = pal.length;
    const elevationFormat = new Intl.NumberFormat(
      lang === "km" ? "km-KH" : "en-US",
      {
        style: "unit",
        unit: "meter",
        maximumFractionDigits: 0,
      },
    );

    let p = 2;
    let cols = 1;
    let rows = 1;
    let margin = 2;
    let img = null as ImageData | null;
    let buf = new Uint32Array(0);
    let tops = [] as Float32Array[];
    // Per layer, how deep the valley mist reaches under the crest, along its length.
    let pools = [] as Float32Array[];
    // Per frame, per layer per column: crest row and slope.
    let colTop = new Float32Array(0);
    let colSlope = new Float32Array(0);
    let colPool = new Float32Array(0);
    let fog = new Float32Array(0);
    let fw = 1;
    let fh = 1;
    let ceil = 0;
    let fadeTo = 1;

    let raf = 0;
    let visible = false;
    let lastDraw = 0;
    const pointerMedia = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    let lastTick = performance.now();
    // Pointer, in grid cells: target and eased.
    let tx = 0;
    let ty = 0;
    let ex = 0;
    let ey = 0;
    let inside = false;
    let clear = 0;
    // Parallax in -1..1, target and eased.
    let pt = 0;
    let pe = 0;
    let windV = 0;
    let windX = 0;
    let altShown = false;
    let altLabel = "";

    const layout = () => {
      const rect = scene.getBoundingClientRect();
      p = Math.max(2, Math.ceil(rect.width / 720));
      cols = Math.max(8, Math.ceil(rect.width / p));
      rows = Math.max(8, Math.ceil(rect.height / p));
      canvas.width = cols;
      canvas.height = rows;
      canvas.style.width = cols * p + "px";
      canvas.style.height = rows * p + "px";
      img = ctx.createImageData(cols, rows);
      buf = new Uint32Array(img.data.buffer);
      margin = Math.ceil(cols * 0.045) + 3;
      ceil = Math.max(rows * 0.17, 92 / p);
      fadeTo = Math.max(rows * 0.3, 128 / p);
      tops = [];
      pools = [];
      for (let i = 0; i < layers; i++) {
        const t = rdfRidgeline(cols, rows, i, layers, seed, margin);
        // Keep every crest clear of the copyright line, which overlaps the top of the range.
        for (let x = 0; x < t.length; x++)
          if (t[x] < ceil) t[x] = ceil - (ceil - t[x]) * 0.2;
        const pool = new Float32Array(t.length);
        for (let x = 0; x < t.length; x++)
          pool[x] =
            0.45 +
            1.1 * rdfFbm(((x - margin) / cols) * 4, i * 5.3, seed + 9, 2);
        tops.push(t);
        pools.push(pool);
      }
      colTop = new Float32Array(layers * cols);
      colSlope = new Float32Array(layers * cols);
      colPool = new Float32Array(layers * cols);
      fw = (cols >> 1) + 2;
      fh = (rows >> 1) + 2;
      fog = new Float32Array(fw * fh);
    };

    const draw = (now: number) => {
      if (!img) return;
      const dt = Math.min(64, now - lastTick);
      lastTick = now;
      const live = !reduced && pointerMedia.matches;
      const age = reduced ? Infinity : now - (revealAt.current ?? now);

      // Ease the pointer, the clearing and the parallax toward their targets.
      const ease = 1 - Math.pow(0.82, dt / 16.7);
      const slow = 1 - Math.pow(0.93, dt / 16.7);
      ex += (tx - ex) * ease;
      ey += (ty - ey) * ease;
      clear += ((inside && live ? 1 : 0) - clear) * slow;
      pe += ((live ? pt : 0) - pe) * slow;
      windV *= Math.pow(0.965, dt / 16.7);
      windX += (windV * dt) / 1000;
      const fogT = (reduced ? 0 : (now / 1000) * 0.045 * 1) + windX;

      // The mist: a wide, slow fractal field at half resolution.
      const sx = 9 / cols;
      const sy = 4.4 / rows;
      for (let gy = 0; gy < fh; gy++) {
        const ny = gy * sy;
        for (let gx = 0; gx < fw; gx++) {
          const nx = gx * sx + fogT;
          const warp = rdfNoise(nx * 0.45 - fogT * 0.6, ny * 0.8, 77) * 0.6;
          const v = rdfFbm(nx + warp, ny + warp * 0.4, 31, 3);
          fog[gy * fw + gx] = rdfSmooth(0.3, 0.74, v);
        }
      }

      // Each ridge's reveal, back to front, and where its crest sits this frame.
      const rev = new Float32Array(layers);
      const k = new Float32Array(layers);
      const toneBase = new Float32Array(layers);
      const fogDepth = new Float32Array(layers);
      for (let i = 0; i < layers; i++) {
        k[i] = i / (layers - 1);
        rev[i] = age < 0 ? 0 : rdfEase((age - 380 - i * 170) / 1300);
        toneBase[i] = 0.16 + 0.76 * Math.pow(k[i], 1.6);
        fogDepth[i] = rows * (0.08 + 0.42 * k[i]);
        const rise = (1 - rev[i]) * rows * 0.09;
        const shift = Math.round(pe * (0.25 + k[i]) * 0.75 * (margin - 3));
        const t = tops[i];
        const last = t.length - 1;
        for (let x = 0; x < cols; x++) {
          const at = x + margin + shift;
          colTop[i * cols + x] = t[at] + rise;
          colSlope[i * cols + x] =
            t[Math.min(last, at + 2)] - t[Math.max(0, at - 2)];
          colPool[i * cols + x] = fogDepth[i] * pools[i][at];
        }
      }
      const lift = age < 0 ? 1 : 1 - rdfEase((age - 900) / 1800);
      const mistK = 0.8;
      const r = 130 / p;
      const r2 = r * r;

      for (let y = 0; y < rows; y++) {
        const fade = rdfSmooth(0, fadeTo, y);
        const frow = (y >> 1) * fw;
        const by = (y & 7) * 8;
        const dyc = (y - ey) * 1.5;
        for (let x = 0; x < cols; x++) {
          let L = -1;
          for (let i = layers - 1; i >= 0; i--) {
            if (y >= colTop[i * cols + x]) {
              L = i;
              break;
            }
          }
          let tone = 0;
          let mk = 0.3;
          if (L >= 0) {
            const kk = k[L];
            const d = y - colTop[L * cols + x];
            const depth = colPool[L * cols + x];
            const crest = 1 - rdfSmooth(0, depth, d) * (0.88 - 0.45 * kk);
            tone = toneBase[L] * crest;
            const sl = colSlope[L * cols + x] * 0.06;
            tone +=
              (sl < -0.2 ? -0.2 : sl > 0.2 ? 0.2 : sl) *
              (1 - rdfSmooth(0, depth * 0.5, d));
            tone +=
              (rdfHash(x + Math.round(colTop[L * cols + x] * 7), d | 0, L) -
                0.5) *
              0.07 *
              kk;
            tone *= rev[L];
            mk = 0.95 - 0.5 * kk;
          } else {
            tone = 0.05 * rdfSmooth(rows * 0.15, rows * 0.6, y);
          }

          let m = fog[frow + (x >> 1)] * mistK * mk;
          if (clear > 0.01) {
            const dx = x - ex;
            const q = (dx * dx + dyc * dyc) / r2;
            if (q < 4) {
              const c = clear * Math.exp(-q);
              m *= 1 - c * 0.92;
              if (L >= 0) tone += c * 0.16 * rev[L];
            }
          }
          // Just under full tone, so even the deepest slope keeps its texture.
          if (tone > 0.93) tone = 0.93;
          m += lift * 0.55;
          if (m > 1) m = 1;
          tone = (tone * (1 - m) + 0.09 * m * (1 - lift)) * fade;

          buf[y * cols + x] =
            pal[rdfDither(tone, nTones, RDF_BAYER[by + (x & 7)])];
        }
      }
      ctx.putImageData(img, 0, 0);

      // The altimeter rides the crest of the ridge under the pointer.
      const alt = altRef.current;
      const label = altTextRef.current;
      let show = false;
      if (alt && label && live && inside && age > 1600) {
        const x = Math.max(0, Math.min(cols - 1, Math.round(ex)));
        for (let i = layers - 1; i >= 0; i--) {
          const crest = colTop[i * cols + x];
          if (ey >= crest - 6) {
            show = true;
            alt.style.transform =
              "translate(" +
              (x * p).toFixed(1) +
              "px," +
              (crest * p).toFixed(1) +
              "px)";
            const text = elevationFormat.format(
              rdfElevation(crest, rows, i, layers),
            );
            if (text !== altLabel) {
              altLabel = text;
              label.textContent = text;
            }
            break;
          }
        }
      }
      if (alt && show !== altShown) {
        altShown = show;
        alt.style.opacity = show ? "1" : "0";
      }
    };

    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      const interval = 1000 / (pointerMedia.matches ? 24 : 12);
      if (now - lastDraw >= interval) {
        draw(now);
        lastDraw = now;
      }
      if (!reduced) raf = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      if (!pointerMedia.matches || event.pointerType === "touch") return;
      const bounds = scene.getBoundingClientRect();
      tx = (event.clientX - bounds.left) / p;
      ty = (event.clientY - bounds.top) / p;
      pt = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      if (!inside) {
        ex = tx;
        ey = ty;
      }
      inside = true;
    };
    const onLeave = () => {
      pt = 0;
      inside = false;
      if (altRef.current) altRef.current.style.opacity = "0";
      altShown = false;
    };
    const onDown = (event: PointerEvent) => {
      if (event.button !== 0 || !inside) return;
      windV += tx < cols / 2 ? 1.4 : -1.4;
    };

    const resize = new ResizeObserver(() => {
      if (!visible) return;
      layout();
      draw(performance.now());
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        cancelAnimationFrame(raf);
        raf = 0;
        onLeave();
        return;
      }
      const now = performance.now();
      revealAt.current ??= reduced ? now - 2700 : now;
      lastTick = now;
      layout();
      draw(now);
      lastDraw = now;
      if (!reduced && !raf) raf = requestAnimationFrame(loop);
    });
    resize.observe(scene);
    intersection.observe(scene);
    if (!reduced) {
      scene.addEventListener("pointermove", onMove);
      scene.addEventListener("pointerleave", onLeave);
      scene.addEventListener("pointerdown", onDown);
    }

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      intersection.disconnect();
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerleave", onLeave);
      scene.removeEventListener("pointerdown", onDown);
      onLeave();
    };
  }, [lang, reduced, resolvedTheme]);

  return (
    <div
      ref={sceneRef}
      aria-hidden="true"
      className="relative -mt-10 h-[clamp(15rem,26vw,20rem)] overflow-hidden sm:-mt-16"
    >
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 block max-w-none [image-rendering:pixelated]"
      />
      <div
        ref={altRef}
        className="pointer-events-none absolute top-0 left-0 opacity-0 transition-opacity"
      >
        <span className="absolute -top-1 -left-1 size-2 rounded-full border-2 border-foreground bg-background" />
        <span className="absolute bottom-1 left-0 h-6 w-px bg-foreground/50" />
        <span
          ref={altTextRef}
          className="absolute bottom-7 -translate-x-1/2 rounded-sm border border-border bg-background/95 px-1.5 py-1 font-mono text-[10px] whitespace-nowrap text-foreground"
        />
      </div>
    </div>
  );
}
