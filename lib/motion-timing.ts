import type { CSSProperties } from "react";

export const MOTION = {
  fast: 160, feedback: 240, entrance: 480, stagger: 60, reaction: 1200,
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeFeedback: "cubic-bezier(0.33, 1, 0.68, 1)",
} as const;

export const MOTION_CSS_VARS = {
  "--motion-fast": `${MOTION.fast}ms`,
  "--motion-feedback": `${MOTION.feedback}ms`,
  "--motion-entrance": `${MOTION.entrance}ms`,
  "--motion-stagger": `${MOTION.stagger}ms`,
  "--motion-ease": MOTION.ease,
  "--motion-ease-feedback": MOTION.easeFeedback,
} as CSSProperties;
