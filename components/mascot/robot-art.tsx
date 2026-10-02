import type { CSSProperties } from "react";
import {
  ROBOT_ANTENNA_STEM,
  ROBOT_ANTENNA_TIP,
  ROBOT_ARM_LEFT,
  ROBOT_ARM_RIGHT,
  ROBOT_CSS_PALETTE,
  ROBOT_EARS,
  ROBOT_FACES,
  ROBOT_FULL_VIEWBOX,
  ROBOT_HEAD,
  ROBOT_HEAD_VIEWBOX,
  ROBOT_TORSO,
  type TRobotMood,
  type TRobotPaint,
  type TRobotRect,
} from "./robot-geometry";
import styles from "./mascot.module.css";

function Pixels({
  rects,
  palette,
  className,
}: {
  rects: readonly TRobotRect[];
  palette: Record<TRobotPaint, string>;
  className?: string;
}) {
  return (
    <g className={className}>
      {rects.map(([x, y, width, height, paint]) => (
        <rect
          key={`${x}-${y}-${width}-${height}`}
          x={x}
          y={y}
          width={width}
          height={height}
          fill={palette[paint]}
        />
      ))}
    </g>
  );
}

/**
 * The mascot drawn as SVG. Stateless and hook-free, so it renders the same in
 * server components, client components and route loading states. Behaviour —
 * cursor tracking, scroll lean, mood changes — is layered on by callers that
 * set `mood` and the `--gaze-x` / `--gaze-y` / `--lean` custom properties.
 *
 * Only the active mood's face is drawn: mood changes are rare (a few per
 * minute at most), so re-rendering a dozen rects beats shipping every face and
 * toggling them in CSS.
 */
export function RobotArt({
  mood = "idle",
  variant = "full",
  className,
  style,
  float = false,
  boot = false,
  running = false,
  title,
}: {
  mood?: TRobotMood;
  /** "head" crops to antenna + head, for the logo and small avatars. */
  variant?: "full" | "head";
  className?: string;
  style?: CSSProperties;
  /** Gentle idle hover. */
  float?: boolean;
  /** One-shot power-on flicker of the eyes and antenna. */
  boot?: boolean;
  /** Brief running gait for the Projects entrance. */
  running?: boolean;
  /** Accessible name; omitted means decorative. */
  title?: string;
}) {
  const palette = ROBOT_CSS_PALETTE;
  const viewBox = variant === "head" ? ROBOT_HEAD_VIEWBOX : ROBOT_FULL_VIEWBOX;
  const face = ROBOT_FACES[mood];

  return (
    <svg
      viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
      className={`${styles.robot} ${className ?? ""}`}
      style={style}
      data-mood={mood}
      data-variant={variant}
      data-float={float || undefined}
      data-boot={boot || undefined}
      data-running={running || undefined}
      shapeRendering="crispEdges"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={styles.lean}>
        <g className={styles.bob}>
          {variant === "full" && (
            <>
              <Pixels rects={ROBOT_ARM_LEFT} palette={palette} className={styles.armLeft} />
              <Pixels rects={ROBOT_TORSO} palette={palette} />
              <Pixels rects={ROBOT_ARM_RIGHT} palette={palette} className={styles.armRight} />
            </>
          )}
          <Pixels rects={ROBOT_EARS} palette={palette} />
          <Pixels rects={ROBOT_ANTENNA_STEM} palette={palette} />
          <Pixels rects={ROBOT_ANTENNA_TIP} palette={palette} className={styles.antennaTip} />
          <Pixels rects={ROBOT_HEAD} palette={palette} />

          <g className={styles.gaze}>
            <g className={styles.eyes}>
              <Pixels rects={face.eyes} palette={palette} />
            </g>
          </g>
          {face.cheeks && (
            <Pixels rects={face.cheeks} palette={palette} className={styles.cheeks} />
          )}
          <g className={styles.mouth}>
            {face.mouth.map(([x, y, width, height, paint], index) => (
              <rect
                key={`${x}-${y}`}
                x={x}
                y={y}
                width={width}
                height={height}
                fill={palette[paint]}
                className={styles.mouthPixel}
                style={{ "--i": index } as CSSProperties}
              />
            ))}
          </g>
        </g>

        {/* Mood props that live outside the body so they are not clipped by
            the bob and read as floating near the head. */}
        {mood === "think" && (
          <g className={styles.thinkDots}>
            <rect x="29" y="5" width="2" height="2" fill={palette.accent} />
            <rect x="31" y="2" width="2" height="2" fill={palette.accent} />
            <rect x="33" y="-1" width="2" height="2" fill={palette.accent} />
          </g>
        )}
        {mood === "sleep" && (
          <g className={styles.zees} fill={palette.ink}>
            <g className={styles.zee}>
              <rect x="27" y="2" width="3" height="1" />
              <rect x="28" y="3" width="1" height="1" />
              <rect x="27" y="4" width="3" height="1" />
            </g>
            <g className={styles.zee}>
              <rect x="31" y="-2" width="3" height="1" />
              <rect x="32" y="-1" width="1" height="1" />
              <rect x="31" y="0" width="3" height="1" />
            </g>
          </g>
        )}
      </g>
    </svg>
  );
}
