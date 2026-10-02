"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/components/utils/animations/use-motion";
import { isMotionReduced } from "@/lib/motion-preference";
import { RobotArt } from "./robot-art";
import type { TRobotMood } from "./robot-geometry";
import { useMascotGaze } from "./use-mascot-gaze";
import styles from "./mascot.module.css";

const SECTION_MOODS = {
  showreel: "surprised",
  about: "wave",
  "current-focus": "think",
  skills: "idle",
  experience: "happy",
  education: "wink",
  services: "wave",
  projects: "happy",
  writing: "think",
  media: "surprised",
  recommendations: "happy",
  contact: "wave",
} as const satisfies Record<string, TRobotMood>;

export type TSectionMascot = keyof typeof SECTION_MOODS;

/** A decorative gesture on entry and hover, with cursor gaze while visible. */
export function SectionMascot({ section }: { section: TSectionMascot }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  useMascotGaze(ref, { enabled: visible && !reducedMotion, range: 1.8 });

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      const inView = entries.some((entry) => entry.isIntersecting);
      setVisible(inView);
      if (inView && !isMotionReduced()) el.dataset.performed = "true";
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.6 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    const el = ref.current;
    const heading = el?.closest("h2");
    if (!el || !heading || reducedMotion) return;

    const replay = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || isMotionReduced()) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
      el.dataset.performed = "true";
      // Rewind existing CSS animations without remounting the SVG or losing
      // its gaze. The title's entire area is a generous hover target.
      for (const animation of el.getAnimations({ subtree: true })) {
        animation.currentTime = 0;
        animation.play();
      }
    };

    heading.addEventListener("pointerenter", replay);
    return () => heading.removeEventListener("pointerenter", replay);
  }, [reducedMotion]);

  return (
    <span ref={ref} className={styles.sectionIcon} data-section-mascot={section} aria-hidden="true">
      <RobotArt mood={SECTION_MOODS[section]} />
    </span>
  );
}
