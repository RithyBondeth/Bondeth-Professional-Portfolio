"use client";

import type { ISkill } from "@/utils/interfaces/portfolio";
import { hasSkillIcon, skillIconId } from "./skill-icon-id";

export function SkillBadge({ skill }: { skill: ISkill }) {
  return (
    <div
      className="skill-badge"
      style={
        {
          "--brand-light": skill.colorLight ?? skill.color,
          "--brand-dark": skill.color,
        } as React.CSSProperties
      }
    >
      <span className="skill-badge-icon-shell">
        {hasSkillIcon(skill.icon) && (
          <svg className="skill-badge-icon" aria-hidden focusable="false">
            <use href={`#${skillIconId(skill.icon)}`} />
          </svg>
        )}
      </span>
      <span className="skill-badge-name">{skill.name}</span>
    </div>
  );
}
