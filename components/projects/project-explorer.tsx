"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip } from "@/components/utils/animations/gsap";
import { ProjectCard } from "@/components/projects/project-card";
import type { IProject } from "@/utils/interfaces/portfolio/project.interface";
import type { TProjectCategory } from "@/utils/types/portfolio/project-category.type";
import type { TDictionary, TLocale } from "@/utils/i18n";

const CATEGORIES = ["All", "Web", "AI", "Mobile"] as const;
type TFilter = "All" | TProjectCategory;

export function ProjectExplorer(props: {
  projects: IProject[];
  dict: TDictionary;
  lang: TLocale;
}) {
  const { projects, dict, lang } = props;

  /* -------------------------------- All States ------------------------------- */
  const [filter, setFilter] = useState<TFilter>("All");
  const filtered = projects.filter(
    (project) => filter === "All" || project.category === filter,
  );

  /* ---------------------------------- Utils --------------------------------- */
  const gridRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  // Layout snapshot taken synchronously in the click handler, consumed by the
  // layout effect after React re-renders the filtered grid.
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);

  const motionOK = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

  const applyFilter = (category: TFilter) => {
    if (category === filter) return;
    if (gridRef.current && motionOK()) {
      flipState.current = Flip.getState(gridRef.current.children);
    }
    setFilter(category);
  };

  /* --------------------------------- Effects -------------------------------- */
  // FLIP the grid: surviving cards glide to their new slots, newcomers fade in.
  // (Cards removed by the filter unmount instantly — React has already dropped
  // their DOM, so they simply aren't part of the animation.)
  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || !gridRef.current) return;
    Flip.from(state, {
      targets: gridRef.current.children,
      duration: 0.6,
      ease: "smooth",
      stagger: 0.02,
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.45, ease: "smooth" },
        ),
    });
  }, [filter]);

  // Sliding thumb under the active filter — jumps instantly under reduced
  // motion, glides otherwise. Re-measured on resize.
  useLayoutEffect(() => {
    const bar = barRef.current;
    const thumb = thumbRef.current;
    if (!bar || !thumb) return;

    const place = (animate: boolean) => {
      const active = bar.querySelector<HTMLButtonElement>(
        'button[aria-pressed="true"]',
      );
      if (!active) return;
      const vars = { x: active.offsetLeft, width: active.offsetWidth };
      if (animate && motionOK()) {
        gsap.to(thumb, { ...vars, duration: 0.45, ease: "smooth" });
      } else {
        gsap.set(thumb, vars);
      }
    };

    place(true);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [filter]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div>
      <div
        ref={barRef}
        className="relative mb-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded border border-border/40 bg-card/50 p-1"
        aria-label={dict.projects.filterLabel}
      >
        {/* Sliding active-state thumb (decorative — state lives on the buttons) */}
        <span
          ref={thumbRef}
          aria-hidden
          className="absolute left-0 top-1 bottom-1 w-0 rounded bg-primary"
        />
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => applyFilter(category)}
            aria-pressed={filter === category}
            className={`btn-fx relative z-10 min-h-11 shrink-0 rounded px-4 font-mono text-xs ${
              filter === category
                ? "text-primary-foreground"
                : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            }`}
          >
            {category === "All" ? dict.projects.filterAll : category}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <div key={project.slug} data-flip-id={project.slug}>
              <ProjectCard project={project} dict={dict} lang={lang} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded border border-dashed border-border py-20 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            {dict.projects.empty}
          </p>
        </div>
      )}
    </div>
  );
}
