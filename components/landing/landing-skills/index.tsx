import { skillGroups } from "@/utils/constants/portfolio.constant";
import type { ISkill } from "@/utils/interfaces/portfolio";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { MarqueeTrack } from "@/components/utils/animations/marquee-track";
import { SectionHeading } from "@/components/landing/section-heading";
import { SkillBadge } from "./skill-badge";
import { SkillIconSprite } from "./skill-icon-sprite";

// A half only needs to cover a wide desktop viewport. The previous 4000px
// target emitted hundreds of duplicate badges into the initial HTML.
const MIN_HALF_PX = 2200;

function estimatedTileWidth(skill: ISkill) {
  return 112 + skill.name.length * 7;
}

function repeatedHalf(skills: ISkill[]) {
  const rowWidth = skills.reduce(
    (total, skill) => total + estimatedTileWidth(skill) + 14,
    0,
  );
  const copies = Math.max(2, Math.ceil(MIN_HALF_PX / rowWidth));
  return Array.from(
    { length: copies * skills.length },
    (_, index) => skills[index % skills.length],
  );
}

export default function LandingSkills({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const fullStackCategories = ["Mobile", "Frontend", "Backend"];
  const groupedSkills = [
    {
      category: "Full Stack",
      skills: fullStackCategories.flatMap(
        (category) =>
          skillGroups.find((group) => group.category === category)?.skills ?? [],
      ),
    },
    ...skillGroups.filter(
      (group) => !fullStackCategories.includes(group.category),
    ),
  ];
  const tracks = groupedSkills.map(({ category, skills }, index) => ({
    label: category,
    skills,
    direction: index % 2 === 0 ? ("rtl" as const) : ("ltr" as const),
    duration: 44 + index * 3,
  }));
  const uniqueSkills = skillGroups.flatMap((group) => group.skills);

  return (
    <section id="skills" className="relative isolate overflow-clip py-20 sm:py-24 lg:py-32">
      <SkillIconSprite icons={uniqueSkills.map((skill) => skill.icon)} />

      <div className="mx-auto mb-12 grid max-w-6xl gap-6 px-6 sm:mb-16 lg:grid-cols-[1fr_.72fr] lg:items-end">
        <div>
          <AnimateIn from="zoom-in">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              {lang === "km" ? "សមត្ថភាព" : "Capabilities"}
            </p>
          </AnimateIn>
          <SectionHeading
            section="skills"
            className="max-w-2xl text-4xl font-bold tracking-[-0.035em] text-foreground sm:text-5xl lg:text-6xl"
          >
            {dict.skills.heading}
          </SectionHeading>
        </div>
        <AnimateIn from="up" delay={0.12}>
          <p className="max-w-lg text-sm leading-relaxed text-field-muted-foreground sm:text-base">
            {lang === "km"
              ? "ឧបករណ៍ដែលខ្ញុំប្រើដើម្បីបំលែងគំនិតទៅជាផលិតផលឌីជីថលដែលរលូន ឆ្លាតវៃ និងអាចទុកចិត្តបាន។"
              : "A focused toolkit for turning ideas into digital products that feel polished, intelligent, and dependable."}
          </p>
        </AnimateIn>
      </div>

      <ul className="sr-only">
        {uniqueSkills.map((skill) => <li key={skill.name}>{skill.name}</li>)}
      </ul>

      <div className="relative mx-auto w-full px-3 sm:px-6">
        <div className="relative overflow-clip rounded-2xl border border-border/55 bg-card/50 py-4 shadow-[0_24px_80px_rgb(0_0_0/.07)] backdrop-blur-sm sm:py-6">
          {tracks.map((track, index) => {
            const half = repeatedHalf(track.skills);
            const repeated = [...half, ...half];
            return (
              <AnimateIn
                key={track.label}
                from={track.direction === "rtl" ? "right" : "left"}
                distance={70}
                delay={index * 0.1}
              >
                <div className={`grid gap-3 px-3 py-3 sm:grid-cols-[10rem_1fr] sm:items-center sm:gap-0 sm:px-5 ${index > 0 ? "border-t border-border/35" : ""}`}>
                  <div className="relative z-10 flex items-end justify-between px-2 sm:block sm:px-0 sm:pr-5">
                    <p className="text-sm font-bold tracking-[-.01em] text-foreground">{track.label}</p>
                  </div>
                  <div aria-hidden="true" className="min-w-0 overflow-hidden rounded-lg">
                    <MarqueeTrack
                      direction={track.direction}
                      duration={track.duration}
                      className="py-1 [mask-image:linear-gradient(to_right,transparent,black_3rem,black_calc(100%_-_3rem),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_5rem,black_calc(100%_-_5rem),transparent)]"
                    >
                      {repeated.map((skill, skillIndex) => (
                        <SkillBadge key={`${skill.name}-${skillIndex}`} skill={skill} />
                      ))}
                    </MarqueeTrack>
                  </div>
                </div>
              </AnimateIn>
            );
          })}
        </div>
        <p className="mt-4 hidden text-center text-[10px] uppercase tracking-[.15em] text-muted-foreground sm:block">
          {lang === "km" ? "ដាក់កណ្ដុរលើដើម្បីផ្អាក" : "Hover to pause · Explore at your pace"}
        </p>
      </div>
    </section>
  );
}
