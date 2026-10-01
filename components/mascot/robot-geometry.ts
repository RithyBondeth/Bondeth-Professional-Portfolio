/**
 * Byte, the portfolio mascot, as pixel geometry.
 *
 * Plain data rather than markup so the same robot can be drawn by three very
 * different renderers without drifting apart: the animated React mascot (CSS
 * variables, mood faces), the OG images (Satori — literal colours, no CSS),
 * and the favicon generator. Every rect is `[x, y, width, height, paint]` on a
 * 34 × 38 grid; the head-only crop is the top 26 rows.
 */

export type TRobotPaint = "ink" | "face" | "shade" | "accent" | "light";
export type TRobotRect = readonly [number, number, number, number, TRobotPaint];

export type TRobotMood =
  | "idle"
  | "happy"
  | "wink"
  | "wave"
  | "think"
  | "load"
  | "sleep"
  | "surprised";

export const ROBOT_FULL_VIEWBOX = { width: 34, height: 38 } as const;
export const ROBOT_HEAD_VIEWBOX = { width: 34, height: 26 } as const;

/* --------------------------------- Body ------------------------------------ */
export const ROBOT_EARS: readonly TRobotRect[] = [
  [1, 12, 4, 8, "ink"],
  [2, 13, 2, 6, "accent"],
  [29, 12, 4, 8, "ink"],
  [30, 13, 2, 6, "accent"],
];

export const ROBOT_ANTENNA_STEM: readonly TRobotRect[] = [[16, 3, 2, 4, "ink"]];
export const ROBOT_ANTENNA_TIP: readonly TRobotRect[] = [[14, 0, 6, 3, "accent"]];

export const ROBOT_HEAD: readonly TRobotRect[] = [
  [4, 7, 26, 18, "ink"],
  [6, 9, 22, 14, "face"],
  // Bottom-right inner shading gives the flat sprite a hint of volume.
  [6, 21, 22, 2, "shade"],
  [26, 9, 2, 12, "shade"],
];

export const ROBOT_TORSO: readonly TRobotRect[] = [
  [14, 25, 6, 1, "ink"],
  [8, 26, 18, 12, "ink"],
  [10, 28, 14, 8, "accent"],
  [12, 30, 2, 2, "light"],
  // A 3 × 5 pixel "B" on the chest plate.
  [19, 30, 2, 1, "ink"],
  [19, 31, 1, 1, "ink"],
  [21, 31, 1, 1, "ink"],
  [19, 32, 2, 1, "ink"],
  [19, 33, 1, 1, "ink"],
  [21, 33, 1, 1, "ink"],
  [19, 34, 2, 1, "ink"],
];

// Flush against the torso's outline so the arms read as attached at the
// shoulder rather than as brackets beside the body.
export const ROBOT_ARM_LEFT: readonly TRobotRect[] = [
  [4, 27, 4, 9, "ink"],
  [5, 28, 2, 7, "face"],
];

export const ROBOT_ARM_RIGHT: readonly TRobotRect[] = [
  [26, 27, 4, 9, "ink"],
  [27, 28, 2, 7, "face"],
];

/* --------------------------------- Faces ----------------------------------- */
/**
 * Eyes are kept apart from the mouth because they move: the React mascot
 * shifts the eye group toward the cursor and blinks it, while the mouth stays
 * put. Open eyes carry a one-pixel highlight, which is most of their life.
 */
const OPEN_EYES: readonly TRobotRect[] = [
  [10, 12, 4, 4, "ink"],
  [11, 13, 1, 1, "face"],
  [20, 12, 4, 4, "ink"],
  [21, 13, 1, 1, "face"],
];

const DASH_MOUTH: readonly TRobotRect[] = [
  [12, 18, 2, 2, "accent"],
  [16, 18, 2, 2, "accent"],
  [20, 18, 2, 2, "accent"],
];

const SMILE: readonly TRobotRect[] = [
  [12, 18, 1, 1, "accent"],
  [13, 19, 8, 1, "accent"],
  [21, 18, 1, 1, "accent"],
];

const HAPPY_EYES: readonly TRobotRect[] = [
  [10, 14, 1, 2, "ink"],
  [11, 13, 2, 1, "ink"],
  [13, 14, 1, 2, "ink"],
  [20, 14, 1, 2, "ink"],
  [21, 13, 2, 1, "ink"],
  [23, 14, 1, 2, "ink"],
];

const CHEEKS: readonly TRobotRect[] = [
  [7, 17, 2, 1, "accent"],
  [25, 17, 2, 1, "accent"],
];

export interface IRobotFace {
  eyes: readonly TRobotRect[];
  mouth: readonly TRobotRect[];
  /** Blush pixels — drawn at reduced opacity. */
  cheeks?: readonly TRobotRect[];
}

export const ROBOT_FACES: Record<TRobotMood, IRobotFace> = {
  idle: { eyes: OPEN_EYES, mouth: DASH_MOUTH },
  happy: { eyes: HAPPY_EYES, mouth: SMILE, cheeks: CHEEKS },
  wave: { eyes: HAPPY_EYES, mouth: SMILE, cheeks: CHEEKS },
  wink: {
    eyes: [
      [10, 12, 4, 4, "ink"],
      [11, 13, 1, 1, "face"],
      [20, 15, 4, 1, "ink"],
    ],
    mouth: SMILE,
    cheeks: CHEEKS,
  },
  think: {
    // Glancing up and to the side, the universal "hmm".
    eyes: [
      [11, 11, 4, 4, "ink"],
      [12, 11, 1, 1, "face"],
      [21, 11, 4, 4, "ink"],
      [22, 11, 1, 1, "face"],
    ],
    mouth: [[15, 19, 5, 1, "accent"]],
  },
  load: { eyes: OPEN_EYES, mouth: DASH_MOUTH },
  sleep: {
    eyes: [
      [10, 15, 4, 1, "ink"],
      [20, 15, 4, 1, "ink"],
    ],
    mouth: [[16, 19, 2, 1, "accent"]],
  },
  surprised: {
    eyes: [
      [9, 11, 5, 5, "ink"],
      [10, 12, 1, 1, "face"],
      [20, 11, 5, 5, "ink"],
      [21, 12, 1, 1, "face"],
    ],
    mouth: [
      [15, 18, 4, 1, "accent"],
      [15, 21, 4, 1, "accent"],
      [15, 19, 1, 2, "accent"],
      [18, 19, 1, 2, "accent"],
    ],
  },
};

/* -------------------------------- Palettes --------------------------------- */
/** Theme-aware paints for the live mascot. */
export const ROBOT_CSS_PALETTE: Record<TRobotPaint, string> = {
  ink: "var(--foreground)",
  face: "var(--card)",
  shade: "var(--secondary)",
  accent: "var(--brand-pixel)",
  light: "var(--status-success)",
};

/** Literal paints for renderers that cannot resolve CSS variables. */
export const ROBOT_LIGHT_PALETTE: Record<TRobotPaint, string> = {
  ink: "#141413",
  face: "#FAF9F5",
  shade: "#F0EEE6",
  accent: "#D97757",
  light: "#34D399",
};

export const ROBOT_DARK_PALETTE: Record<TRobotPaint, string> = {
  ink: "#FAF9F5",
  face: "#1F1F1E",
  shade: "#2D2D2B",
  accent: "#D97757",
  light: "#34D399",
};
