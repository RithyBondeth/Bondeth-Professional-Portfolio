"use client";

import { useEffect, useRef } from "react";

/* --------------------------------- Tuning ---------------------------------- */
const COLUMN_COUNT = 60;
/** Rain alphabet: digits, code punctuation, and a handful of Khmer letters
 *  and numerals — the site is bilingual, and the mono stack ships Khmer
 *  fallbacks. Trim the Khmer entries if the mix feels too busy. */
const GLYPHS = [
  "0",
  "1",
  "{",
  "}",
  "<",
  ">",
  "/",
  "=",
  ";",
  "$",
  "#",
  "*",
  "+",
  "ក",
  "ង",
  "ដ",
  "ន",
  "រ",
  "ស",
  "០",
  "១",
  "៩",
];
/** Cyan for pointer-near glyphs — apsara --l-spectrum-2, same literal the
 *  old constellation used for its cursor threads. */
const POINTER_COLOR = "6, 216, 244";
const POINTER_DIST = 160;
/** How far the camera parallaxes toward the pointer, in screen fractions. */
const YAW_SHIFT = 0.16;
const PITCH_SHIFT = 0.08;
const FOCAL = 0.6;
/** Fall speed at the camera plane, in px/s (scaled down with depth). */
const BASE_SPEED = 90;

interface IColumn {
  x: number; // world x, fraction of width [-0.65 .. 0.65]
  z: number; // depth, 0 = camera plane, 1 = far
  headY: number; // head position in screen px
  speed: number; // individual multiplier on BASE_SPEED
  trail: number; // glyph cells behind the head
  seed: number; // stable per-column randomness for glyph flicker
}

/**
 * Hero background: Matrix-style glyph rain with 3D depth. Columns fall in
 * perspective — far columns are small, dim and slow; near ones large, bright
 * and fast — and the whole field parallaxes toward the pointer. Glyphs near
 * the cursor flare cyan (the site's signature hover accent).
 *
 * Native replacement for the Spline scene: no runtime download, no watermark,
 * works in both themes, and follows the house canvas contract:
 * - Reduced motion → one static frame is drawn, then the loop never runs.
 * - The loop pauses while the hero is offscreen or the tab is hidden.
 * - Rendering is capped at 2× devicePixelRatio.
 * - Pointer interaction is desktop-only (fine pointers), listening on the
 *   parent section so the canvas itself never takes pointer events.
 * - Theme tokens resolve through the canvas's computed style and re-resolve
 *   when the html class flips.
 */
