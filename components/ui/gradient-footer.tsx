"use client";

/**
 * Gradient footer — a normal footer whose content reads first, with a blurred
 * rainbow pinned to the bottom of the viewport. The glow rests as a thin strip
 * along the floor and stretches up over the last stretch of scroll, hitting
 * full height exactly when you reach the end of the page.
 *
 * One inline <svg> — no canvas, no scroll spacer.
 *
 * Gradient design inspired by Dia Browser — https://www.diabrowser.com
 */

import {
  useEffect,
  useId,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/components/utils/animations/gsap";
import { useReducedMotion } from "@/components/utils/animations/use-motion";
import { cn } from "@/lib/utils";

interface IStop {
  offset: number;
  color: string;
}

const VBW = 1271;
const VBH = 599;

// Floor (0) → top (1): dark ember → blue → near-white → yellow → red-orange →
// magenta → transparent pink.
const DEFAULT_STOPS: IStop[] = [
  { offset: 0, color: "#340B05" },
  { offset: 0.1827, color: "#0358F7" },
  { offset: 0.2837, color: "#5092C7" },
  { offset: 0.4135, color: "#E1ECFE" },
  { offset: 0.5866, color: "#FFD400" },
  { offset: 0.6827, color: "#FA3D1D" },
  { offset: 0.8029, color: "#FD02F5" },
  { offset: 1, color: "#FFC0FD00" },
];

/**
 * Height curve for the blurred columns: a gentle power falloff, giving a flat
 * pyramid-like rise — short at the edges, tallest in the middle.
 */
function bellHeights(n: number, peak: number, valley: number): number[] {
  const out: number[] = [];
  const mid = (n - 1) / 2;
  for (let i = 0; i < n; i++) {
    const t = mid === 0 ? 0 : Math.abs(i - mid) / mid; // 0 center → 1 edge
    const eased = 1 - Math.pow(t, 1.24);
    out.push(peak * VBH * (valley + (1 - valley) * eased));
  }
  return out;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/**
 * False on the server and through hydration, true immediately after — the
 * portal needs a document, and the markup either side of hydration has to
 * match. Same shape as `useReducedMotion`, so nothing is set from an effect.
 */
const noopSubscribe = () => () => {};
function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

interface IGradientFooterProps {
  /** Footer content — links, wordmark, copyright — shown above the glow. */
  children?: ReactNode;
  /**
   * Height of the glow band pinned to the viewport bottom. Doubles as the
   * scroll distance the reveal takes, and the room reserved under the content.
   */
  gradientHeight?: string;
  /**
   * Resting height of the glow, as a fraction of the band — a thin, flat strip
   * of rainbow along the bottom edge before the scroll reveal starts. `0` keeps
   * it hidden until the last screen.
   */
  minReveal?: number;
  /** Number of blurred columns. */
  bars?: number;
  /** Blur radius in screen pixels — see `syncBlur` for why it isn't viewBox units. */
  blur?: number;
  /** Peak height as a fraction of the viewBox. */
  peak?: number;
  /** Edge height as a fraction of the peak (0..1). */
  valley?: number;
  /** Vertical rainbow gradient stops, floor (0) → top (1). */
  stops?: IStop[];
  className?: string;
}

export function GradientFooter({
  children,
  gradientHeight = "40vh",
  minReveal = 0.045,
  bars = 9,
  blur = 26,
  peak = 0.98,
  valley = 0.55,
  stops = DEFAULT_STOPS,
  className,
}: IGradientFooterProps) {
  const uid = useId().replace(/:/g, "");
  const footerRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const reduced = useReducedMotion();
  // The band can only be portaled once there is a document to portal into.
  const mounted = useIsClient();

  // `preserveAspectRatio="none"` stretches the viewBox to the band's real box,
  // and it stretches the blur with it — one stdDeviation would come out wide
  // and shallow on a desktop band and narrow and tall on a phone, where the
  // columns then read as hard vertical stripes. Convert the requested pixel
  // radius back into viewBox units per axis so the bloom is round everywhere.
  useEffect(() => {
    if (!mounted) return;
    const band = bandRef.current;
    const feBlur = blurRef.current;
    if (!band || !feBlur) return;

    const syncBlur = () => {
      const w = band.offsetWidth;
      const h = band.offsetHeight;
      // A hidden or not-yet-laid-out band would divide by ~0 and blow the blur
      // up; the observer fires again once it has a real box.
      if (w < 1 || h < 1) return;
      feBlur.setAttribute(
        "stdDeviation",
        `${(blur * VBW) / w} ${(blur * VBH) / h}`,
      );
    };

    syncBlur();
    const ro = new ResizeObserver(syncBlur);
    ro.observe(band);
    return () => ro.disconnect();
  }, [blur, mounted, reduced]);

  useEffect(() => {
    if (reduced || !mounted) return;
    const band = bandRef.current;
    const footer = footerRef.current;
    if (!band || !footer) return;

    let last = -1;
    const measure = () => {
      // offsetHeight ignores the transform, so the band can measure itself.
      const h = band.offsetHeight || 1;
      // How much page is left below the fold. Read off the footer's own rect
      // rather than window.scrollY: the footer sits inside ScrollSmoother's
      // transformed content, so its rect reflects the *smoothed* position and
      // the glow tracks the pixels the user actually sees, with no lag.
      const left = Math.max(
        0,
        footer.getBoundingClientRect().bottom - window.innerHeight,
      );
      const p = minReveal + (1 - minReveal) * clamp01((h - left) / h);
      if (Math.abs(p - last) < 0.0005) return;
      last = p;
      band.style.transform = `scaleY(${p})`;
    };

    // The reveal only ever runs while the footer is on screen, so the ticker
    // stays parked for the rest of the page.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.ticker.add(measure);
        } else {
          gsap.ticker.remove(measure);
          last = minReveal;
          band.style.transform = `scaleY(${minReveal})`;
        }
      },
      { threshold: 0 },
    );
    io.observe(footer);

    return () => {
      io.disconnect();
      gsap.ticker.remove(measure);
    };
  }, [reduced, minReveal, mounted]);

  const colW = VBW / bars;

  const glow = (
    <svg
      style={{ height: "100%", width: "100%", display: "block" }}
      viewBox={`0 0 ${VBW} ${VBH}`}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`grad-${uid}`} x1="0" y1="1" x2="0" y2="0">
          {stops.map((s) => (
            <stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </linearGradient>
        <filter id={`blur-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          {/* Overwritten per axis by syncBlur once the band has a real size;
              this value only covers the first paint. */}
          <feGaussianBlur ref={blurRef} stdDeviation={blur} />
        </filter>
      </defs>
      {bellHeights(bars, peak, valley).map((barH, i) => (
        <g key={i} filter={`url(#blur-${uid})`}>
          <rect
            x={i * colW}
            y={VBH - barH}
            width={colW * 1.23}
            height={barH}
            fill={`url(#grad-${uid})`}
          />
        </g>
      ))}
    </svg>
  );

  return (
    // The glow lands on the viewport floor, so the footer reserves the same
    // height beneath its content for it to land in.
    <footer
      ref={footerRef}
      className={cn("relative", className)}
      style={{ paddingBottom: gradientHeight }}
    >
      {children}

      {reduced ? (
        // Reduced motion: no scroll-linked reveal. The glow simply sits at full
        // height in the space the footer already reserved for it, appearing
        // when the footer does.
        <div
          ref={bandRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0"
          style={{ height: gradientHeight }}
        >
          {glow}
        </div>
      ) : (
        mounted &&
        createPortal(
          // Portaled to <body> on purpose: `fixed` inside ScrollSmoother's
          // transformed #smooth-content would be positioned against that
          // element and scroll away with the page. Same reasoning as
          // <GradientWave> in the root layout.
          <div
            ref={bandRef}
            aria-hidden
            className="pointer-events-none fixed inset-x-0 bottom-0 z-0"
            style={{
              height: gradientHeight,
              transformOrigin: "bottom",
              transform: `scaleY(${minReveal})`,
              willChange: "transform",
            }}
          >
            {glow}
          </div>,
          document.body,
        )
      )}
    </footer>
  );
}
