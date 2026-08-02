"use client";

import { ISkill, type TSkillLevel } from "@/utils/interfaces/portfolio";
import { hasSkillIcon, skillIconId } from "./skill-icon-id";

/**
 * A three-dot meter; dots up to `level` are filled with the current text
 * colour. See `.prof-dot` in globals.css.
 */
export function ProficiencyDots(props: { level: TSkillLevel }) {
  const { level } = props;
  return (
    <span className="prof-dots" aria-hidden>
      {([1, 2, 3] as const).map((dot) => (
        <span
          key={dot}
          className="prof-dot"
          data-on={dot <= level || undefined}
        />
      ))}
    </span>
  );
}

/**
 * One marquee pill.
 *
 * The icon is a `<use>` into {@link SkillIconSprite}, which defines each
 * icon's geometry exactly once per page. Inlining the `<path>` instead — which
 * is what rendering the react-icons component does — repeated a few hundred
 * bytes of curve data for every copy of every badge in every row, and shipped
 * all 37 icon components to the browser besides. Hence the `<use>`, and hence
 * `./skill-icon-id` being the dependency-free module it is: this file is a
 * Client Component and must not reach the sprite's imports.
 *
 * Everything visual lives in `.skill-badge` (globals.css) rather than in
 * utility classes, for the same volume reason — see the comment there. The
 * only thing that varies per badge is the brand colour, published as
 * `--brand-light` / `--brand-dark` and resolved per theme into `--brand`,
 * which the icon, the dots and the hover glow all read.
 */
export function SkillBadge(props: { skill: ISkill; levelLabel: string }) {
  /* ---------------------------------- Props --------------------------------- */
  const { skill, levelLabel } = props;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className="card-interactive skill-badge"
      style={
        {
          "--brand-light": skill.colorLight ?? skill.color,
          "--brand-dark": skill.color,
        } as React.CSSProperties
      }
      title={`${skill.name} — ${levelLabel}`}
    >
      <span className="skill-badge-body">
        {hasSkillIcon(skill.icon) && (
          <svg className="skill-badge-icon" aria-hidden focusable="false">
            <use href={`#${skillIconId(skill.icon)}`} />
          </svg>
        )}
        <span className="skill-badge-name">{skill.name}</span>
        <span className="sr-only">{levelLabel}</span>
        <ProficiencyDots level={skill.level} />
      </span>
    </div>
  );
}
