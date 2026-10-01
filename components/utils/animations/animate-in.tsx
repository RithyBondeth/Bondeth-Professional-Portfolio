import type { CSSProperties } from "react";

export type TRevealFrom =
  | "up"
  | "down"
  | "left"
  | "right"
  | "zoom-in"
  | "zoom-out"
  /** Rises while tipping back toward the viewer. */
  | "tilt"
  /** Swings in around the vertical axis. */
  | "flip-left"
  | "flip-right"
  /** Lifts with a slight rotation, like a card being dealt. */
  | "swing"
  /** Rises and grows — for large media. */
  | "rise"
  /** Focus-pull from a soft blur. */
  | "blur"
  /** Uncovered left to right. */
  | "wipe"
  | "none";

/**
 * Per-child choreography for StaggerIn:
 * - alternate: odd children enter from the left, even from the right
 * - fan: cards deal in from below, outer ones tilted outward
 * - flip: children swing in around alternating vertical axes
 * - cascade: children grow in one after another
 */
export type TStaggerPattern = "alternate" | "fan" | "flip" | "cascade";

interface IRevealCommon {
  children: React.ReactNode;
  className?: string;
  from?: TRevealFrom;
  /** Seconds-flavoured; shifts where in the scroll the reveal starts. */
  delay?: number;
  /** Travel in px for directional presets. */
  distance?: number;
  /** Starting scale, overriding the preset. */
  scale?: number;
  /** Starting rotation in degrees, overriding the preset. */
  rotate?: number;
  /** Starting blur in px. */
  blur?: number;
  /**
   * Recede (fade, shrink, tip away) as the block scrolls out the top. Unset
   * follows the page: on inside main[data-scroll-story] (the homepage), off
   * elsewhere. `false` opts a block out even on the homepage.
   */
  depart?: boolean;
  /**
   * How much of the block's passage the entrance takes, as a percentage of the
   * view timeline's `cover` range (default 28). Shorten it for blocks that must
   * be fully settled early — e.g. inside a section that pins.
   */
  span?: number;
  /** Legacy alias for `distance`. */
  y?: number;
  // Accepted for call-site compatibility. Entrances use the shared motion
  // rhythm; scroll-span settings remain for the no-JavaScript CSS fallback.
  duration?: number;
  ease?: string;
  scrub?: boolean;
  start?: string;
  once?: boolean;
}

/**
 * Translates props into the `--rv-*` custom properties the reveal keyframes
 * read. Anything unset falls through to the `data-reveal-from` preset.
 */
function revealVars(props: IRevealCommon): CSSProperties {
  const vars: Record<string, string> = {};
  const distance = props.distance ?? props.y;
  if (distance !== undefined) vars["--rv-d"] = `${distance}px`;
  if (props.scale !== undefined) vars["--rv-s"] = String(props.scale);
  if (props.rotate !== undefined) vars["--rv-r"] = `${props.rotate}deg`;
  if (props.blur !== undefined) vars["--rv-blur"] = `${props.blur}px`;
  if (props.delay) vars["--rv-offset"] = `${Math.round(props.delay * 50)}%`;
  if (props.span !== undefined) vars["--rv-span"] = `${props.span}%`;
  return vars as CSSProperties;
}

function departAttr(depart: boolean | undefined) {
  if (depart === undefined) return undefined;
  return depart ? "on" : "off";
}

/**
 * Scroll-driven reveal. Server-rendered with no hydration cost: CSS view
 * timelines scrub the motion with the scroll, browsers without them get an
 * IntersectionObserver fallback (RevealFallback), and reduced motion gets the
 * content immediately.
 */
export function AnimateIn(props: IRevealCommon) {
  return (
    <div
      className={`reveal-on-view ${props.className ?? ""}`}
      data-reveal-from={props.from ?? "up"}
      data-depart={departAttr(props.depart)}
      style={revealVars(props)}
    >
      {props.children}
    </div>
  );
}

/**
 * Reveals each direct child in turn. Children in the same row pick up
 * successively later starts (`stagger`), and `pattern` gives each child its
 * own direction instead of all sharing `from`.
 */
export function StaggerIn(
  props: IRevealCommon & {
    stagger?: number;
    pattern?: TStaggerPattern;
    /** Columns per row, so the stagger restarts on each new row. */
    cycle?: 2 | 3 | 4;
    staggerFrom?: "start" | "end" | "center" | "edges" | "random";
  },
) {
  const style = revealVars(props) as Record<string, string>;
  if (props.stagger !== undefined) {
    style["--rv-step"] = `${Math.round(props.stagger * 40)}%`;
  }

  return (
    <div
      className={`stagger-on-view ${props.className ?? ""}`}
      data-reveal-from={props.from ?? "up"}
      data-pattern={props.pattern}
      data-cycle={props.cycle ?? 3}
      data-depart={departAttr(props.depart)}
      style={style as CSSProperties}
    >
      {props.children}
    </div>
  );
}
