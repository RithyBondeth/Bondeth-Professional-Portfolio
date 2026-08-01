"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/utils/theme/theme-provider";

/* ─────────────────────────────────────────────────────────────────────────────
   Ribbon Field — the 21st.dev "Animated Gradient" stripe preset.

   A hard-edged stripe field laid along `ANGLE`, with the bands bent by a
   cross-axis sine. At `WAVE = 0` it is EXACTLY the exported CSS
   `linear-gradient(38deg, …)`; the wave is what a linear-gradient cannot do,
   and the only reason this is a canvas at all.

   Why a fragment shader rather than a 2D canvas:
   two of the four stop transitions are 0.72% and 0.36% of the gradient length
   wide — near-hard edges. Feathering that in a JS pixel loop means running it
   at full device resolution every frame (millions of pixels), and rendering
   small then upscaling turns those edges into stair-steps along the 38°
   diagonal. One full-screen triangle costs nothing and keeps the edges crisp.

   The CSS approximation from the same export is painted on the wrapper
   underneath, so a machine with no WebGL still gets the static gradient rather
   than a blank page.
   ──────────────────────────────────────────────────────────────────────────── */

/* ------------------------------ Reference params ---------------------------- */
/* Straight from the preset's parameter dump. Anything the "stripes" mode does
   not read (count / envelope / pixel* / arch*) is deliberately absent. */
const ANGLE = 38; // deg, CSS linear-gradient convention (0 = up, clockwise)
const WAVE = 14; // 0-100, cross-axis bend depth
const GRAIN = 42; // 0-100; the export renders this as overlay @ GRAIN/200
const SPEED = 100; // 0-100 → ph = elapsedSeconds * SPEED/100
const MOTION_AMOUNT = 0; // 0-100; the preset's sway/spin amount — zero here
const MOTION_REVERSE = false;
const SEED = 174074637; // grain seed, so the texture is stable across reloads

/* The wave clock is the ONLY thing that moves at MOTION_AMOUNT = 0. It starts
   at 20.75 and advances at 1.2 units/sec, so the field at t = 0 is the still
   frame the preset previews — nothing snaps when the loop starts. */
const WAVE_CLOCK_START = 20.75;
const WAVE_CLOCK_RATE = 1.2;

/* Stop positions of the colour ramp, verbatim from the exported CSS. They are
   what `pos` (18/57/60/100) and `softness` (24) resolve to — each pair is one
   feathered edge, and the widths are wildly uneven (28.86 / 0.72 / 0.36 pts)
   because softness scales with the gap between neighbouring stops. Copied
   rather than re-derived: this is the published output, and guessing at the
   generator's internal formula would only drift from it. */
const STOPS = [0.3318, 0.3786, 0.5814, 0.5886, 0.7964, 0.8] as const;

/* ---------------------------------- Palette --------------------------------- */
/* `light` is the preset's palette unchanged: White 18 → Sky blue 57 →
   Ultramarine 60 → Iris 100.

   `dark` is NOT in the preset — the preset has no dark variant. It is the same
   four bands walked down to the `#0B1220` backdrop the export ships with,
   because this canvas is the literal ground every paragraph on the site sits
   on: the light palette under a dark theme is near-white text on near-white
   sky blue. Each dark entry is kept at or below the luminance of the old
   background's ceiling (#1a3454), where `--muted-foreground` still clears AA. */
const PALETTES: Record<"light" | "dark", readonly [string, string, string, string]> = {
  light: ["#FFFFFF", "#78B8F9", "#5667FF", "#4D2FF9"],
  dark: ["#0B1220", "#14314F", "#1E2A63", "#241A5E"],
};

/* How far each theme pulls the whole field toward its own first colour.
   The blend happens BEFORE the grain, so the texture is not washed out with it.

   Light is not a taste setting, it is what makes the page typeable. The raw
   preset runs from pure white (L 1.0) to Iris (L 0.105) — a 6.8:1 internal
   range — and no single ink clears AA at both ends: it would have to be darker
   than L 0.18 to read on the white and lighter than L 0.65 to read on the Iris.
   At 0.5 toward white the darkest band lands at L 0.373, the field spans
   2.5:1 end to end, and one set of neutrals covers all of it. The bands, the
   bend and the grain all survive; only the saturation comes down.

   Dark needs none of this: the dark ramp is already a narrow, dark range and
   the light-on-dark neutrals clear AA across all four bands. */
