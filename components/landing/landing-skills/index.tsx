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
import { ProficiencyDots, SkillBadge } from "./skill-badge";

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
      className="relative isolate py-16 sm:py-20 lg:py-24 bg-background overflow-hidden"
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
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3"
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
      <VelocitySkew className="space-y-4">
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
                {/* Left Fade + Category Label — the fade is sized to just
                    clear the label. The desktop 208px would swallow 55% of a
                    375px row, so phones get a narrower mask (and a tighter
                    gutter) to keep the badges themselves readable. */}
                <div className="absolute inset-y-0 left-0 w-28 sm:w-52 bg-linear-to-r from-background via-background/80 to-transparent z-10 pointer-events-none flex items-center pl-4 sm:pl-6">
                  <span className="text-[10px] font-mono text-muted-foreground dark:text-muted-foreground/60 uppercase tracking-[0.15em] sm:tracking-[0.2em] select-none">
                    {category}
                  </span>
                </div>
                {/* Right Fade */}
                <div className="absolute inset-y-0 right-0 w-12 sm:w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />

                <MarqueeTrack
                  direction={direction}
                  duration={60}
                  className="py-2"
                >
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
