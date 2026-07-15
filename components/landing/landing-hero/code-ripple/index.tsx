"use client";

import { useEffect, useRef } from "react";

interface IRipple {
  x: number;
  y: number;
  born: number; // seconds (performance.now / 1000)
  strength: number; // 0..1, scales brightness
}

/* Grid + wave tuning — all in CSS pixels / seconds. */
const CELL = 22; // grid pitch between glyphs
const SPEED = 230; // wavefront expansion, px per second
const LIFE = 1.15; // ripple lifetime before it fully fades
// Wake glyph sequence, read from the leading edge inward — Codex's "--0>"
// signature: a ">" tip, then "0", then a "-" trail. Each glyph occupies one
// BAND-thick concentric ring behind the front, with its own falloff alpha.
const GLYPHS = [">", "0", "-", "-"];
const GLYPH_ALPHA = [1, 0.78, 0.55, 0.38];
const BAND = 22; // px thickness of each glyph ring (≈ CELL, so rings stay distinct)
const LEAD = 6; // px the ">" tip sits ahead of the exact wavefront
const MAX_RIPPLES = 28;
const MOVE_MIN_DIST = 16; // cursor travel before another move-ripple is emitted
const MOVE_STRENGTH = 0.5;
const CLICK_STRENGTH = 1;
const MIN_ALPHA = 0.06; // below this a cell isn't worth drawing
const MAX_ALPHA = 0.9;

/** Parse "#rgb" / "#rrggbb" into an "r, g, b" string; falls back to cyan. */
function hexToRgb(hex: string): string {
  const h = hex.trim().replace("#", "");
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    if ([r, g, b].every((n) => !Number.isNaN(n))) return `${r}, ${g}, ${b}`;
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].every((n) => !Number.isNaN(n))) return `${r}, ${g}, ${b}`;
  }
  return "34, 211, 238"; // primary cyan
}

/**
 * Interactive ASCII ripple layer for the hero. Moving the pointer (or clicking
 * / tapping) sends an expanding ring through a monospace character field: the
 * wavefront lights up as Codex's "--0>" glyph sequence (a ">" tip, then "0",
 * then a "-" wake), then fades. The canvas is transparent and idle until the
 * first interaction.
 *
 * Behaviour contract (mirrors HeroBackground):
 * - Reduced motion → never animates; no ripples are emitted.
 * - The loop pauses while the hero is offscreen or the tab is hidden, and
 *   stops entirely whenever no ripples are alive (redraws on the next input).
 * - Rendering is capped at 2× devicePixelRatio.
 * - Move-ripples are desktop-only (fine pointers); clicks/taps work anywhere.
 * - Glyph colour tracks the theme's --primary token.
 */
export default function CodeRipple() {
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
    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let intensity = new Float32Array(0);
    let glyph = new Uint8Array(0);
    let color = "34, 211, 238";
    const ripples: IRipple[] = [];
    const lastEmit = { x: -1e4, y: -1e4 };

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const now = () => performance.now() / 1000;

    function readColor() {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary")
        .trim();
      if (raw) color = hexToRgb(raw);
    }

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL) + 1;
      rows = Math.ceil(h / CELL) + 1;
      intensity = new Float32Array(cols * rows);
      glyph = new Uint8Array(cols * rows);
    }

    function frame() {
      const t = now();

      // Prune fully-faded ripples.
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (t - ripples[i].born >= LIFE) ripples.splice(i, 1);
      }

      ctx!.clearRect(0, 0, w, h);

      // Nothing alive → go idle; the next pointer input restarts the loop.
      if (ripples.length === 0) {
        running = false;
        return;
      }

      intensity.fill(0);
      glyph.fill(0);

      for (const r of ripples) {
        const age = t - r.born;
        const life = 1 - age / LIFE;
        if (life <= 0) continue;
        const rad = SPEED * age;
        const strength = r.strength * life;

        // Only the annulus around the wavefront can be lit, so walk the cells
        // inside that ripple's bounding box, not the whole grid.
        const reach = rad + LEAD;
        const c0 = Math.max(0, Math.floor((r.x - reach) / CELL));
        const c1 = Math.min(cols - 1, Math.ceil((r.x + reach) / CELL));
        const r0 = Math.max(0, Math.floor((r.y - reach) / CELL));
        const r1 = Math.min(rows - 1, Math.ceil((r.y + reach) / CELL));

        for (let row = r0; row <= r1; row++) {
          const cy = row * CELL + CELL / 2;
          const dy = cy - r.y;
          for (let col = c0; col <= c1; col++) {
            const cx = col * CELL + CELL / 2;
            const dx = cx - r.x;
            const d = Math.sqrt(dx * dx + dy * dy);
            const delta = rad - d; // grows as the front passes this cell
            if (delta < -LEAD) continue;

            // Which glyph ring is this cell in? 0 = ">" tip, then "0", "-", "-".
            const band = Math.floor((delta + LEAD) / BAND);
            if (band >= GLYPHS.length) continue;

            const v = strength * GLYPH_ALPHA[band];
            const idx = row * cols + col;
            if (v > intensity[idx]) {
              intensity[idx] = v;
              glyph[idx] = band;
            }
          }
        }
      }

      // Paint the lit cells.
      ctx!.font = `${Math.round(CELL * 0.82)}px var(--font-code), "JetBrains Mono", ui-monospace, monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const v = intensity[idx];
          if (v <= MIN_ALPHA) continue;
          const cx = col * CELL + CELL / 2;
          const cy = row * CELL + CELL / 2;
          ctx!.fillStyle = `rgba(${color}, ${Math.min(1, v) * MAX_ALPHA})`;
          ctx!.fillText(GLYPHS[glyph[idx]], cx, cy);
        }
      }

      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduceMq.matches || !visible) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function emit(x: number, y: number, strength: number) {
      if (reduceMq.matches) return;
      ripples.push({ x, y, born: now(), strength });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
      start();
    }

    readColor();
    resize();

    // Pause while offscreen / tab hidden.
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && !document.hidden;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => {
      visible = !document.hidden;
      if (!visible) stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Stop emitting if the user switches motion off mid-session.
    const onReduceChange = () => {
      if (reduceMq.matches) {
        ripples.length = 0;
        stop();
        ctx!.clearRect(0, 0, w, h);
      }
    };
    reduceMq.addEventListener("change", onReduceChange);

    // Recolour when the theme flips.
    const themeObserver = new MutationObserver(readColor);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Pointer input on the hero section — the canvas keeps pointer-events: none.
    const host = canvas.parentElement;
    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      const dx = x - lastEmit.x;
      const dy = y - lastEmit.y;
      if (dx * dx + dy * dy < MOVE_MIN_DIST * MOVE_MIN_DIST) return;
      lastEmit.x = x;
      lastEmit.y = y;
      emit(x, y, MOVE_STRENGTH);
    };
    const onDown = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      emit(x, y, CLICK_STRENGTH);
    };
    if (host) {
      if (finePointer) {
        host.addEventListener("pointermove", onMove, { passive: true });
      }
      host.addEventListener("pointerdown", onDown, { passive: true });
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onReduceChange);
      if (host) {
        if (finePointer) host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerdown", onDown);
      }
    };
  }, []);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
