"use client";

import { useEffect, useRef } from "react";
import { decodeLandDots } from "./land-dots";

/** Phnom Penh — the pinned location. */
const PIN_LAT = 11.5564;
const PIN_LON = 104.9282;

/** View latitude the camera is tilted to, so the pin sits near centre. */
const VIEW_LAT = 14;
/** Ambient sway amplitude (deg) and period (s) — keeps the pin always facing front. */
const SWAY_DEG = 10;
const SWAY_PERIOD = 18;
/** Intro spin: starting longitude offset (deg) decaying at RATE per second.
    Exponential decay is C∞, so the intro blends into the sway with no hand-off. */
const INTRO_DEG = -150;
const INTRO_RATE = 1.5;
/** Seconds per ping-ring cycle; two rings run half a cycle apart. */
const RING_PERIOD = 2.6;
/** Elapsed time the static (reduced-motion) frame is drawn at, past the intro. */
const SETTLED_TIME = 20;

/** Front-hemisphere dots are bucketed into this many alpha levels for batching. */
const ALPHA_STEPS = 6;

const DEG = Math.PI / 180;

/** Pin colour — emerald, echoing the section's live-status ping. */
const PIN_RGB = "16, 185, 129";

/** Coordinate readout shown beside the pin's leader line. */
const PIN_COORDS = "11.56°N 104.93°E";

/**
 * Rotating dot-matrix Earth pinned on Phnom Penh, rendered on a 2D canvas.
 * Land dots come from a packed Natural Earth lattice ({@link decodeLandDots});
 * the globe spins in from the Atlantic, settles over Cambodia, then sways
 * gently so the pin never leaves view.
 *
 * The pin carries a surveyor-style callout: a leader line from Phnom Penh to
 * a floating name + coordinates readout, laid in the blank Pacific to the
 * globe's upper right (a land-dot globe leaves oceans empty, so the label
 * needs no backdrop).
 *
 * Behaviour contract (mirrors DotMatrix):
 * - Reduced motion → one settled frame is drawn, then the loop never runs.
 * - The loop pauses while offscreen or the tab is hidden.
 * - Rendering is capped at 2× devicePixelRatio.
 * - Colours resolve from the theme tokens and re-resolve when the theme flips.
 * - Purely decorative (the "Based in" card carries the text), so hidden
 *   from AT.
 */
