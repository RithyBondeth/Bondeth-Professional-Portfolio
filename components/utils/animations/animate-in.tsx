export type TRevealFrom =
  | "up"
  | "down"
  | "left"
  | "right"
  | "zoom-in"
  | "zoom-out"
  | "none";

interface IRevealCommon {
  children: React.ReactNode;
  className?: string;
  from?: TRevealFrom;
  delay?: number;
  duration?: number;
  ease?: string;
  distance?: number;
  scale?: number;
  rotate?: number;
  blur?: number;
  scrub?: boolean;
  start?: string;
  once?: boolean;
  y?: number;
}

/** CSS scroll-driven reveal with a static fallback and no hydration cost. */
export function AnimateIn(props: IRevealCommon) {
  return (
    <div
      className={`reveal-on-view ${props.className ?? ""}`}
      data-reveal-from={props.from ?? "up"}
    >
      {props.children}
    </div>
  );
}

/** CSS-only stagger that avoids creating one ScrollTrigger per card. */
export function StaggerIn(
  props: IRevealCommon & {
    stagger?: number;
    staggerFrom?: "start" | "end" | "center" | "edges" | "random";
  },
) {
  return (
    <div
      className={`stagger-on-view ${props.className ?? ""}`}
      data-reveal-from={props.from ?? "up"}
    >
      {props.children}
    </div>
  );
}
