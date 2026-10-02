"use client";

import { useReducedMotion } from "@/components/utils/animations/use-motion";
import { MOTION } from "@/lib/motion-timing";
import { isMotionReduced } from "@/lib/motion-preference";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { RobotArt } from "./robot-art";
import type { TRobotMood } from "./robot-geometry";
import { useMascotGaze } from "./use-mascot-gaze";
import styles from "./mascot.module.css";

/* --------------------------------- Copy ------------------------------------ */
type TQuip = { text: string; mood: TRobotMood };

const copy = {
  en: {
    whee: "Wheee!",
    quips: {
      about: { text: "Meet my human!", mood: "happy" },
      "current-focus": { text: "Here's what's cooking.", mood: "think" },
      skills: { text: "The toolbox!", mood: "happy" },
      experience: { text: "Lots of shipping here.", mood: "happy" },
      education: { text: "Techo Scholar, btw.", mood: "wink" },
      services: { text: "Need something built?", mood: "think" },
      projects: { text: "My favorite part!", mood: "happy" },
      writing: { text: "Go on, run one!", mood: "wink" },
      media: { text: "Grab some popcorn.", mood: "happy" },
      recommendations: { text: "Kind words!", mood: "happy" },
      contact: { text: "Say hi!", mood: "wave" },
    } as Record<string, TQuip>,
  },
  km: {
    whee: "វ៉ោវ!",
    quips: {
      about: { text: "នេះជា Bondeth!", mood: "happy" },
      "current-focus": { text: "អ្វីដែលកំពុងធ្វើ!", mood: "think" },
      skills: { text: "ប្រអប់ឧបករណ៍!", mood: "happy" },
      experience: { text: "បទពិសោធន៍ច្រើន!", mood: "happy" },
      education: { text: "Techo Scholar ផង!", mood: "wink" },
      services: { text: "ចង់បង្កើតអ្វីមួយ?", mood: "think" },
      projects: { text: "ផ្នែកដែលខ្ញុំចូលចិត្ត!", mood: "happy" },
      writing: { text: "សាកល្បងមើល!", mood: "wink" },
      media: { text: "មើលវីដេអូ!", mood: "happy" },
      recommendations: { text: "ពាក្យល្អៗ!", mood: "happy" },
      contact: { text: "សួស្តីមក!", mood: "wave" },
    } as Record<string, TQuip>,
  },
} as const;

/* -------------------------------- Timings ---------------------------------- */
const BOOT_MS = MOTION.entrance;
const SLEEP_AFTER_MS = 30_000;
const QUIP_MS = 2_400;
const QUIP_COOLDOWN_MS = 8_000;
const WHEE_COOLDOWN_MS = 15_000;
/** Scroll speed, in px per ms, that counts as a fling. */
const FLING_SPEED = 4.5;
const PROJECT_RUN_MS = 1_800;

interface ITransient {
  mood: TRobotMood;
  text?: string;
  key: number;
}

/**
 * Byte as a page companion: the chat launcher's robot, given a life of its own.
 *
 * - boots up (eyes flicker on) when it first appears
 * - watches the cursor
 * - leans into the scroll and glances the way the page is moving; a fast
 *   fling makes him yelp
 * - comments once on each homepage section as it scrolls into view
 * - waves while hovered, dozes off after 30s without input, startles awake
 *
 * Continuous signals (gaze, lean) are written as CSS custom properties so
 * scrolling and pointer movement never render React. State only changes on
 * mood transitions — a handful per minute at most.
 */
