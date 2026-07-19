import { skillGroups } from "@/utils/constants/portfolio.constant";
import { SectionBackdrop } from "@/components/utils/animations/section-backdrop";
import {
  ISkill,
  type TSkillLevel,
} from "@/utils/interfaces/portfolio/skill.interface";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { MarqueeTrack } from "@/components/utils/animations/marquee-track";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { VelocitySkew } from "@/components/utils/animations/velocity-skew";
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

const COPIES_PER_HALF = 8;

export default function LandingSkills(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);

  /* ---------------------------------- Utils --------------------------------- */
  const levelLabels: Record<TSkillLevel, string> = {
    3: dict.skills.levels.expert,
    2: dict.skills.levels.proficient,
    1: dict.skills.levels.familiar,
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section
      id="skills"
      className="relative isolate py-24 bg-background overflow-hidden"
    >
      <SectionBackdrop />

      {/* Heading Section */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <AnimateIn from="zoom-in">
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <ScrambleText text="// skills.ts" />
          </p>
        </AnimateIn>
        <SplitReveal
          as="h2"
          type="lines"
          className="text-4xl sm:text-5xl font-bold text-foreground mt-3"
        >
          {dict.skills.heading}
        </SplitReveal>

        {/* Proficiency Legend Section */}
        <AnimateIn from="zoom-in" delay={0.1}>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6">
            {([3, 2, 1] as const).map((level) => (
              <li
                key={level}
                className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider"
              >
                <span className="text-primary">
                  <ProficiencyDots level={level} />
                </span>
                {levelLabels[level]}
              </li>
            ))}
          </ul>
        </AnimateIn>
      </div>

      {/* Marquee Rows Section — rows lean with scroll velocity for inertia */}
      <VelocitySkew className="space-y-3">
        {skillGroups.map(({ category, skills }, i) => {
          const direction = i % 2 === 0 ? "rtl" : "ltr";
          const half: ISkill[] = Array.from(
            { length: COPIES_PER_HALF * skills.length },
            (_, j) => skills[j % skills.length],
          );
          const track = [...half, ...half];

          return (
            <AnimateIn
              key={category}
              from={direction === "rtl" ? "right" : "left"}
              distance={80}
              delay={i * 0.08}
            >
              <div className="relative">
                {/* Left Fade + Category Label */}
                <div className="absolute inset-y-0 left-0 w-40 sm:w-52 bg-linear-to-r from-background via-background/80 to-transparent z-10 pointer-events-none flex items-center pl-6">
                  <span className="text-[10px] font-mono text-muted-foreground dark:text-muted-foreground/60 uppercase tracking-[0.2em] select-none">
                    {category}
                  </span>
                </div>
                {/* Right Fade */}
                <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

                <MarqueeTrack direction={direction} duration={60}>
                  {track.map((skill, j) => (
                    <SkillBadge
                      key={j}
                      skill={skill}
                      levelLabel={levelLabels[skill.level]}
                    />
                  ))}
                </MarqueeTrack>
              </div>
            </AnimateIn>
          );
        })}
      </VelocitySkew>
    </section>
  );
}

/* --------------------------------- Utilities -------------------------------- */
/** A three-dot meter; dots up to `level` are filled with the current text color. */
function ProficiencyDots(props: { level: TSkillLevel }) {
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

function SkillBadge(props: { skill: ISkill; levelLabel: string }) {
  /* ---------------------------------- Props --------------------------------- */
  const { skill, levelLabel } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const Icon = ICON_MAP[skill.icon];

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      className="group flex items-center gap-2 px-3.5 py-2 rounded border border-border/50 bg-card whitespace-nowrap shrink-0 select-none transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_16px_rgba(148,162,255,0.12)] motion-safe:hover:-translate-y-0.5"
      title={`${skill.name} — ${levelLabel}`}
    >
      {Icon && (
        <Icon
          className="w-4 h-4 shrink-0 transition-transform duration-300 motion-safe:group-hover:scale-125"
          style={{ color: skill.color }}
        />
      )}
      <span className="text-xs font-mono text-muted-foreground">
        {skill.name}
      </span>
      <span className="sr-only">{levelLabel}</span>
      <span
        className="ml-0.5 shrink-0"
        style={{ color: skill.color }}
        aria-hidden
      >
        <ProficiencyDots level={skill.level} />
      </span>
    </div>
  );
}
