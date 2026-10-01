"use client";

import {
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo";
import type { FeatureCollection, Geometry } from "geojson";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import { decodeLandDots } from "./globe-land-dots";

const LAND_DATA_URL = "/data/ne_110m_land.json";
const PHNOM_PENH: [number, number] = [104.9282, 11.5564];
const HOME_ROTATION: [number, number, number] = [-104.9282, -11.5564, 0];
const PORTRAIT_URL = "/bondeth-profile.webp";
const LOGO_URL = "/icon.svg";

type Point = [number, number];

let landRequest: Promise<FeatureCollection<Geometry>> | undefined;
let cachedDots: Point[] | undefined;

function loadLand() {
  landRequest ??= fetch(LAND_DATA_URL).then(async (response) => {
    if (!response.ok) throw new Error("Unable to load globe data");
    return (await response.json()) as FeatureCollection<Geometry>;
  });
  return landRequest;
}

/**
 * The land lattice is precomputed (scripts/generate-globe-dots.mjs). Testing
 * 15,300 grid points with geoContains at runtime cost ~6.5s of main-thread
 * work per visit; decoding the baked bitmask takes well under a millisecond.
 */
function getLandDots() {
  cachedDots ??= decodeLandDots();
  return cachedDots;
}

interface WireframeDottedGlobeProps {
  className?: string;
  label: string;
  description: string;
}

function CambodiaFlag() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 30 20"
      className="h-3.5 w-[21px] shrink-0 overflow-hidden rounded-[2px] ring-1 ring-black/10"
    >
      <path fill="#032EA1" d="M0 0h30v20H0z" />
      <path fill="#E00025" d="M0 5h30v10H0z" />
      <path
        fill="#fff"
        d="M7 13h16v1H7v-1Zm2-2h2V9h2V8h1V6h2v2h1v1h2v2h2v2H9v-2Zm4 0h4v-1h-4v1Z"
      />
    </svg>
  );
}

