"use client";

import type { Skill } from "@/features/portfolio/domain";
import {
  hasSkillIcon,
  skillIconId,
} from "@/features/portfolio/components/skills/skill-icon-id";

export function SkillBadge({ skill }: { skill: Skill }) {
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
