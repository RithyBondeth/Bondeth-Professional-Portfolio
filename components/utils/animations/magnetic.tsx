"use client";

import { useEffect, useRef } from "react";
import { gsap } from "./gsap";

interface IMagneticProps {
  children: React.ReactNode;
  className?: string;
  /** How strongly the element chases the pointer (0–1 of the offset). */
  strength?: number;
  /** Extra pull on an inner element (pass a selector) for a layered feel. */
  innerSelector?: string;
  innerStrength?: number;
}

/**
 * Magnetic hover: the wrapped element is attracted to the pointer while
 * hovered and springs back elastically on leave. Desktop pointers only
 * (pointer: fine) and disabled under reduced motion — on touch it renders
 * children untouched.
 */
export function Magnetic(props: IMagneticProps) {
  /* ---------------------------------- Props --------------------------------- */
  const {
    children,
    className,
    strength = 0.35,
    innerSelector,
    innerStrength = 0.75,
  } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const ref = useRef<HTMLDivElement>(null);

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

        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
        const inner = innerSelector
          ? el.querySelector<HTMLElement>(innerSelector)
          : null;
        const xToInner = inner
          ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3" })
          : null;
        const yToInner = inner
          ? gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3" })
          : null;

        const onMove = (e: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const relX = e.clientX - (rect.left + rect.width / 2);
          const relY = e.clientY - (rect.top + rect.height / 2);
          xTo(relX * strength);
          yTo(relY * strength);
          xToInner?.(relX * strength * innerStrength);
          yToInner?.(relY * strength * innerStrength);
        };
        const onLeave = () => {
          // Elastic spring home.
          gsap.to(el, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
          if (inner) {
            gsap.to(inner, {
              x: 0,
              y: 0,
              duration: 1,
              ease: "elastic.out(1, 0.4)",
            });
          }
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        return () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          gsap.set([el, inner].filter(Boolean), { x: 0, y: 0 });
        };
      },
    );

    return () => mm.revert();
  }, [strength, innerSelector, innerStrength]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
