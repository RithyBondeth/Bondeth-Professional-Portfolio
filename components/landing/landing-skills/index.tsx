import { skillGroups } from "@/utils/constants/portfolio.constant";
import {
  ISkill,
  type TSkillLevel,
} from "@/utils/interfaces/portfolio";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { MarqueeTrack } from "@/components/utils/animations/marquee-track";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { VelocitySkew } from "@/components/utils/animations/velocity-skew";
import { ProficiencyDots, SkillBadge } from "./skill-badge";
import { SkillIconSprite } from "./skill-icon-sprite";

/**
 * The marquee scrolls a track by exactly -50%, so the track is the caller's
 * `half` rendered twice and the wrap is seamless as long as ONE half is wider
 * than the viewport. Anything past that is markup nobody can ever see.
 *
 * This used to be a flat 8 copies per half — 16 badges per skill, 576 badges
 * on the page, and 1.5MB of HTML for a section that shows maybe a dozen pills
 * at a time. Sizing each row to its own content instead means a row of three
 * skills still repeats enough to fill the screen while a row of seven barely
 * repeats at all.
 */
/**
 * Width one half must reach: a 4K viewport, so the wrap still has something to
 * wrap to on the widest screen anyone is likely to open this on. Falling short
 * is a visible bug — the track runs out and the row goes blank until the loop
 * comes back around — which is why this is generous and why {@link badgeWidth}
 * deliberately guesses low.
 */
const MIN_HALF_PX = 4000;
/** Even a very wide row repeats, so the loop reads as a cycle and not a jump. */
const MIN_COPIES = 2;

/**
 * Estimated rendered width of a badge, in px: fixed furniture (padding, icon,
 * dots, gaps) plus the name.
 *
 * Tuned to UNDER-estimate, and that direction is the whole point. Guessing
 * high divides MIN_HALF_PX by too large a row and emits too FEW copies, which
 * is the one failure that shows on screen; guessing low just costs a little
 * markup. Measured against the real render, this sits ~10% under across the
 * name lengths actually in use (Git → Tailwind CSS).
 */
function badgeWidth(skill: ISkill) {
  return 90 + skill.name.length * 6;
}

function copiesPerHalf(skills: ISkill[]) {
  const rowPx = skills.reduce((sum, s) => sum + badgeWidth(s) + 12, 0);
  return Math.max(MIN_COPIES, Math.ceil(MIN_HALF_PX / rowPx));
}

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
      className="relative isolate py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Every icon's geometry, defined once. The badges below reference these
          by id, so this has to be in the document before them. */}
      <SkillIconSprite
        icons={skillGroups.flatMap(({ skills }) => skills.map((s) => s.icon))}
      />

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
            { length: copiesPerHalf(skills) * skills.length },
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
                {/* Category Label. It used to sit on a `from-background`
                    gradient that doubled as the left fade — but the section is
                    transparent now and the gradient-wave animates behind it, so
                    painting --background over the row left an off-white wedge
                    floating on the blue whenever the wave drifted underneath.
                    The fade is a MASK on the track instead (below): it removes
                    the badges rather than covering them, so it works over any
                    background and costs no extra layer. */}
                <div className="absolute inset-y-0 left-0 w-28 sm:w-52 z-10 pointer-events-none flex items-center pl-4 sm:pl-6">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em] select-none">
                    {category}
                  </span>
                </div>

                {/* The mask stops are the old fade widths: 7rem/13rem on the
                    left to just clear the label, 3rem/6rem on the right. The
                    desktop 13rem would swallow 55% of a 375px row, so phones
                    get the narrower pair. */}
                <MarqueeTrack
                  direction={direction}
                  duration={60}
                  className="py-2 mask-[linear-gradient(to_right,transparent_0,black_7rem,black_calc(100%-3rem),transparent_100%)] sm:mask-[linear-gradient(to_right,transparent_0,black_13rem,black_calc(100%-6rem),transparent_100%)]"
                >
                  {/* Only the first pass through the skill set is real content.
                      Everything after it exists to make the loop seamless, and a
                      screen reader was reading all of it — 416 badges on this
                      page, so "TypeScript, Expert" eleven times in a row. The
                      duplicates are decorative and now say so. */}
                  {track.map((skill, j) => (
                    <SkillBadge
                      key={j}
                      skill={skill}
                      levelLabel={levelLabels[skill.level]}
                      decorative={j >= skills.length}
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