const VEIL: Record<"light" | "dark", number> = { light: 0.5, dark: 0 };

/* ---------------------------------- Shaders --------------------------------- */
const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;

uniform vec2  u_res;      // drawing-buffer size, device pixels
uniform float u_px;       // devicePixelRatio, so grain stays a CSS-pixel texture
uniform float u_angle;    // degrees
uniform float u_clock;    // wave clock
uniform float u_wave;     // 0-100
uniform float u_grain;    // final overlay opacity
uniform float u_seed;
uniform float u_veil;     // 0-1 blend toward u_veilColor
uniform vec3  u_veilColor;
uniform vec3  u_c0;
uniform vec3  u_c1;
uniform vec3  u_c2;
uniform vec3  u_c3;

const float TAU = 6.28318530718;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

/* Photoshop "overlay", matching the export's background-blend-mode. */
vec3 overlayBlend(vec3 base, float g) {
  return mix(2.0 * base * g, 1.0 - 2.0 * (1.0 - base) * (1.0 - g), step(0.5, base));
}

void main() {
  // Work in CSS space (y down) so the angle matches linear-gradient exactly.
  vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 c = u_res * 0.5;                       // centerX / centerY = 50%

  float a = radians(u_angle);
  vec2 dir  = vec2(sin(a), -cos(a));
  vec2 perp = vec2(cos(a),  sin(a));

  // CSS's gradient-line length for the box, so 0%/100% land where CSS puts them.
  float lenAxis  = abs(u_res.x * sin(a)) + abs(u_res.y * cos(a));
  float lenCross = abs(u_res.x * cos(a)) + abs(u_res.y * sin(a));

  vec2 d = p - c;
  float t  = 0.5 + dot(d, dir)  / lenAxis;
  float cr = 0.5 + dot(d, perp) / lenCross;

  // The bend. This is the whole difference from a linear-gradient.
  t += (u_wave / 100.0) * 0.35 * sin(cr * 2.4 * TAU + u_clock);

  // Sequential mixes == the CSS ramp: each band is fully opaque before the
  // next edge begins, so ordering them is enough. smoothstep does the
  // feathering the softness parameter asks for.
  vec3 col = u_c0;
  col = mix(col, u_c1, smoothstep(${STOPS[0]}, ${STOPS[1]}, t));
  col = mix(col, u_c2, smoothstep(${STOPS[2]}, ${STOPS[3]}, t));
  col = mix(col, u_c3, smoothstep(${STOPS[4]}, ${STOPS[5]}, t));

  col = mix(col, u_veilColor, u_veil);

  // Static grain: seeded by position only, never by the clock. Driving it from
  // time would turn a paper texture into full-screen film-grain flicker.
  float g = hash(floor(gl_FragCoord.xy / u_px) + u_seed);
  col = mix(col, overlayBlend(col, g), u_grain);

  gl_FragColor = vec4(col, 1.0);
}
`;

/* --------------------------------- Utilities -------------------------------- */
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Blend a hex colour toward another by `amount`, in sRGB — as the shader does. */
function veilHex(hex: string, toward: string, amount: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(toward);
  const ch = (i: number) =>
    Math.round((a[i] + (b[i] - a[i]) * amount) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${ch(0)}${ch(1)}${ch(2)}`;
}

/**
 * The export's CSS approximation, rebuilt for whichever palette is live.
 *
 * It carries the veil too. Without that, the split second before the GL context
 * is up — and every no-WebGL session — would show the field at full saturation,
 * which is exactly the state the neutrals below are NOT tuned for.
 */
