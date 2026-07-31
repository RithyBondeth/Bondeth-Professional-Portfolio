"use client";

import { useId, useState } from "react";
import type { IExperience } from "@/utils/interfaces/portfolio";
import { ExperienceRow } from "./experience-row";

/**
 * The tail of the experience index, collapsed behind a disclosure — the
 * interactive equivalent of a printed CV's compressed appendix.
 *
 * A native `<details>` toggles instantly. This mirrors the mobile menu
 * instead: a `grid-template-rows` collapse (`0fr → 1fr`) over an
 * `overflow-hidden` track, which the browser CAN animate to intrinsic height
 * (unlike `height: auto`). `inert` + `aria-hidden` keep the collapsed entries
 * out of tab order and the accessibility tree, the contract `<details>` gives
 * for free. Reduced-motion users get an instant toggle.
 */
export function EarlierRoles({
  experiences,
  label,
  startIndex,
}: {
  experiences: IExperience[];
  label: string;
  /** Continues the numbering from the entries printed above. */
  startIndex: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <>
      <div
        id={panelId}
        inert={!open}
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {experiences.map((exp, i) => (
            <ExperienceRow
              key={`${exp.role}-${exp.company}`}
              role={exp}
              index={startIndex + i}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="btn-fx link-wipe mt-8 inline-flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
      >
        {/* A plus that becomes a cross — the quietest possible open/close
            affordance, and the only rotation left on the site. */}
        <span
          aria-hidden
          className={`text-lg leading-none transition-transform duration-300 motion-reduce:transition-none ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
        {label}
      </button>
    </>
  );
}