export function MascotBuddy({
  lang,
  mood: forcedMood,
  bubble,
  bubbleClassName,
  className,
  quips = true,
}: {
  lang: string;
  /** Overrides every behavioural mood, e.g. "think" while a reply loads. */
  mood?: TRobotMood;
  /** Resting speech-bubble text; quips replace it briefly. */
  bubble?: string;
  bubbleClassName?: string;
  className?: string;
  /** Section commentary. Off while the chat panel is open. */
  quips?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const text = lang === "km" ? copy.km : copy.en;
  const pathname = usePathname();
  const wrapRef = useRef<HTMLSpanElement>(null);
  const [booting, setBooting] = useState(true);
  const [asleep, setAsleep] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [transient, setTransient] = useState<ITransient | null>(null);
  const asleepRef = useRef(false);
  const transientTimer = useRef<number | undefined>(undefined);
  const lastQuipAt = useRef(0);
  const seenSections = useRef(new Set<string>());
  const seenProjectRuns = useRef(new Set<string>());
  const [running, setRunning] = useState(false);

  useMascotGaze(wrapRef, { enabled: !asleep && !reduceMotion });

  const flash = useCallback(
    (mood: TRobotMood, bubbleText: string | undefined, duration: number) => {
      window.clearTimeout(transientTimer.current);
      setTransient({ mood, text: bubbleText, key: performance.now() });
      transientTimer.current = window.setTimeout(() => setTransient(null), duration);
    },
    [],
  );

  useEffect(() => () => window.clearTimeout(transientTimer.current), []);

  /* ---------------------------------- Boot --------------------------------- */
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => setBooting(false), BOOT_MS);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  /* ----------------------------- Sleep and wake ----------------------------- */
  useEffect(() => {
    if (reduceMotion) return;
    let timer = 0;
    let lastArmed = 0;

    const arm = () => {
      lastArmed = performance.now();
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        asleepRef.current = true;
        setAsleep(true);
      }, SLEEP_AFTER_MS);
    };

    const onActivity = () => {
      if (asleepRef.current) {
        asleepRef.current = false;
        setAsleep(false);
        flash("surprised", undefined, 700);
        arm();
        return;
      }
      // pointermove fires constantly; re-arming once a second is plenty.
      if (performance.now() - lastArmed > 1_000) arm();
    };

    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    events.forEach((name) =>
      window.addEventListener(name, onActivity, { passive: true }),
    );
    arm();

    return () => {
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, onActivity));
    };
  }, [flash, reduceMotion]);

  /* ------------------------------ Scroll body ------------------------------- */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (reduceMotion) return;

    let frame = 0;
    let settle = 0;
    let lastY = window.scrollY;
    let lastTime = performance.now();
    let lastWhee = 0;

    const update = () => {
      frame = 0;
      const now = performance.now();
      const y = window.scrollY;
      const velocity = (y - lastY) / Math.max(16, now - lastTime);
      lastY = y;
      lastTime = now;

      const svg = el.querySelector("svg");
      if (!reduceMotion) {
        const lean = Math.max(-10, Math.min(10, velocity * 4));
        el.style.setProperty("--lean", lean.toFixed(1));
      }
      if (Math.abs(velocity) > 0.05) {
        svg?.setAttribute("data-look", velocity > 0 ? "down" : "up");
      }
      if (Math.abs(velocity) > FLING_SPEED && now - lastWhee > WHEE_COOLDOWN_MS) {
        lastWhee = now;
        flash("surprised", text.whee, MOTION.reaction);
      }

      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        el.style.setProperty("--lean", "0");
        el.querySelector("svg")?.removeAttribute("data-look");
      }, 200);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle);
      if (frame) cancelAnimationFrame(frame);
      el.style.setProperty("--lean", "0");
      el.querySelector("svg")?.removeAttribute("data-look");
    };
  }, [flash, text.whee, reduceMotion]);

  /* ---------------------------- Section commentary -------------------------- */
  useEffect(() => {
    if (!quips || reduceMotion) return;
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    if (sections.length === 0) return;

    // A thin band across the middle of the viewport: a section "arrives" when
    // it crosses the centre, however tall it is.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          const quip = text.quips[id];
          if (!quip || seenSections.current.has(id)) continue;
          const now = performance.now();
          if (now - lastQuipAt.current < QUIP_COOLDOWN_MS) continue;
          seenSections.current.add(id);
          lastQuipAt.current = now;
          flash(quip.mood, quip.text, QUIP_MS);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname, quips, flash, text, reduceMotion]);

  /* One celebratory entrance, using the existing robot so the chat target
     stays in place. Only the decorative artwork travels along the bottom. */
  useEffect(() => {
    if (!quips || reduceMotion || forcedMood) return;
    const projects = document.querySelector("main section#projects");
    if (!projects || seenProjectRuns.current.has(pathname)) return;

    let timer = 0;
    const stop = () => {
      window.clearTimeout(timer);
      setRunning(false);
    };
    const arrive = () => {
      stop();
      flash("wave", text.quips.projects.text, QUIP_MS);
    };
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      const el = wrapRef.current;
      if (!el || isMotionReduced() || document.hidden) return;

      seenProjectRuns.current.add(pathname);
      seenSections.current.add("projects");
      observer.disconnect();
      const rect = el.getBoundingClientRect();
      const desktop = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)").matches;

      // A dragged launcher may be near the top: wave there instead of sending
      // the artwork through the reading area.
      if (!desktop || rect.bottom < window.innerHeight - 120 || rect.left < 160) {
        arrive();
        return;
      }

      el.style.setProperty("--project-run-start", `${-rect.left - rect.width}px`);
      el.style.setProperty("--project-run-duration", `${PROJECT_RUN_MS}ms`);
      setRunning(true);
      timer = window.setTimeout(arrive, PROJECT_RUN_MS);
    }, { rootMargin: "0px 0px -25% 0px", threshold: 0 });

    observer.observe(projects);
    window.addEventListener("resize", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.removeEventListener("resize", stop);
      document.removeEventListener("visibilitychange", stop);
      stop();
    };
  }, [pathname, quips, reduceMotion, forcedMood, flash, text]);

  /* -------------------------------- Render UI ------------------------------- */
  const isRunning = running && quips && !reduceMotion && !forcedMood;
  const mood: TRobotMood =
    forcedMood ?? (reduceMotion ? "idle" : transient?.mood) ?? (hovered ? "wave" : asleep ? "sleep" : "idle");
  const bubbleText = reduceMotion ? (forcedMood ? undefined : bubble) : transient?.text ?? (asleep || forcedMood ? undefined : bubble);

  return (
    <span
      ref={wrapRef}
      className={className}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {bubbleText && !isRunning && (
        <span
          key={transient?.text ? transient.key : "rest"}
          className={bubbleClassName}
          aria-hidden="true"
        >
          {bubbleText}
        </span>
      )}
      <span className={styles.projectRunner} data-running={isRunning || undefined}>
        <RobotArt
          mood={isRunning ? "happy" : mood}
          running={isRunning}
          float={!reduceMotion && !isRunning}
          boot={booting && !reduceMotion && !isRunning}
        />
      </span>
    </span>
  );
}
