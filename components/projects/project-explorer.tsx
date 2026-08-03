"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, Flip } from "@/components/utils/animations/gsap";
import { ProjectCard } from "@/components/projects/project-card";
import type { IProject } from "@/utils/interfaces/portfolio";
import type { TProjectCategory } from "@/utils/types/portfolio";
import type { TDictionary, TLocale } from "@/utils/i18n";

type TFilter = "All" | TProjectCategory;

/**
 * Derived from the data rather than hardcoded, so a category can never be
 * offered with nothing behind it — a new filter appears the moment the first
 * project in it ships, and not before. Order follows the projects array.
 */
function getCategories(projects: IProject[]): TFilter[] {
  return ["All", ...new Set(projects.map((project) => project.category))];
}

/** Same derivation for domains, which are additive — a project can carry several. */
function getDomains(projects: IProject[]): string[] {
  return [...new Set(projects.flatMap((project) => project.domains ?? []))];
}

const isPractice = (project: IProject) => project.tier === "practice";

export function ProjectExplorer(props: {
  projects: IProject[];
  dict: TDictionary;
  lang: TLocale;
}) {
  const { projects, dict, lang } = props;

  /* -------------------------------- All States ------------------------------- */
  const categories = getCategories(projects);
  const domains = getDomains(projects);
  const [filter, setFilter] = useState<TFilter>("All");
  const [domain, setDomain] = useState<string | null>(null);

  const matches = (project: IProject) =>
    (filter === "All" || project.category === filter) &&
    (!domain || (project.domains ?? []).includes(domain));

  // Production work and practice work are filtered together but rendered as two
  // groups: shown in one grid, a Tesla clone reads as a peer of a national
  // government platform, which flatters neither.
  const filtered = projects.filter((p) => matches(p) && !isPractice(p));
  const practice = projects.filter((p) => matches(p) && isPractice(p));

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
  }, [filter, domain]);

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
        {categories.map((category) => (
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

      {domains.length > 0 && (
        <div className="mb-10 flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            {dict.projects.filterDomain}
          </span>
          {domains.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                if (gridRef.current && motionOK()) {
                  flipState.current = Flip.getState(gridRef.current.children);
                }
                setDomain((current) => (current === item ? null : item));
              }}
              aria-pressed={domain === item}
              className="btn-fx btn-fx-chip rounded border border-border bg-card/60 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground aria-pressed:border-primary/50 aria-pressed:bg-primary/10 aria-pressed:text-primary"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 || practice.length > 0 ? (
        <>
          {filtered.length > 0 && (
            <div
              ref={gridRef}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((project) => (
                <div key={project.slug} data-flip-id={project.slug}>
                  <ProjectCard project={project} dict={dict} lang={lang} />
                </div>
              ))}
            </div>
          )}

          {practice.length > 0 && (
            <section className="mt-16 border-t border-border/50 pt-10">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                {dict.projects.practice}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                {dict.projects.practiceBlurb}
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {practice.map((project) => (
                  <div key={project.slug} className="opacity-90">
                    <ProjectCard project={project} dict={dict} lang={lang} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
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
