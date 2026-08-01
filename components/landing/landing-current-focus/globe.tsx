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

/** Degrees turned per arrow-key press. Large enough that a few presses get
    somewhere, small enough to aim with. */
const KEY_STEP = 12;

/** Photo cards ease in instead of replacing the fallback label in one frame. */
const PHOTO_REVEAL_RATE = 7;

/** Front-hemisphere dots are bucketed into this many alpha levels for batching. */
const ALPHA_STEPS = 6;

/** Daylight bands (night / twilight / day) each front dot is sorted into. The
    terminator therefore costs three fillStyle changes per depth band instead of
    one per dot — the same batching argument as {@link ALPHA_STEPS}. */
const DAY_LEVELS = 3;
/** |cos(sun angle)| under this reads as twilight: a soft ±7° band either side
    of the day/night line, so the terminator is a gradient and not a cut. */
const TWILIGHT = 0.12;
/** Dot brightness multipliers for night / twilight / day.
    The night floor is deliberately high. A physically honest terminator drops
    the dark side to roughly a third, which looks superb over the Atlantic and
    is a real problem here: the globe always settles on Phnom Penh, and Phnom
    Penh is in darkness for half of every day, so the DEFAULT view would be the
    illegible one for half the site's visitors. The terminator is worth having
    as a lighting cue, not as a legibility cliff. */
const DAY_DIM = [0.7, 0.85, 1] as const;

/** Graticule: degrees between meridians/parallels, and the sampling step along
    each line. 4° stays smooth at the sizes this actually renders at. */
const GRAT_SPACING = 30;
const GRAT_SAMPLE = 4;
/** Parallels stop here, so the lines don't bunch into a knot at the poles. */
const GRAT_LAT_LIMIT = 60;
/** Meridians run past the last parallel but still stop short of the pole. */
const MERIDIAN_LAT_LIMIT = 80;

const DEG = Math.PI / 180;

/**
 * The sub-solar point — the spot the sun is directly overhead — at a moment.
 *
 * Declination is the standard cosine approximation, and the hour angle assumes
 * the sun is over Greenwich at 12:00 UTC. Both ignore the equation of time,
 * which is worth up to ~4° of longitude; at this globe's scale that is a
 * fraction of one dot, and nobody is navigating by it.
 */
function subsolarPoint(at: Date) {
  const year = at.getUTCFullYear();
  const dayOfYear =
    (Date.UTC(year, at.getUTCMonth(), at.getUTCDate()) - Date.UTC(year, 0, 0)) /
    86400000;
  const decl =
    -23.44 * DEG * Math.cos(((2 * Math.PI) / 365.25) * (dayOfYear + 10));
  const utcHours =
    at.getUTCHours() + at.getUTCMinutes() / 60 + at.getUTCSeconds() / 3600;
  // The sun tracks west at 15°/h from 0° at noon UTC.
  const lon = (12 - utcHours) * 15 * DEG;
  return {
    sinDecl: Math.sin(decl),
    cosDecl: Math.cos(decl),
    sinLon: Math.sin(lon),
    cosLon: Math.cos(lon),
  };
}

/** Sin/cos tables for a degree sweep — graticule trig, hoisted out of the frame. */
function trigTable(fromDeg: number, toDeg: number, stepDeg: number) {
  const sin: number[] = [];
  const cos: number[] = [];
  for (let d = fromDeg; d <= toDeg; d += stepDeg) {
    sin.push(Math.sin(d * DEG));
    cos.push(Math.cos(d * DEG));
  }
  return { sin: Float32Array.from(sin), cos: Float32Array.from(cos) };
}

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
 * Three things sell the sphere. A graticule of meridians and parallels sits
 * under the land, its pen lifting behind the limb. Land dots are shaded by a
 * real day/night terminator — the sub-solar point is computed from the actual
 * UTC clock ({@link subsolarPoint}), so the lit half genuinely tracks the sun
 * and the ambient highlight sits where the sun is. And the disc darkens toward
 * its edge, so the flat lattice reads as curved.
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
 * captured there. Arrow keys turn it by {@link KEY_STEP} and Home returns it to
 * the pin, so the rotation is not a pointer-only affordance.
 *
 * Behaviour contract (mirrors DotMatrix):
 * - Reduced motion → one settled frame is drawn, then the loop never runs.
 *   Dragging still works — it is user-driven, not autoplay — and repaints that
 *   single frame per pointer move, with no inertia or drift-back.
 * - The loop pauses while offscreen or the tab is hidden.
 * - Rendering is capped at 2× devicePixelRatio.
 * - Colours resolve from the theme tokens and re-resolve when the theme flips.
 * - Given a {@link description} the canvas is announced as a labelled image and
 *   takes one tab stop; without one the whole thing is hidden from AT as pure
 *   decoration. It is never both interactive and unreachable.
 */