function toCssGradient(palette: readonly string[], veil: number): string {
  const [c0, c1, c2, c3] = palette.map((c) => veilHex(c, palette[0], veil));
  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
  return (
    `linear-gradient(${ANGLE}deg, ${c0} 0%, ${c0} ${pct(STOPS[0])}, ` +
    `${c1} ${pct(STOPS[1])}, ${c1} ${pct(STOPS[2])}, ` +
    `${c2} ${pct(STOPS[3])}, ${c2} ${pct(STOPS[4])}, ` +
    `${c3} ${pct(STOPS[5])}, ${c3} 100%)`
  );
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error(
      gl.isContextLost()
        ? "WebGL context was lost before shader compilation."
        : "Unable to create WebGL shader.",
    );
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(
      log ??
        (gl.isContextLost()
          ? "WebGL context was lost during shader compilation."
          : "Shader compilation failed without a driver log."),
    );
  }
  return shader;
}

/* ------------------------------ The React layer ----------------------------- */
interface IRibbonFieldProps {
  /** Extra classes for the fixed wrapper. */
  className?: string;
  /** Override the per-theme `VEIL`. 0 is the preset exactly as published. */
  veil?: number;
}

/**
 * The site's ambient background — the Ribbon Field stripe preset.
 *
 * Mounted ONCE, fixed to the viewport, from the root layout. Not per-section:
 * a copy per section puts a seam at every section boundary.
 *
 * Behaviour contract (unchanged from the gradient it replaces):
 * - Reduced motion, or a coarse pointer → one static frame, loop never starts.
 * - The loop pauses while the tab is hidden, and re-bases its clock on resume
 *   so the ribbons never jump forward by the time spent in the background.
 * - Re-initialises on a theme change via the canvas `key`, which is also what
 *   guarantees a fresh GL context rather than a second program on a stale one.
 * - Falls back to the exported CSS approximation if WebGL is unavailable.
 * - Purely decorative, so it is hidden from assistive tech.
 */
