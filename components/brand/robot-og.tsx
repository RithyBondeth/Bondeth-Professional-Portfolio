import {
  ROBOT_ANTENNA_STEM,
  ROBOT_ANTENNA_TIP,
  ROBOT_DARK_PALETTE,
  ROBOT_EARS,
  ROBOT_FACES,
  ROBOT_HEAD,
  ROBOT_HEAD_VIEWBOX,
  ROBOT_LIGHT_PALETTE,
} from "@/components/mascot/robot-geometry";

const HEAD_RECTS = [
  ...ROBOT_EARS,
  ...ROBOT_ANTENNA_STEM,
  ...ROBOT_ANTENNA_TIP,
  ...ROBOT_HEAD,
  ...ROBOT_FACES.idle.eyes,
  ...ROBOT_FACES.idle.mouth,
];

/**
 * Byte's head for Satori-rendered OG images. Satori resolves neither CSS
 * variables nor stylesheets, so this draws from the literal palettes; the
 * geometry is the same data the live logo uses. `inverse` is for dark grounds.
 */
export function RobotOg({
  size = 64,
  inverse = false,
}: {
  size?: number;
  inverse?: boolean;
}) {
  const palette = inverse ? ROBOT_DARK_PALETTE : ROBOT_LIGHT_PALETTE;
  const { width, height } = ROBOT_HEAD_VIEWBOX;

  return (
    <svg
      width={(size * width) / height}
      height={size}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      xmlns="http://www.w3.org/2000/svg"
    >
      {HEAD_RECTS.map(([x, y, w, h, paint]) => (
        <rect key={`${x}-${y}-${w}-${h}`} x={x} y={y} width={w} height={h} fill={palette[paint]} />
      ))}
    </svg>
  );
}
