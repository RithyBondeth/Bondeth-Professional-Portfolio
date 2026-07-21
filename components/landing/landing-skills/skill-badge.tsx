"use client";

import {
  PixelRipple,
  useRippleHover,
} from "@/components/utils/animations/pixel-ripple";
import {
  ISkill,
  type TSkillLevel,
} from "@/utils/interfaces/portfolio/skill.interface";
import {
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiNuxt,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiNodedotjs,
  SiNestjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiFastapi,
  SiRabbitmq,
  SiOpenai,
  SiAnthropic,
  SiGooglegemini,
  SiLangchain,
  SiLanggraph,
  SiOllama,
  SiHuggingface,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiGit,
  SiDocker,
  SiGithub,
  SiVercel,
  SiNetlify,
  SiDigitalocean,
  SiGooglecloud,
  SiCloudflare,
  SiNginx,
  SiGithubactions,
  SiLinux,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import type { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiNuxt,
  SiTailwindcss,
  SiPython,
  SiNodedotjs,
  SiNestjs,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiGraphql,
  SiFastapi,
  SiRabbitmq,
  SiOpenai,
  SiAnthropic,
  SiGooglegemini,
  SiLangchain,
  SiLanggraph,
  SiOllama,
  SiHuggingface,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiGit,
  SiDocker,
  SiGithub,
  SiVercel,
  SiNetlify,
  SiDigitalocean,
  SiGooglecloud,
  SiCloudflare,
  SiNginx,
  SiGithubactions,
  SiLinux,
  FaAws,
};

/** A three-dot meter; dots up to `level` are filled with the current text colour. */
export function ProficiencyDots(props: { level: TSkillLevel }) {
  const { level } = props;
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {([1, 2, 3] as const).map((dot) => (
        <span
          key={dot}
          className={`w-1 h-1 rounded-full ${
            dot <= level ? "bg-current" : "bg-muted-foreground/25"
          }`}
        />
      ))}
    </span>
  );
}

/**
 * One marquee pill. On hover a pixel wave ripples out from the centre in the
 * brand's colour (MarqueeTrack pauses the row at the same time, so the badge is
 * stationary while it plays).
 *
 * See {@link useRippleHover} for why the canvas is mounted lazily.
 *
 * The brand colour is published as `--brand`, resolved per theme from
 * `--brand-light` / `--brand-dark`, and everything downstream — icon, glow,
 * canvas — reads that one variable.
 */
export function SkillBadge(props: { skill: ISkill; levelLabel: string }) {
  /* ---------------------------------- Props --------------------------------- */
  const { skill, levelLabel } = props;

  /* -------------------------------- All States ------------------------------- */
  const { hovered, mounted, hoverProps } = useRippleHover();

  /* ---------------------------------- Utils --------------------------------- */
  const Icon = ICON_MAP[skill.icon];

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className="card-interactive group relative isolate overflow-hidden flex items-center gap-2.5 px-5 py-3 rounded-md border border-border/50 bg-card whitespace-nowrap shrink-0 select-none [--card-lift:-2px] [--brand:var(--brand-light)] dark:[--brand:var(--brand-dark)]"
      style={
        {
          "--brand-light": skill.colorLight ?? skill.color,
          "--brand-dark": skill.color,
          "--pixel-color": "var(--brand)",
          // card-interactive reads --card-glow for its hover shadow; retinting
          // it here brands the glow without forking the shared hover rules.
          "--card-glow":
            "0 8px 24px -10px color-mix(in oklab, var(--brand) 50%, transparent), 0 0 0 1px color-mix(in oklab, var(--brand) 35%, transparent)",
        } as React.CSSProperties
      }
      title={`${skill.name} — ${levelLabel}`}
      {...hoverProps}
    >
      {/* Decorative pixel wave, behind the content but above the card fill.
          No negative z-index — that would put it behind the card's own
          background and hide it entirely. */}
      {mounted && (
        <span className="absolute inset-0" aria-hidden>
          <PixelRipple active={hovered} gap={6} speed={35} />
        </span>
      )}

      <span className="relative z-1 flex items-center gap-2.5">
        {Icon && (
          <Icon className="w-5 h-5 shrink-0 text-[var(--brand)] transition-transform duration-300 motion-safe:group-hover:scale-125" />
        )}
        <span className="text-sm font-mono text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          {skill.name}
        </span>
        <span className="sr-only">{levelLabel}</span>
        <span className="ml-0.5 shrink-0 text-[var(--brand)]" aria-hidden>
          <ProficiencyDots level={skill.level} />
        </span>
      </span>
    </div>
  );
}