export function WireframeDottedGlobe({
  className,
  label,
  description,
}: WireframeDottedGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const rotation = [...HOME_ROTATION] as [number, number, number];
    // Start facing Phnom Penh, so the very first frame — and the static frame
    // under reduced motion — is already home rather than at 0°, 0°.
    const projection = geoOrthographic()
      .clipAngle(90)
      .precision(0.5)
      .rotate(rotation);
    const path = geoPath(projection, context);
    const graticule = geoGraticule10();

    // Dots are available synchronously, so the globe draws on its first frame;
    // the coastline outlines join in once the land file has loaded.
    let land: FeatureCollection<Geometry> | undefined;
    const dots = getLandDots();
    let size = 0;
    let radius = 0;
    let dragging = false;
    let resumeAt = 0;
    let pointerStart: Point = [0, 0];
    let rotationStart: Point = [rotation[0], rotation[1]];
    let portraitReady = false;
    let logoReady = false;

    const portrait = new window.Image();
    portrait.decoding = "async";
    portrait.src = PORTRAIT_URL;
    portrait.decode().then(() => {
      portraitReady = true;
      render();
    }).catch(() => {});

    const logo = new window.Image();
    logo.decoding = "async";
    logo.src = LOGO_URL;
    logo.decode().then(() => {
      logoReady = true;
      render();
    }).catch(() => {});

    const render = () => {
      if (!size) return;

      context.clearRect(0, 0, size, size);
      context.save();

      const isDark = document.documentElement.dataset.theme === "dark";
      const ink = isDark ? "255, 255, 255" : "22, 24, 29";

      context.beginPath();
      context.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(${ink}, 0.52)`;
      context.lineWidth = Math.max(1, size / 360);
      context.stroke();

      context.beginPath();
      path(graticule);
      context.strokeStyle = `rgba(${ink}, 0.13)`;
      context.lineWidth = Math.max(0.65, size / 720);
      context.stroke();

      if (land) {
        context.beginPath();
        path(land as GeoPermissibleObjects);
        context.strokeStyle = `rgba(${ink}, 0.42)`;
        context.lineWidth = Math.max(0.8, size / 580);
        context.stroke();
      }

      const center = projection.invert?.([size / 2, size / 2]);
      const dotRadius = Math.max(0.85, size / 360);

      // All visible dots go into ONE path and one fill() — filling ~2,500
      // separate paths per frame was the render loop's biggest cost.
      context.beginPath();
      for (const dot of dots) {
        if (!center || geoDistance(center, dot) > Math.PI / 2) continue;
        const projected = projection(dot);
        if (!projected) continue;
        context.moveTo(projected[0] + dotRadius, projected[1]);
        context.arc(projected[0], projected[1], dotRadius, 0, Math.PI * 2);
      }
      context.fillStyle = `rgba(${ink}, 0.58)`;
      context.fill();

      if (center && geoDistance(center, PHNOM_PENH) <= Math.PI / 2) {
        const pin = projection(PHNOM_PENH);
        if (pin) {
          const avatarRadius = Math.max(21, size / 17);
          const avatarX = Math.min(
            size - avatarRadius - 8,
            pin[0] + size * 0.085,
          );
          const avatarY = Math.max(
            avatarRadius + 8,
            pin[1] - size * 0.1,
          );

          context.beginPath();
          context.moveTo(pin[0], pin[1]);
          context.lineTo(
            avatarX - avatarRadius * 0.65,
            avatarY + avatarRadius * 0.65,
          );
          context.strokeStyle = `rgba(${ink}, 0.55)`;
          context.lineWidth = Math.max(1, size / 360);
          context.stroke();

          context.beginPath();
          context.arc(pin[0], pin[1], Math.max(3.5, size / 105), 0, Math.PI * 2);
          context.fillStyle = "#d97757";
          context.fill();
          context.strokeStyle = isDark ? "#141413" : "#faf9f5";
          context.lineWidth = Math.max(1.5, size / 280);
          context.stroke();

          if (portraitReady) {
            context.save();
            context.shadowColor = "rgba(217, 119, 87, 0.2)";
            context.shadowBlur = Math.max(8, size / 38);
            context.beginPath();
            context.arc(avatarX, avatarY, avatarRadius + 3, 0, Math.PI * 2);
            context.fillStyle = isDark ? "#1f1f1e" : "#f6f6f4";
            context.fill();
            context.restore();

            context.save();
            context.beginPath();
            context.arc(avatarX, avatarY, avatarRadius, 0, Math.PI * 2);
            context.clip();

            const sourceSize = Math.min(portrait.naturalWidth, portrait.naturalHeight);
            const sourceX = (portrait.naturalWidth - sourceSize) / 2;
            const sourceY = Math.max(0, (portrait.naturalHeight - sourceSize) * 0.12);
            context.drawImage(
              portrait,
              sourceX,
              sourceY,
              sourceSize,
              sourceSize,
              avatarX - avatarRadius,
              avatarY - avatarRadius,
              avatarRadius * 2,
              avatarRadius * 2,
            );
            context.restore();

            context.beginPath();
            context.arc(avatarX, avatarY, avatarRadius + 1.5, 0, Math.PI * 2);
            context.strokeStyle = isDark ? "rgba(255,255,255,0.9)" : "#ffffff";
            context.lineWidth = Math.max(2, size / 220);
            context.stroke();

            if (logoReady) {
              const badgeSize = avatarRadius * 0.78;
              const badgeX = avatarX + avatarRadius * 0.58;
              const badgeY = avatarY + avatarRadius * 0.58;
              context.beginPath();
              context.arc(badgeX, badgeY, badgeSize * 0.6, 0, Math.PI * 2);
              context.fillStyle = isDark ? "#17191f" : "#ffffff";
              context.fill();
              context.drawImage(
                logo,
                badgeX - badgeSize / 2,
                badgeY - badgeSize / 2,
                badgeSize,
                badgeSize,
              );
            }
          }
        }
      }

      context.restore();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      size = Math.max(1, Math.floor(rect.width));
      radius = size * 0.43;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      projection.scale(radius).translate([size / 2, size / 2]);
      render();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    // Idle drift. The loop only runs while the globe is on screen (and rAF
    // already pauses in background tabs), so an off-screen globe costs nothing.
    const startedAt = performance.now();
    let previousTime = startedAt;
    let frame = 0;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const delta = Math.min(32, now - previousTime);
      previousTime = now;

      if (dragging || reduceMotion.matches || now < resumeAt) return;

      const elapsed = now - startedAt;
      const drift = (elapsed / 18000) * Math.PI * 2;
      const targetLongitude = HOME_ROTATION[0] + Math.sin(drift) * 22;
      const targetLatitude = HOME_ROTATION[1] + Math.cos(drift) * 3;
      const easeBack = 1 - Math.exp(-delta * 0.0015);
      rotation[0] += (targetLongitude - rotation[0]) * easeBack;
      rotation[1] += (targetLatitude - rotation[1]) * easeBack;
      projection.rotate(rotation);
      render();
    };

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(tick);
      } else if (!entry.isIntersecting && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersectionObserver.observe(canvas);

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      pointerStart = [event.clientX, event.clientY];
      rotationStart = [rotation[0], rotation[1]];
      canvas.setPointerCapture(event.pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      rotation[0] = rotationStart[0] + (event.clientX - pointerStart[0]) * 0.3;
      rotation[1] = Math.max(
        -70,
        Math.min(70, rotationStart[1] - (event.clientY - pointerStart[1]) * 0.25),
      );
      projection.rotate(rotation);
      render();
    };

    const onPointerUp = (event: PointerEvent) => {
      dragging = false;
      resumeAt = performance.now() + 1400;
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home"].includes(event.key)) {
        return;
      }
      event.preventDefault();

      if (event.key === "Home") {
        rotation[0] = HOME_ROTATION[0];
        rotation[1] = HOME_ROTATION[1];
      } else if (event.key === "ArrowLeft") rotation[0] -= 8;
      else if (event.key === "ArrowRight") rotation[0] += 8;
      else if (event.key === "ArrowUp") rotation[1] = Math.max(-70, rotation[1] - 8);
      else if (event.key === "ArrowDown") rotation[1] = Math.min(70, rotation[1] + 8);

      resumeAt = performance.now() + 1400;
      projection.rotate(rotation);
      render();
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("keydown", onKeyDown);

    loadLand()
      .then((data) => {
        land = data;
        render();
      })
      .catch(() => undefined);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className={cn("relative aspect-square w-full", className)}>
      <canvas
        ref={canvasRef}
        role="img"
        tabIndex={0}
        aria-label={description}
        className="size-full cursor-grab touch-pan-y outline-none transition-opacity duration-500 active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      />

      <div className="pointer-events-none absolute bottom-[8%] left-[8%] flex items-center gap-2 rounded-full border border-border/60 bg-background/90 px-3 py-2 text-xs font-medium text-foreground shadow-sm backdrop-blur-md">
        <CambodiaFlag />
        {label}
      </div>
    </div>
  );
}
