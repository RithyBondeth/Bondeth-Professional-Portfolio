import { skillGroups } from "@/data/portfolio";
import type { Skill } from "@/types";
import { AnimateIn } from "@/components/ui/animate-in";
import { MarqueeTrack } from "@/components/ui/marquee-track";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiHtml5,
  SiPython,
  SiNodedotjs,
  SiPostgresql,
  SiGraphql,
  SiFastapi,
  SiPytorch,
  SiTensorflow,
  SiOpenai,
  SiLangchain,
  SiHuggingface,
  SiFlutter,
  SiDart,
  SiFirebase,
  SiAndroid,
  SiXcode,
  SiGit,
  SiDocker,
  SiGithub,
  SiVercel,
  SiLinux,
} from "react-icons/si";
import type { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiHtml5,
  SiPython,
  SiNodedotjs,
  SiPostgresql,
  SiGraphql,
  SiFastapi,
  SiPytorch,
  SiTensorflow,
  SiOpenai,
  SiLangchain,
  SiHuggingface,
  SiFlutter,
  SiDart,
  SiFirebase,
  SiAndroid,
  SiXcode,
  SiGit,
  SiDocker,
  SiGithub,
  SiVercel,
  SiLinux,
};

const COPIES_PER_HALF = 8;

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-background overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <AnimateIn>
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <span className="text-muted-foreground">//</span> skills.ts
          </p>
        </AnimateIn>
        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3">
            Technologies I work with
          </h2>
        </AnimateIn>
      </div>

      <div className="space-y-3">
        {skillGroups.map(({ category, skills }, i) => {
          const direction = i % 2 === 0 ? "rtl" : "ltr";
          const half: Skill[] = Array.from(
            { length: COPIES_PER_HALF * skills.length },
            (_, j) => skills[j % skills.length],
          );
          const track = [...half, ...half];

          return (
            <AnimateIn key={category} y={20} delay={i * 0.08}>
              <div className="relative">
                {/* Left fade + category label */}
                <div className="absolute inset-y-0 left-0 w-40 sm:w-52 bg-linear-to-r from-[#060d1f] via-[#060d1f]/80 to-transparent z-10 pointer-events-none flex items-center pl-6">
                  <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-[0.2em] select-none">
                    {category}
                  </span>
                </div>
                {/* Right fade */}
                <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-[#060d1f] to-transparent z-10 pointer-events-none" />

                <MarqueeTrack direction={direction} duration={60}>
                  {track.map((skill, j) => (
                    <SkillBadge key={j} skill={skill} />
                  ))}
                </MarqueeTrack>
              </div>
            </AnimateIn>
          );
        })}
      </div>
    </section>
  );
}

function SkillBadge({ skill }: { skill: Skill }) {
  const Icon = ICON_MAP[skill.icon];
  return (
    <div className="flex items-center gap-2 px-3.5 py-2 rounded border border-border/50 bg-card whitespace-nowrap shrink-0 select-none hover:border-primary/20 transition-colors">
      {Icon && (
        <Icon className="w-4 h-4 shrink-0" style={{ color: skill.color }} />
      )}
      <span className="text-xs font-mono text-muted-foreground">{skill.name}</span>
    </div>
  );
}
