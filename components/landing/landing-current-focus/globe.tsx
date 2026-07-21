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

/** Drag: degrees turned per radius of pointer travel, per axis. */
const DRAG_LON_PER_R = 110;
const DRAG_LAT_PER_R = 70;
/** Flung spin decays at this rate per second (same exponential as the intro). */
const INERTIA_RATE = 2.2;
/** Idle seconds after a drag before the globe eases back to the pin, and the
    rate it returns at. Slow enough to read as drift, not as a snap-back. */
const RETURN_DELAY = 2.2;
const RETURN_RATE = 0.9;
/** Dragged view latitude is clamped here, so the poles never swing into view. */
const VIEW_LAT_MIN = -55;
const VIEW_LAT_MAX = 70;
/** Ceiling on flung velocity (deg/s), so a fast flick can't blur the globe. */
const MAX_FLING = 720;

/** Front-hemisphere dots are bucketed into this many alpha levels for batching. */
const ALPHA_STEPS = 6;

const DEG = Math.PI / 180;

/** Pin colour — emerald, echoing the section's live-status ping. */
const PIN_RGB = "16, 185, 129";

/** Coordinate readout shown beside the pin's leader line. */
const PIN_COORDS = "11.56°N 104.93°E";

/** Polaroid card geometry, all relative to the globe radius R. */
const CARD_W = 0.62;
/** Height of the caption band under the photo, as a fraction of card width. */
const CARD_LIP = 0.3;
/** White border around the photo window, as a fraction of card width. */
const CARD_PAD = 0.06;
/** Resting tilt of the card (deg); it rocks by ±ROCK_DEG with the sway. */
const CARD_TILT = -4;
const ROCK_DEG = 1.6;

/**
 * Rotating dot-matrix Earth pinned on Phnom Penh, rendered on a 2D canvas.
 * Land dots come from a packed Natural Earth lattice ({@link decodeLandDots});
 * the globe spins in from the Atlantic, settles over Cambodia, then sways
 * gently so the pin never leaves view.
 *
 * The pin carries a surveyor-style callout: a leader line from Phnom Penh up
 * into the blank Pacific to the globe's upper right (a land-dot globe leaves
 * oceans empty, so the callout needs no backdrop). When a {@link photo} is
 * given the callout is a polaroid card — photo, caption, coordinates — that
 * tracks the pin and rocks gently with the sway; until it decodes (or when no
 * photo is set) the callout falls back to a plain text readout.
 *
 * The globe is draggable: a pointer drag turns it in longitude and tilts it in
 * latitude, a flick throws it with inertia, and after {@link RETURN_DELAY}
 * seconds of stillness it drifts back to the pin. Vertical page scrolling is
 * left alone on touch (`touch-action: pan-y`), so only horizontal drags are
 * captured there.
 *
 * Behaviour contract (mirrors DotMatrix):
 * - Reduced motion → one settled frame is drawn, then the loop never runs.
 *   Dragging still works — it is user-driven, not autoplay — and repaints that
 *   single frame per pointer move, with no inertia or drift-back.
 * - The loop pauses while offscreen or the tab is hidden.
 * - Rendering is capped at 2× devicePixelRatio.
 * - Colours resolve from the theme tokens and re-resolve when the theme flips.
 * - Purely decorative (the "Based in" card carries the text), so hidden
 *   from AT.
 */
