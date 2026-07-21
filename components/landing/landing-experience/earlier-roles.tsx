"use client";

import { useId, useState } from "react";
import type { IExperience } from "@/utils/interfaces/portfolio/experience.interface";

/**
 * Collapsible "earlier roles" panel.
 *
 * A native `<details>` toggles instantly — the content pops in with no height
 * animation, which read as janky next to the rest of the section's motion. This
 * mirrors the navbar's mobile menu instead: a `grid-template-rows` collapse
 * (`0fr → 1fr`) over an `overflow-hidden` track, which the browser CAN animate
 * to intrinsic height (unlike `height: auto`), so the panel eases open and
 * shut. `inert` + `aria-hidden` keep the collapsed cards out of tab order and
 * the accessibility tree, the same contract the `<details>` gave for free.
 *
 * Reduced-motion users get an instant, un-animated toggle via
 * `motion-reduce:transition-none`.
 */
export function EarlierRoles({
  experiences,
  label,
}: {
  experiences: IExperience[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mt-8 sm:ml-10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="group flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded border border-border/60 bg-background px-4 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
      >
        <span>{label}</span>
        <span
          aria-hidden
          className={`transition-transform duration-300 ease-out ${
            open ? "rotate-180" : ""
          }`}
        >
          ↓
        </span>
      </button>

      <div
        id={panelId}
        inert={!open}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-4 space-y-4">
            {/* Earlier roles sit off the timeline rail, so these lift
                vertically rather than sliding like the rail-anchored cards. */}
            {experiences.map((exp) => (
              <article
                key={`${exp.role}-${exp.company}`}
                className="card-interactive rounded border border-border/60 bg-background p-5"
              >
                <div className="flex flex-col justify-between gap-1 sm:flex-row">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {exp.role}
                    </h3>
                    <p className="mt-0.5 font-mono text-xs text-primary">
                      {exp.company}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {exp.period}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  {exp.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