export default function HeroBackground() {
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
    let last = 0;
    let elapsed = 0;
    let w = 0;
    let h = 0;
    // Camera parallax, lerped toward the pointer for a weighty feel.
    let yaw = 0;
    let pitch = 0;
    let yawT = 0;
    let pitchT = 0;
    const pointer = { x: -1e4, y: -1e4, active: false };

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    /* The canvas carries `font-code` — the true monospace stack. (`font-mono`
       is remapped to the serif stack in this design system.) */
    const fontFamily = getComputedStyle(canvas).fontFamily || "monospace";

    /* ------------------------------- Colours ------------------------------ */
    /* Theme tokens resolve through the canvas's computed style, so any format
       the tokens are authored in comes back as plain rgb() numbers. */
    let primary = "148, 162, 255";
    let foreground = "237, 240, 248";

    const resolveColors = () => {
      const probe = canvas.style;
      const read = (token: string) => {
        probe.color = `var(${token})`;
        const m = getComputedStyle(canvas).color.match(/[\d.]+/g);
        return m ? m.slice(0, 3).join(", ") : null;
      };
      primary = read("--primary") ?? primary;
      foreground = read("--foreground") ?? foreground;
      probe.color = "";
    };

    /* ------------------------------- Columns ------------------------------- */
    const columns: IColumn[] = [];
    const respawn = (c: IColumn, aboveTop: boolean) => {
      c.x = (Math.random() - 0.5) * 1.3;
      c.z = Math.random();
      c.headY = aboveTop ? -Math.random() * h * 0.6 : Math.random() * h;
      c.speed = 0.6 + Math.random() * 0.8;
      c.trail = 6 + Math.floor(Math.random() * 9);
      c.seed = Math.floor(Math.random() * 9973);
    };
    /** Populated on the first resize — respawn() spreads heads across the
     *  canvas height, which is 0 until the canvas has been measured. */
    const seedField = () => {
      for (let i = 0; i < COLUMN_COUNT; i++) {
        const c = {} as IColumn;
        respawn(c, false);
        columns.push(c);
      }
    };

    /** Stable pseudo-random glyph per (column, cell, tick) — flickers over
     *  time without storing per-cell state. */
    const glyphAt = (seed: number, cell: number, tick: number) => {
      const n = (seed * 31 + cell * 131 + tick * 17) % GLYPHS.length;
      return GLYPHS[(n + GLYPHS.length) % GLYPHS.length];
    };

    /* -------------------------------- Sizing ------------------------------- */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* --------------------------------- Draw -------------------------------- */
    const draw = (t: number, dt: number) => {
      ctx.clearRect(0, 0, w, h);
      if (w < 40 || h < 40) return;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const tick = Math.floor(t * 2.5); // glyph flicker rate

      for (const c of columns) {
        const scale = FOCAL / (FOCAL + c.z);
        const depthFade = scale * scale; // far columns dim quadratically
        const fontSize = 8 + scale * 14;
        const cell = fontSize * 1.2;

        if (dt > 0) {
          c.headY += BASE_SPEED * c.speed * scale * dt;
          if (c.headY - c.trail * cell > h + 24) respawn(c, true);
        }

        // Camera parallax: far columns shift more, selling the depth.
        const sx =
          w / 2 +
          c.x * w * scale +
          yaw * (1 - scale) * w * YAW_SHIFT;
        const shiftY = pitch * (1 - scale) * h * PITCH_SHIFT;
        if (sx < -24 || sx > w + 24) continue;

        ctx.font = `${fontSize.toFixed(1)}px ${fontFamily}`;

        // Head cell (k = 0) is the bright leader; the trail decays behind it.
        for (let k = 0; k <= c.trail; k++) {
          const sy = c.headY - k * cell + shiftY;
          if (sy < -24 || sy > h + 24) continue;

          const decay = k === 0 ? 1 : 1 - k / (c.trail + 1);
          let alpha =
            (k === 0 ? 0.75 : 0.4 * decay * decay) * (0.25 + depthFade * 0.75);
          let color = k === 0 ? foreground : primary;

          if (pointer.active) {
            const dx = sx - pointer.x;
            const dy = sy - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < POINTER_DIST) {
              const kk = 1 - dist / POINTER_DIST;
              alpha = Math.min(1, alpha + kk * 0.5);
              color = POINTER_COLOR;
            }
          }

          ctx.fillStyle = `rgba(${color}, ${alpha})`;
          ctx.fillText(glyphAt(c.seed, k, tick + Math.floor(k / 3)), sx, sy);
        }
      }
    };

    /* --------------------------------- Loop -------------------------------- */
    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      elapsed += dt;
      // Ease the camera toward the pointer target.
      yaw += (yawT - yaw) * 0.06;
      pitch += (pitchT - pitch) * 0.06;
      draw(elapsed, dt);
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running || reduceMq.matches) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    };

    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const staticFrame = () => draw(2.5, 0);

    resolveColors();
    resize();
    seedField();
    if (reduceMq.matches) staticFrame();
    else play();

    /* ------------------------------ Observers ------------------------------ */
    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMq.matches) staticFrame();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !document.hidden) play();
      else pause();
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onReduceChange = () => {
      pause();
      if (reduceMq.matches) staticFrame();
      else play();
    };
    reduceMq.addEventListener("change", onReduceChange);

    // Theme flips mutate the html class — re-resolve the token colours.
    const mo = new MutationObserver(() => {
      resolveColors();
      if (reduceMq.matches) staticFrame();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    /* -------------------------------- Pointer ------------------------------ */
    // Listen on the section so the canvas never needs pointer-events of its
    // own — hero text stays selectable and CTAs need no special casing.
    const host = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      yawT = (pointer.x / Math.max(1, w) - 0.5) * 2;
      pitchT = (pointer.y / Math.max(1, h) - 0.5) * 2;
    };
    const onLeave = () => {
      pointer.active = false;
      yawT = 0;
      pitchT = 0;
    };
    if (finePointer && host) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave, { passive: true });
    }

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMq.removeEventListener("change", onReduceChange);
      if (finePointer && host) {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      }
    };
  }, []);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full font-code"
      aria-hidden
    />
  );
}
