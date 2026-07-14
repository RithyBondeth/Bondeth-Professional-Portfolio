"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap";

interface ITiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees at the card edges. */
  maxTilt?: number;
  /** Show a pointer-tracking specular glare sheen. */
  glare?: boolean;
  /** Slight scale-up while hovered (1 = none). */
  hoverScale?: number;
}

/**
 * 3D perspective tilt: the card leans toward the pointer with a soft glare
 * highlight tracking across it. Desktop pointers only, disabled under
 * reduced motion — otherwise renders children untouched.
 */
export function TiltCard(props: ITiltCardProps) {
  /* ---------------------------------- Props --------------------------------- */
  const {
    children,
    className,
    maxTilt = 7,
    glare = true,
    hoverScale = 1.015,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        fine: "(pointer: fine)",
        motionOK: "(prefers-reduced-motion: no-preference)",
      },
      (ctx) => {
        const { fine, motionOK } = ctx.conditions as {
          fine: boolean;
          motionOK: boolean;
        };
        if (!fine || !motionOK) return;

        const rxTo = gsap.quickTo(el, "rotationX", {
          duration: 0.5,
          ease: "power2.out",
        });
        const ryTo = gsap.quickTo(el, "rotationY", {
          duration: 0.5,
          ease: "power2.out",
        });
        gsap.set(el, { transformPerspective: 900 });

        const sheen = glareRef.current;
        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width; // 0 → 1
          const py = (e.clientY - rect.top) / rect.height;
          ryTo((px - 0.5) * 2 * maxTilt);
          rxTo((0.5 - py) * 2 * maxTilt);
          if (sheen) {
            sheen.style.background = `radial-gradient(320px circle at ${px * 100}% ${py * 100}%, rgb(255 255 255 / 0.08), transparent 65%)`;
          }
        };
        const onEnter = () => {
          gsap.to(el, { scale: hoverScale, duration: 0.4, ease: "power2.out" });
          if (sheen) gsap.to(sheen, { opacity: 1, duration: 0.3 });
        };
        const onLeave = () => {
          rxTo(0);
          ryTo(0);
          gsap.to(el, { scale: 1, duration: 0.5, ease: "power2.out" });
          if (sheen) gsap.to(sheen, { opacity: 0, duration: 0.4 });
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
          gsap.set(el, { rotationX: 0, rotationY: 0, scale: 1 });
        };
      },
    );

    return () => mm.revert();
  }, [maxTilt, glare, hoverScale]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div ref={ref} className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] opacity-0"
        />
      )}
    </div>
  );
}
