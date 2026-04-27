import { skillGroups } from "@/data/portfolio";
import type { Skill } from "@/types";
import { AnimateIn } from "@/components/ui/animate-in";
import { MarqueeTrack } from "@/components/ui/marquee-track";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiHtml5,
  SiPython, SiNodedotjs, SiPostgresql, SiGraphql, SiFastapi,
  SiPytorch, SiTensorflow, SiOpenai, SiLangchain, SiHuggingface,
  SiFlutter, SiDart, SiFirebase, SiAndroid, SiXcode,
  SiGit, SiDocker, SiGithub, SiVercel, SiLinux,
} from "react-icons/si";
import type { IconType } from "react-icons";

const ICON_MAP: Record<string, IconType> = {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiHtml5,
  SiPython, SiNodedotjs, SiPostgresql, SiGraphql, SiFastapi,
  SiPytorch, SiTensorflow, SiOpenai, SiLangchain, SiHuggingface,
  SiFlutter, SiDart, SiFirebase, SiAndroid, SiXcode,
  SiGit, SiDocker, SiGithub, SiVercel, SiLinux,
};

// 8 copies per half → 16 items per skill → seamless loop on any screen including 4K
const COPIES_PER_HALF = 8;

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-slate-900 overflow-hidden">

      {/* Section header */}
      <div className="max-w-5xl mx-auto px-6 mb-16">
        <AnimateIn>
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">
            Skills
          </p>
        </AnimateIn>
        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            Technologies I work with
          </h2>
        </AnimateIn>
      </div>

      {/* One marquee row per category */}
      <div className="space-y-4">
        {skillGroups.map(({ category, skills }, i) => {
          const direction = i % 2 === 0 ? "rtl" : "ltr";

          // Build track: two identical halves so translateX(-50%) loops seamlessly
          const half: Skill[] = Array.from(
            { length: COPIES_PER_HALF * skills.length },
            (_, j) => skills[j % skills.length]
          );
          const track = [...half, ...half];

          return (
            <AnimateIn key={category} y={20} delay={i * 0.08}>
              <div className="relative">

                {/* Left fade + category label */}
                <div className="absolute inset-y-0 left-0 w-40 sm:w-52 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10 pointer-events-none flex items-center pl-6">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] select-none">
                    {category}
                  </span>
                </div>

                {/* Right fade */}
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

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
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-800 border border-slate-700/50 whitespace-nowrap shrink-0 select-none">
      {Icon && (
        <Icon className="w-[18px] h-[18px] shrink-0" style={{ color: skill.color }} />
      )}
      <span className="text-sm text-slate-300 font-medium">{skill.name}</span>
    </div>
  );
}