export function Globe(props: {
  label?: string;
  /**
   * Accessible name for the canvas. Supplying it opts the globe INTO the
   * accessibility tree and the tab order — pass a localized string, since it is
   * announced verbatim and also has to carry the arrow-key hint. Omit it and
   * the globe stays `aria-hidden` decoration.
   */
  description?: string;
  /** Optional polaroid pinned to the location. Decorative — the "Based in"
      card carries the same information as text. */
  photo?: { src: string; caption?: string };
  className?: string;
}) {
  const { label, description, photo, className } = props;
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
    let lastTick = 0;
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

    /* Graticule sample tables. The grid never moves relative to the globe, so
       every sine here is computed once and the per-frame cost is arithmetic. */
    const alongMeridian = trigTable(
      -MERIDIAN_LAT_LIMIT,
      MERIDIAN_LAT_LIMIT,
      GRAT_SAMPLE,
    );
    const alongParallel = trigTable(-180, 180, GRAT_SAMPLE);
    // -180 to 150: the meridian at +180 is the same line as the one at -180.
    const meridians = trigTable(-180, 180 - GRAT_SPACING, GRAT_SPACING);
    const parallels = trigTable(
      -GRAT_LAT_LIMIT,
      GRAT_LAT_LIMIT,
      GRAT_SPACING,
    );

    /* The terminator needs refreshing on the order of minutes — the sun moves
       15° an hour — so it is cached rather than recomputed every frame. */
    const SUN_TTL_MS = 30000;
    let sun = subsolarPoint(new Date());
    let sunAt = Date.now();

    /* One reusable scratch list per (depth × daylight) bucket, so a draw sets
       fillStyle once per band instead of once per dot (same trick as
       DotMatrix). */
    const buckets: number[][] = Array.from(
      { length: ALPHA_STEPS * DAY_LEVELS },
      () => [],
    );
    const backDots: number[] = [];

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
    let photoReadyAt: number | null = null;
    if (photoSrc) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = photoSrc;
      img
        .decode()
        .then(() => {
          photoImg = img;
          photoReadyAt = elapsedNow;
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

      // Refresh the sub-solar point on a slow cadence, not per frame.
      if (Date.now() - sunAt > SUN_TTL_MS) {
        sun = subsolarPoint(new Date());
        sunAt = Date.now();
      }
      const { sinDecl, cosDecl, sinLon: sinSub, cosLon: cosSub } = sun;

      // Project the sub-solar point through the same transform as the dots, so
      // the ambient highlight sits where the sun actually is rather than at a
      // fixed cosmetic offset. `lit` falls to 0 as the sun rounds the limb.
      const sunSinD = sinSub * cosV - cosSub * sinV;
      const sunCosD = cosSub * cosV + sinSub * sinV;
      const sunX = cosDecl * sunSinD;
      const sunY = cosView * sinDecl - sinView * cosDecl * sunCosD;
      const sunZ = sinView * sinDecl + cosView * cosDecl * sunCosD;
      const lit = Math.max(0, sunZ);

      // A quiet ocean tint and a sun-placed highlight make the dot lattice feel
      // like a sphere without competing with the land or the pinned location.
      // The highlight is pulled to 55% of the radius so the gradient stays on
      // the disc when the sun is near the limb.
      const sphere = ctx.createRadialGradient(
        cx + R * sunX * 0.55,
        cy - R * sunY * 0.55,
        R * 0.04,
        cx,
        cy,
        R,
      );
      sphere.addColorStop(0, `rgba(${primary}, ${(0.06 + 0.1 * lit).toFixed(3)})`);
      sphere.addColorStop(0.58, `rgba(${primary}, 0.045)`);
      sphere.addColorStop(1, `rgba(${primary}, 0.015)`);
      ctx.fillStyle = sphere;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.fill();

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

      /* ------------------------------ Graticule ----------------------------- */
      /* Meridians and parallels, drawn UNDER the land so the continents stay
         the subject. Each line is walked as a polyline and the pen lifts
         wherever the samples pass behind the limb, which is what keeps the far
         half of each circle from being drawn straight across the disc. */
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let m = 0; m < meridians.sin.length; m++) {
        // Longitude is fixed along a meridian, so its rotation solves once.
        const sinD = meridians.sin[m] * cosV - meridians.cos[m] * sinV;
        const cosD = meridians.cos[m] * cosV + meridians.sin[m] * sinV;
        let pen = false;
        for (let i = 0; i < alongMeridian.sin.length; i++) {
          const sa = alongMeridian.sin[i];
          const ca = alongMeridian.cos[i];
          if (sinView * sa + cosView * ca * cosD <= 0.03) {
            pen = false;
            continue;
          }
          const sx = cx + R * (ca * sinD);
          const sy = cy - R * (cosView * sa - sinView * ca * cosD);
          if (pen) ctx.lineTo(sx, sy);
          else {
            ctx.moveTo(sx, sy);
            pen = true;
          }
        }
      }
      for (let p = 0; p < parallels.sin.length; p++) {
        const sa = parallels.sin[p];
        const ca = parallels.cos[p];
        let pen = false;
        for (let i = 0; i < alongParallel.sin.length; i++) {
          const sinD = alongParallel.sin[i] * cosV - alongParallel.cos[i] * sinV;
          const cosD = alongParallel.cos[i] * cosV + alongParallel.sin[i] * sinV;
          if (sinView * sa + cosView * ca * cosD <= 0.03) {
            pen = false;
            continue;
          }
          const sx = cx + R * (ca * sinD);
          const sy = cy - R * (cosView * sa - sinView * ca * cosD);
          if (pen) ctx.lineTo(sx, sy);
          else {
            ctx.moveTo(sx, sy);
            pen = true;
          }
        }
      }
      ctx.strokeStyle = `rgba(${primary}, 0.075)`;
      ctx.stroke();

      // The equator again, over the top of its faint pass — the one line worth
      // reading as a reference rather than as texture.
      ctx.beginPath();
      {
        let pen = false;
        for (let i = 0; i < alongParallel.sin.length; i++) {
          const sinD = alongParallel.sin[i] * cosV - alongParallel.cos[i] * sinV;
          const cosD = alongParallel.cos[i] * cosV + alongParallel.sin[i] * sinV;
          // lat 0 ⇒ sin = 0, cos = 1, so the projection collapses to this.
          if (cosView * cosD <= 0.03) {
            pen = false;
            continue;
          }
          const sx = cx + R * sinD;
          const sy = cy + R * (sinView * cosD);
          if (pen) ctx.lineTo(sx, sy);
          else {
            ctx.moveTo(sx, sy);
            pen = true;
          }
        }
      }
      ctx.strokeStyle = `rgba(${primary}, 0.13)`;
      ctx.stroke();

      // Project every land dot and batch both hemispheres. Filling one path per
      // depth band is substantially cheaper than thousands of fillRect calls,
      // especially on high-DPI phones.
      for (const b of buckets) b.length = 0;
      backDots.length = 0;
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
          // Cosine of the sun's angle at this dot: > 0 lit, < 0 in shadow.
          // Expanded from cos(lon − subLon) so it reuses the hoisted tables.
          const cosSun =
            sinLat[i] * sinDecl +
            cosLat[i] * cosDecl * (cosLon[i] * cosSub + sinLon[i] * sinSub);
          const band = cosSun < -TWILIGHT ? 0 : cosSun < TWILIGHT ? 1 : 2;
          buckets[level * DAY_LEVELS + band].push(sx, sy);
        } else {
          backDots.push(sx, sy);
        }
      }

      const fillDotBatch = (list: number[], alpha: number) => {
        if (!list.length) return;
        ctx.fillStyle = `rgba(${primary}, ${alpha})`;
        ctx.beginPath();
        for (let k = 0; k < list.length; k += 2) {
          ctx.rect(list[k] - dot / 2, list[k + 1] - dot / 2, dot, dot);
        }
        ctx.fill();
      };

      fillDotBatch(backDots, 0.055);
      for (let level = 0; level < ALPHA_STEPS; level++) {
        const alpha = 0.16 + 0.6 * ((level + 0.5) / ALPHA_STEPS) ** 1.4;
        for (let band = 0; band < DAY_LEVELS; band++) {
          fillDotBatch(buckets[level * DAY_LEVELS + band], alpha * DAY_DIM[band]);
        }
      }

      // Limb shading. The disc darkens toward its edge, which is what makes a
      // flat lattice of dots read as a curved surface rather than a sticker.
      // Drawn over the land so it shades the dots too, but under the pin so the
      // pinned location stays at full strength.
      const limb = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
      limb.addColorStop(0, "rgba(0, 0, 0, 0)");
      limb.addColorStop(1, "rgba(0, 0, 0, 0.2)");
      ctx.fillStyle = limb;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, 2 * Math.PI);
      ctx.fill();

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
        const photoReveal = reduceMq.matches
          ? 1
          : 1 -
            Math.exp(
              -PHOTO_REVEAL_RATE *
                Math.max(0, elapsed - (photoReadyAt ?? elapsed)),
            );
        const cardW = R * CARD_W;
        const pad = cardW * CARD_PAD;
        const inner = cardW - pad * 2;
        const lip = cardW * CARD_LIP;
        const cardH = pad + inner + lip;

        // Tether the card's bottom-left corner up-right of the pin, then keep
        // the whole card on-canvas at the sway's extremes.
        const ax = Math.min(Math.max(px + R * 0.16, 4), w - cardW - 6);
        const ay = Math.min(Math.max(py - R * 0.06, cardH + 8), h - 4);

        ctx.strokeStyle = `rgba(${PIN_RGB}, ${0.5 * reveal * photoReveal})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + 3, py - 3);
        ctx.lineTo(ax, ay);
        ctx.stroke();

        ctx.save();
        ctx.globalAlpha = reveal * photoReveal;
        ctx.translate(ax, ay);
        ctx.rotate(
          (CARD_TILT + ROCK_DEG * (sway / SWAY_DEG)) * DEG * photoReveal,
        );
        const cardScale = 0.94 + photoReveal * 0.06;
        ctx.scale(cardScale, cardScale);

        // Paper. Kept light in both themes — a polaroid reads as a physical
        // object, not a surface that follows the theme. No drop shadow: over a
        // dark globe it read as a grey rectangle floating behind the card
        // rather than as depth.
        ctx.fillStyle = "#fafaf9";
        ctx.beginPath();
        ctx.rect(0, -cardH, cardW, cardH);
        ctx.fill();

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
    const advance = (elapsed: number, dt: number) => {
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
      const dt = lastTick ? Math.min(0.05, (now - lastTick) / 1000) : 0;
      lastTick = now;
      elapsedNow += dt;
      advance(elapsedNow, dt);
      draw(elapsedNow);
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      if (running || reduceMq.matches || !visible) return;
      running = true;
      lastTick = 0;
      raf = requestAnimationFrame(loop);
    };

    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
      lastTick = 0;
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

    /* Fold whatever is left of the intro spin into the offset, so taking hold
       mid-intro neither jumps nor keeps spinning underneath the user. Shared by
       the pointer and keyboard paths — either one counts as taking hold. */
    const foldIntro = () => {
      if (interacted) return;
      lonOffset += INTRO_DEG * Math.exp(-elapsedNow * INTRO_RATE);
      interacted = true;
    };

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
      foldIntro();
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

    /* -------------------------- Keyboard handlers -------------------------- */
    /* Keyboard parity with the drag. The signs match `onPointerMove` so a key
       press reads as a nudge in that direction — ArrowRight pushes the surface
       right, exactly as dragging right does. Home returns to the pin.
       Registered unconditionally: the canvas is only reachable by keyboard when
       `description` put it in the tab order, so this is inert otherwise. */
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;

      let dLon = 0;
      let dLat = 0;
      switch (e.key) {
        case "ArrowLeft":
          dLon = KEY_STEP;
          break;
        case "ArrowRight":
          dLon = -KEY_STEP;
          break;
        case "ArrowUp":
          dLat = -KEY_STEP;
          break;
        case "ArrowDown":
          dLat = KEY_STEP;
          break;
        case "Home":
          break;
        default:
          return;
      }

      // Arrows and Home scroll the page by default; while this canvas holds
      // focus it owns them.
      e.preventDefault();
      foldIntro();

      if (e.key === "Home") {
        lonOffset = 0;
        latOffset = 0;
      } else {
        lonOffset += dLon;
        latOffset = clampLat(latOffset + dLat);
      }

      // A key press is a discrete nudge, never a fling.
      vLon = 0;
      vLat = 0;
      idleSince = elapsedNow;
      // Reduced motion has no loop to pick this up, so repaint by hand.
      if (reduceMq.matches) drawSettled();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("keydown", onKeyDown);

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
      canvas.removeEventListener("keydown", onKeyDown);
    };
  }, [label, photoSrc, photoCaption]);

  return (
    // Without a `description` the whole thing is decoration and stays out of the
    // accessibility tree. With one, only the ornamental layers are hidden and
    // the canvas below carries the name — an element that answers the pointer
    // should not be unreachable by keyboard.
    <div
      aria-hidden={description ? undefined : true}
      className={`relative isolate aspect-square w-full select-none overflow-hidden ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[18%] top-[18%] h-[46%] w-[60%] rotate-12 rounded-full bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute right-[12%] top-[23%] size-1 rounded-full bg-primary/45 shadow-[0_0_12px_var(--primary)]" />
      <div className="pointer-events-none absolute bottom-[27%] left-[10%] size-1.5 rounded-full bg-primary/25 blur-[0.5px]" />
      <div className="pointer-events-none absolute left-[26%] top-[13%] size-1 rounded-full bg-foreground/20" />
      <div className="pointer-events-none absolute bottom-[16%] right-[24%] size-1 rounded-full bg-foreground/15" />

      <canvas
        ref={canvasRef}
        role={description ? "img" : undefined}
        aria-label={description}
        tabIndex={description ? 0 : undefined}
        className="absolute inset-0 z-10 block size-full touch-pan-y cursor-grab font-mono active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
    </div>
  );
}