export function RibbonField({ className, veil }: IRibbonFieldProps) {
  const { resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const palette = PALETTES[resolvedTheme];
  const veilAmount = veil ?? VEIL[resolvedTheme];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: false, // a full-screen quad has no geometry edges to smooth
      alpha: false,
      depth: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      // The wrapper's CSS gradient is already painted underneath; leaving the
      // canvas untouched (and transparent) is the whole fallback.
      console.error("RibbonField: no WebGL, falling back to the CSS gradient.");
      return;
    }

    let program: WebGLProgram | null = null;
    let vertexShader: WebGLShader | null = null;
    let fragmentShader: WebGLShader | null = null;
    try {
      program = gl.createProgram();
      if (!program) throw new Error("Unable to create WebGL program.");
      vertexShader = compile(gl, gl.VERTEX_SHADER, VERT);
      fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? "link failed");
      }
    } catch (error) {
      if (program) gl.deleteProgram(program);
      if (vertexShader) gl.deleteShader(vertexShader);
      if (fragmentShader) gl.deleteShader(fragmentShader);
      console.error("RibbonField: falling back to the CSS gradient.", error);
      return;
    }
    gl.useProgram(program);

    // One oversized triangle covering the clip volume — cheaper than a quad,
    // and no diagonal seam down the middle.
    const buffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("u_res");
    const uPx = u("u_px");
    const uClock = u("u_clock");
    const uAngle = u("u_angle");

    // Everything that never changes for the life of this context.
    gl.uniform1f(uAngle, ANGLE);
    gl.uniform1f(u("u_wave"), WAVE);
    gl.uniform1f(u("u_grain"), GRAIN / 200);
    gl.uniform1f(u("u_seed"), SEED % 1000);
    gl.uniform1f(u("u_veil"), Math.min(Math.max(veilAmount, 0), 1));
    gl.uniform3fv(u("u_veilColor"), hexToRgb(palette[0]));
    gl.uniform3fv(u("u_c0"), hexToRgb(palette[0]));
    gl.uniform3fv(u("u_c1"), hexToRgb(palette[1]));
    gl.uniform3fv(u("u_c2"), hexToRgb(palette[2]));
    gl.uniform3fv(u("u_c3"), hexToRgb(palette[3]));

    // Deliberately local, NOT read back off the canvas: this effect can re-run
    // against a canvas that is already the right size (StrictMode's double
    // invoke, a prop change), and skipping the upload then would leave the
    // freshly linked program with u_res still at its default (0,0) — a zero
    // gradient length, every fragment NaN, the whole field black.
    let lastW = -1;
    let lastH = -1;

    const resize = () => {
      // Cap the ratio at 2: the near-hard band edges need better than 1x to
      // stay clean on the diagonal, but a 3x phone gains nothing visible for
      // 2.25x the fragments.
      const px = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(window.innerWidth * px));
      const h = Math.max(1, Math.round(window.innerHeight * px));
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uPx, px);
    };

    const draw = (clock: number) => {
      gl.uniform1f(uClock, clock);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    /* ------------------------------- The loop ------------------------------- */
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Same rule the previous background used: a full-bleed layer whose contents
    // change every frame is re-rasterised every frame, which is exactly what a
    // phone cannot spare during a scroll.
    const coarseMq = window.matchMedia("(pointer: coarse)");
    const isStatic = () => reduceMq.matches || coarseMq.matches;

    let raf = 0;
    let running = false;
    // Elapsed *animated* seconds — advanced only while the loop actually runs,
    // so a spell in a background tab does not fast-forward the ribbons.
    let elapsed = 0;
    let last = 0;

    const frame = (now: number) => {
      // Clamp the delta for the same reason: one long frame must not jump the
      // wave forward by seconds.
      elapsed += Math.min(now - last, 1000 / 15) / 1000;
      last = now;

      const ph = elapsed * (SPEED / 100);
      const dir = MOTION_REVERSE ? -1 : 1;
      const spin = ph * dir;
      const amt = MOTION_AMOUNT / 100;

      // The preset's sway. Written as sin(x) so it is exactly 0 at ph = 0 —
      // hard bands must sway, not spin. At amt = 0 it contributes nothing, but
      // it stays here because MOTION_AMOUNT is the one knob worth turning.
      gl.uniform1f(uAngle, ANGLE + Math.sin(spin * 0.6) * 28 * amt);

      draw(WAVE_CLOCK_START + ph * WAVE_CLOCK_RATE);
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now(); // re-base, never measure against a stale origin
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    /** The wave clock for however far the animation has actually got. */
    const clockNow = () =>
      WAVE_CLOCK_START + elapsed * (SPEED / 100) * WAVE_CLOCK_RATE;

    const sync = () => {
      if (isStatic() || document.hidden) stop();
      else start();
    };

    const onResize = () => {
      resize();
      if (!running) draw(clockNow());
    };

    resize();
    // Paint once before anything else decides whether to loop. A WebGL canvas
    // created with `alpha: false` composites as OPAQUE BLACK until something is
    // drawn into it, so "not looping" has to still mean "one frame drawn" —
    // reduced motion, a coarse pointer, and a tab that was loaded in the
    // background all land here.
    draw(clockNow());
    sync();

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", sync);
    reduceMq.addEventListener("change", sync);
    coarseMq.addEventListener("change", sync);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", sync);
      reduceMq.removeEventListener("change", sync);
      coarseMq.removeEventListener("change", sync);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);

      // React development mode deliberately replays effects on the same DOM
      // node. Losing the context synchronously here poisons that still-mounted
      // canvas, so the replay receives a lost context and every shader compile
      // fails with a null driver log. Defer the destructive release and only do
      // it when React has actually removed this canvas (route/theme remount).
      queueMicrotask(() => {
        if (!canvas.isConnected) {
          gl.getExtension("WEBGL_lose_context")?.loseContext();
        }
      });
    };
  }, [palette, veilAmount]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className ?? ""}`}
      // The export's CSS approximation, sitting under the canvas. It is what
      // shows if WebGL is missing, and what covers the first paint before the
      // context is up. The body establishes an isolated stacking context so
      // this negative layer stays above its background after client navigation.
      style={{
        backgroundColor: palette[0],
        backgroundImage: toCssGradient(palette, veilAmount),
      }}
    >
      {/* Keyed on the theme so React swaps in a fresh <canvas> when it changes.
          Re-running the setup on the SAME canvas would hand back the same
          WebGL context and stack a second program onto it. */}
      <canvas
        key={resolvedTheme}
        ref={canvasRef}
        className="block h-full w-full"
      />
    </div>
  );
}