export function Globe(props: {
  label?: string;
  /** Optional polaroid pinned to the location. Decorative — the "Based in"
      card carries the same information as text. */
  photo?: { src: string; caption?: string };
  className?: string;
}) {
  const { label, photo, className } = props;
  const photoSrc = photo?.src;
  const photoCaption = photo?.caption;

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

    /* -------------------------------- Drag -------------------------------- */
    /* User rotation lives as an offset on top of the ambient sway, so the two
       compose instead of one overriding the other. */
    let lonOffset = 0;
    let latOffset = 0;
    let vLon = 0;
    let vLat = 0;
    let dragging = false;
    /* Once the user takes hold, the intro spin is folded into lonOffset and
       stops contributing, so the two never fight over the same axis. */
    let interacted = false;
    /* Elapsed clock read by the pointer handlers (which have no frame time of
       their own) and by the inertia/return integrator. */
    let elapsedNow = 0;
    let idleSince = 0;
    let lastFrame = 0;
    /* Globe radius from the last draw — drag distance is measured in radii so
       the same gesture turns the globe equally at any size. */
    let lastR = 1;

    const clampLat = (deg: number) =>
      Math.min(VIEW_LAT_MAX - VIEW_LAT, Math.max(VIEW_LAT_MIN - VIEW_LAT, deg));

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
    const sinPinLat = Math.sin(PIN_LAT * DEG);
    const cosPinLat = Math.cos(PIN_LAT * DEG);

    /* One reusable scratch list per alpha bucket, so a draw sets fillStyle
       once per level instead of once per dot (same trick as DotMatrix). */
    const buckets: number[][] = Array.from({ length: ALPHA_STEPS }, () => []);

    /* ------------------------------- Colours ------------------------------ */
    /* Theme tokens resolve through the canvas's computed style, so any format
       the tokens are authored in comes back as plain rgb() numbers. */
    let primary = "255, 255, 255";
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

    /* -------------------------------- Photo ------------------------------- */
    /* Decoded off the main thread; the callout renders as text until it lands,
       so a slow image never blocks or pops the globe. */
    let photoImg: HTMLImageElement | null = null;
    if (photoSrc) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = photoSrc;
      img
        .decode()
        .then(() => {
          photoImg = img;
          // The animated path picks it up on the next frame; the static one
          // has to be told to repaint.
          if (reduceMq.matches) drawSettled();
        })
        .catch(() => {});
    }

    /* -------------------------------- Draw -------------------------------- */
    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, w, h);
      const size = Math.min(w, h);
      if (size < 40) return;

      const cx = w / 2;
      const cy = h / 2;
      const R = size * 0.44;
      lastR = R;
      const dot = Math.max(1.4, R * 0.013);

      // View longitude: pin + ambient sway + drag + decaying intro offset.
      const sway = SWAY_DEG * Math.sin((elapsed / SWAY_PERIOD) * 2 * Math.PI);
      const intro = interacted
        ? 0
        : INTRO_DEG * Math.exp(-elapsed * INTRO_RATE);
      const viewLon = (PIN_LON + sway + lonOffset + intro) * DEG;
      const sinV = Math.sin(viewLon);
      const cosV = Math.cos(viewLon);
      const viewLat = (VIEW_LAT + latOffset) * DEG;
      const sinView = Math.sin(viewLat);
      const cosView = Math.cos(viewLat);

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
      const sinD =
        Math.sin(PIN_LON * DEG) * cosV - Math.cos(PIN_LON * DEG) * sinV;
      const cosD =
        Math.cos(PIN_LON * DEG) * cosV + Math.sin(PIN_LON * DEG) * sinV;
      const px = cx + R * (cosPinLat * sinD);
      const py = cy - R * (cosView * sinPinLat - sinView * cosPinLat * cosD);
      const pz = sinView * sinPinLat + cosView * cosPinLat * cosD;
      if (pz <= 0.05) return; // behind the limb during the intro spin

      // Fade the pin in as it rounds the limb so it doesn't pop.
      const reveal = Math.min(1, (pz - 0.05) / 0.25);

      // Expanding ping rings, two running half a cycle apart.
      for (let k = 0; k < 2; k++) {
        const p = (((elapsed / RING_PERIOD + k * 0.5) % 1) + 1) % 1;
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
      if (size < 220) return; // too cramped for legible text

      const fs = Math.min(12, Math.max(10, R * 0.062));
      const name = (label ?? "").toUpperCase();

      /* Polaroid variant: a photo card tethered to the pin, rocking with the
         sway. It rotates about the tethered corner, so the leader line always
         meets the card exactly whatever the tilt. */
      if (photoImg) {
        const cardW = R * CARD_W;
        const pad = cardW * CARD_PAD;
        const inner = cardW - pad * 2;
        const lip = cardW * CARD_LIP;
        const cardH = pad + inner + lip;

        // Tether the card's bottom-left corner up-right of the pin, then keep
        // the whole card on-canvas at the sway's extremes.
        const ax = Math.min(Math.max(px + R * 0.16, 4), w - cardW - 6);
        const ay = Math.min(Math.max(py - R * 0.06, cardH + 8), h - 4);

        ctx.strokeStyle = `rgba(${PIN_RGB}, ${0.5 * reveal})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + 3, py - 3);
        ctx.lineTo(ax, ay);
        ctx.stroke();

        ctx.save();
        ctx.globalAlpha = reveal;
        ctx.translate(ax, ay);
        ctx.rotate((CARD_TILT + ROCK_DEG * (sway / SWAY_DEG)) * DEG);

        // Paper. Kept light in both themes — a polaroid reads as a physical
        // object, not a surface that follows the theme.
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = R * 0.09;
        ctx.shadowOffsetY = R * 0.02;
        ctx.fillStyle = "#fafaf9";
        ctx.beginPath();
        ctx.rect(0, -cardH, cardW, cardH);
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;

        // Photo window, centre-cropped to a square so any source ratio fills it.
        const side = Math.min(photoImg.width, photoImg.height);
        ctx.save();
        ctx.beginPath();
        ctx.rect(pad, -cardH + pad, inner, inner);
        ctx.clip();
        ctx.drawImage(
          photoImg,
          (photoImg.width - side) / 2,
          (photoImg.height - side) / 2,
          side,
          side,
          pad,
          -cardH + pad,
          inner,
          inner,
        );
        ctx.restore();

        // Caption + coordinates share the lip, ink-on-paper rather than themed.
        const caption = (photoCaption ?? label ?? "").trim();
        ctx.textAlign = "center";
        ctx.textBaseline = "alphabetic";
        if (caption) {
          ctx.font = `500 ${fs}px ${fontFamily}`;
          ctx.fillStyle = "rgba(28, 25, 23, 0.92)";
          ctx.fillText(caption, cardW / 2, -lip + fs * 0.95);
        }
        ctx.font = `400 ${fs * 0.78}px ${fontFamily}`;
        ctx.fillStyle = "rgba(87, 83, 78, 0.85)";
        ctx.fillText(PIN_COORDS, cardW / 2, -lip + fs * 2.1);
        ctx.textAlign = "start";

        ctx.restore();
        return;
      }

      // Text variant: leader line up-right from the pin into the empty
      // Pacific, ending in a shelf that underlines the name + coordinates.
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

    /* ---------------------------- Drag integrator --------------------------- */
    /* Runs once per frame between draws: coasts the flung velocity down, then
       (once the user has been still a beat) eases the offsets back to the pin.
       Both use exponential decay, matching the intro spin's feel. */
    const advance = (elapsed: number) => {
      const dt = Math.min(0.05, elapsed - lastFrame);
      lastFrame = elapsed;
      elapsedNow = elapsed;
      if (dragging || dt <= 0) return;

      if (vLon || vLat) {
        lonOffset += vLon * dt;
        latOffset = clampLat(latOffset + vLat * dt);
        const coast = Math.exp(-INERTIA_RATE * dt);
        vLon *= coast;
        vLat *= coast;
        if (Math.abs(vLon) < 0.5) vLon = 0;
        if (Math.abs(vLat) < 0.5) vLat = 0;
      }

      /* Longitude is modular, so once the spin has stopped, fold whole turns
         away. Without this a globe wound three times round would rewind all
         three on the way home instead of taking the short way back. */
      if (!vLon) lonOffset = ((((lonOffset + 180) % 360) + 360) % 360) - 180;

      if (elapsed - idleSince > RETURN_DELAY) {
        const home = Math.exp(-RETURN_RATE * dt);
        lonOffset *= home;
        latOffset *= home;
        if (Math.abs(lonOffset) < 0.05) lonOffset = 0;
        if (Math.abs(latOffset) < 0.05) latOffset = 0;
      }
    };

    /* ------------------------------ Lifecycle ------------------------------ */
    const loop = (now: number) => {
      if (!running) return;
      if (!start) start = now;
      const elapsed = (now - start) / 1000;
      advance(elapsed);
      draw(elapsed);
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

    /* ---------------------------- Drag handlers ---------------------------- */
    let pointerId: number | null = null;
    let lastX = 0;
    let lastY = 0;
    let lastMove = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (pointerId !== null || !e.isPrimary) return;
      pointerId = e.pointerId;
      // Capture throws if the pointer is already gone; the drag still works
      // off the element's own events, so a failure here is not fatal.
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {}
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      lastMove = e.timeStamp;
      vLon = 0;
      vLat = 0;
      // Fold whatever is left of the intro spin into the offset, so taking
      // hold mid-intro neither jumps nor keeps spinning underneath the drag.
      if (!interacted) {
        lonOffset += INTRO_DEG * Math.exp(-elapsedNow * INTRO_RATE);
        interacted = true;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      /* Direct manipulation: the surface follows the pointer. Dots project at
         sin(lon − viewLon), so dragging right (surface right, revealing what
         lay to the west) means viewLon has to go *down* — hence the negated
         longitude. Latitude is already in the same sense: raising viewLat
         looks further north, pushing the surface down under the pointer. */
      const dLon = -((e.clientX - lastX) / lastR) * DRAG_LON_PER_R;
      const dLat = ((e.clientY - lastY) / lastR) * DRAG_LAT_PER_R;
      lastX = e.clientX;
      lastY = e.clientY;

      lonOffset += dLon;
      latOffset = clampLat(latOffset + dLat);

      // Velocity for the release fling, smoothed so one jittery sample can't
      // dominate, and capped so a fast flick stays legible.
      const dt = Math.max(0.008, (e.timeStamp - lastMove) / 1000);
      lastMove = e.timeStamp;
      const cap = (v: number) => Math.max(-MAX_FLING, Math.min(MAX_FLING, v));
      vLon = cap(0.8 * (dLon / dt) + 0.2 * vLon);
      vLat = cap(0.8 * (dLat / dt) + 0.2 * vLat);

      // Reduced motion has no loop to pick this up, so repaint by hand.
      if (reduceMq.matches) drawSettled();
    };

    const endDrag = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      pointerId = null;
      dragging = false;
      idleSince = elapsedNow;
      // A drag that ended without recent movement shouldn't fling.
      if (e.timeStamp - lastMove > 120) {
        vLon = 0;
        vLat = 0;
      }
      // Reduced motion keeps whatever rotation the user left it at.
      if (reduceMq.matches) {
        vLon = 0;
        vLat = 0;
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);

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
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
    };
  }, [label, photoSrc, photoCaption]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block aspect-square w-full touch-pan-y cursor-grab font-mono active:cursor-grabbing ${className ?? ""}`}
    />
  );
}