export function Globe(props: { label?: string; className?: string }) {
  const { label, className } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let visible = true;
    let start = 0;
    let w = 0;
    let h = 0;

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* ------------------------------ Geometry ------------------------------ */
    /* Trig per land dot never changes; only the view longitude does. Hoisting
       these makes the per-frame cost ~10 flops per dot. */
    const latLon = decodeLandDots();
    const n = latLon.length / 2;
    const sinLat = new Float32Array(n);
    const cosLat = new Float32Array(n);
    const sinLon = new Float32Array(n);
    const cosLon = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const lat = latLon[i * 2] * DEG;
      const lon = latLon[i * 2 + 1] * DEG;
      sinLat[i] = Math.sin(lat);
      cosLat[i] = Math.cos(lat);
      sinLon[i] = Math.sin(lon);
      cosLon[i] = Math.cos(lon);
    }
    const sinView = Math.sin(VIEW_LAT * DEG);
    const cosView = Math.cos(VIEW_LAT * DEG);
    const sinPinLat = Math.sin(PIN_LAT * DEG);
    const cosPinLat = Math.cos(PIN_LAT * DEG);

    /* One reusable scratch list per alpha bucket, so a draw sets fillStyle
       once per level instead of once per dot (same trick as DotMatrix). */
    const buckets: number[][] = Array.from({ length: ALPHA_STEPS }, () => []);

    /* ------------------------------- Colours ------------------------------ */
    /* Theme tokens resolve through the canvas's computed style, so any format
       the tokens are authored in comes back as plain rgb() numbers. */
    let primary = "148, 162, 255";
    let border = "52, 50, 46";
    let foreground = "237, 240, 248";
    let muted = "151, 155, 169";
    let surface = "15, 17, 23";
    /* The canvas carries `font-mono`, so the resolved family is the site's
       mono stack (with its Khmer fallbacks) for the callout text. */
    const fontFamily = getComputedStyle(canvas).fontFamily || "monospace";

    const resolveColors = () => {
      const probe = canvas.style;
      const read = (token: string) => {
        probe.color = `var(${token})`;
        const m = getComputedStyle(canvas).color.match(/[\d.]+/g);
        return m ? m.slice(0, 3).join(", ") : null;
      };
      primary = read("--primary") ?? primary;
      border = read("--border") ?? border;
      foreground = read("--foreground") ?? foreground;
      muted = read("--muted-foreground") ?? muted;
      surface = read("--card") ?? surface;
      probe.color = "";
    };

    /* -------------------------------- Draw -------------------------------- */
    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, w, h);
      const size = Math.min(w, h);
      if (size < 40) return;

      const cx = w / 2;
      const cy = h / 2;
      const R = size * 0.44;
      const dot = Math.max(1.4, R * 0.013);

      // View longitude: pin + ambient sway + decaying intro offset.
      const sway = SWAY_DEG * Math.sin((elapsed / SWAY_PERIOD) * 2 * Math.PI);
      const intro = INTRO_DEG * Math.exp(-elapsed * INTRO_RATE);
      const viewLon = (PIN_LON + sway + intro) * DEG;
      const sinV = Math.sin(viewLon);
      const cosV = Math.cos(viewLon);

      // Atmosphere halo + limb shading give the flat dots a sense of volume.
      const halo = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R * 1.16);
      halo.addColorStop(0, `rgba(${primary}, 0.05)`);
      halo.addColorStop(0.82, `rgba(${primary}, 0.1)`);
      halo.addColorStop(1, `rgba(${primary}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.16, 0, 2 * Math.PI);
      ctx.fill();

      ctx.strokeStyle = `rgba(${border}, 0.55)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.stroke();

      // Project every land dot; bucket the front hemisphere by depth-alpha and
      // draw the back hemisphere immediately as one faint pass.
      for (const b of buckets) b.length = 0;
      ctx.fillStyle = `rgba(${primary}, 0.07)`;
      for (let i = 0; i < n; i++) {
        const sinD = sinLon[i] * cosV - cosLon[i] * sinV;
        const cosD = cosLon[i] * cosV + sinLon[i] * sinV;
        const x = cosLat[i] * sinD;
        const y = cosView * sinLat[i] - sinView * cosLat[i] * cosD;
        const z = sinView * sinLat[i] + cosView * cosLat[i] * cosD;
        const sx = cx + R * x;
        const sy = cy - R * y;
        if (z > 0) {
          const level = Math.min(ALPHA_STEPS - 1, Math.floor(z * ALPHA_STEPS));
          buckets[level].push(sx, sy);
        } else {
          ctx.fillRect(sx - dot / 2, sy - dot / 2, dot, dot);
        }
      }
      for (let level = 0; level < ALPHA_STEPS; level++) {
        const list = buckets[level];
        if (!list.length) continue;
        const alpha = 0.16 + 0.6 * ((level + 0.5) / ALPHA_STEPS) ** 1.4;
        ctx.fillStyle = `rgba(${primary}, ${alpha.toFixed(3)})`;
        for (let k = 0; k < list.length; k += 2) {
          ctx.fillRect(list[k] - dot / 2, list[k + 1] - dot / 2, dot, dot);
        }
      }

      /* --------------------------- Phnom Penh pin --------------------------- */
      const sinD = Math.sin(PIN_LON * DEG) * cosV - Math.cos(PIN_LON * DEG) * sinV;
      const cosD = Math.cos(PIN_LON * DEG) * cosV + Math.sin(PIN_LON * DEG) * sinV;
      const px = cx + R * (cosPinLat * sinD);
      const py = cy - R * (cosView * sinPinLat - sinView * cosPinLat * cosD);
      const pz = sinView * sinPinLat + cosView * cosPinLat * cosD;
      if (pz <= 0.05) return; // behind the limb during the intro spin

      // Fade the pin in as it rounds the limb so it doesn't pop.
      const reveal = Math.min(1, (pz - 0.05) / 0.25);

      // Expanding ping rings, two running half a cycle apart.
      for (let k = 0; k < 2; k++) {
        const p = ((elapsed / RING_PERIOD + k * 0.5) % 1 + 1) % 1;
        const alpha = (1 - p) * 0.5 * reveal;
        if (alpha <= 0.01) continue;
        ctx.strokeStyle = `rgba(${PIN_RGB}, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(px, py, 3 + p * R * 0.16, 0, 2 * Math.PI);
        ctx.stroke();
      }

      const glow = ctx.createRadialGradient(px, py, 0, px, py, R * 0.085);
      glow.addColorStop(0, `rgba(${PIN_RGB}, ${0.5 * reveal})`);
      glow.addColorStop(1, `rgba(${PIN_RGB}, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, R * 0.085, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = `rgba(${PIN_RGB}, ${reveal})`;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(2.2, R * 0.02), 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = `rgba(236, 253, 245, ${0.9 * reveal})`;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1, R * 0.008), 0, 2 * Math.PI);
      ctx.fill();

      /* ------------------------ Pin callout readout ------------------------ */
      // Leader line up-right from the pin into the empty Pacific, ending in a
      // horizontal shelf that underlines the place name + coordinates.
      if (size < 220) return; // too cramped for legible text

      const fs = Math.min(12, Math.max(10, R * 0.062));
      const name = (label ?? "").toUpperCase();
      const elbowX = px + R * 0.2;
      const shelfY = py - R * 0.26;

      ctx.font = `500 ${fs}px ${fontFamily}`;
      const nameW = name ? ctx.measureText(name).width : 0;
      const coordsW = ctx.measureText(PIN_COORDS).width;
      const shelfW = Math.max(nameW, coordsW) + 10;
      // Keep the readout inside the canvas even at the sway's rightmost point.
      const shelfX = Math.min(elbowX, w - shelfW - 6);

      ctx.strokeStyle = `rgba(${PIN_RGB}, ${0.55 * reveal})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px + 3, py - 3);
      ctx.lineTo(elbowX, shelfY);
      ctx.lineTo(shelfX + shelfW, shelfY);
      ctx.stroke();

      // A soft halo in the surface colour lifts the text off any land dots
      // that drift underneath it.
      ctx.textBaseline = "alphabetic";
      ctx.shadowColor = `rgba(${surface}, ${0.9 * reveal})`;
      ctx.shadowBlur = 4;
      if (name) {
        ctx.fillStyle = `rgba(${foreground}, ${0.92 * reveal})`;
        ctx.fillText(name, shelfX + 2, shelfY - fs - 9);
      }
      ctx.fillStyle = `rgba(${muted}, ${0.9 * reveal})`;
      ctx.fillText(PIN_COORDS, shelfX + 2, shelfY - 6);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    };

    /* ------------------------------ Lifecycle ------------------------------ */
    const loop = (now: number) => {
      if (!running) return;
      if (!start) start = now;
      draw((now - start) / 1000);
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
      // Drop the origin so the intro spin replays from scratch on resume.
      start = 0;
    };

    const drawSettled = () => draw(SETTLED_TIME);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Reduced motion never animates, so repaint its single frame on resize.
      if (reduceMq.matches) drawSettled();
    };

    resolveColors();
    resize();
    if (reduceMq.matches) drawSettled();

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
      if (reduceMq.matches) drawSettled();
      else play();
    };
    reduceMq.addEventListener("change", onMotionChange);

    // Theme flips swap the class on <html>; re-resolve tokens and repaint.
    // The re-read waits one frame so the new theme's styles are applied.
    const mo = new MutationObserver(() => {
      requestAnimationFrame(() => {
        resolveColors();
        if (reduceMq.matches) drawSettled();
      });
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onMotionChange);
    };
  }, [label]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block aspect-square w-full font-mono ${className ?? ""}`}
    />
  );
}
