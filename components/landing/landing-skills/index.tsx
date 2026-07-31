import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/utils/animations/reveal";
import { skillGroups } from "@/utils/constants/portfolio.constant";
import { type TSkillLevel } from "@/utils/interfaces/portfolio";
import { getDictionary, type TLocale } from "@/utils/i18n";

/**
 * Skills.
 *
 * Set as an index, not a logo wall. The scrolling marquee of coloured brand
 * badges was the loudest thing on the page and said nothing the names don't:
 * this prints each category as a row, with its technologies as a run of text
 * separated by thin dividers, and proficiency shown as a small caps qualifier
 * rather than a row of filled dots.
 *
 * Grouping proficiency in the label (instead of per item) keeps the row
 * readable — the qualifier only appears where it differs from "expert".
 */
export default function LandingSkills({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);

  const levelLabels: Record<TSkillLevel, string> = {
    3: dict.skills.levels.expert,
    2: dict.skills.levels.proficient,
    1: dict.skills.levels.familiar,
  };

  return (
    <Section id="skills">
      <SectionHeader
        numeral="03"
        label={dict.sections.skills}
        title={dict.skills.heading}
      />

      <div className="mt-16 border-t border-rule">
        {skillGroups.map((group, i) => (
          <Reveal key={group.category} delay={i * 60}>
            <div className="grid gap-x-10 gap-y-4 border-b border-rule py-8 lg:grid-cols-12">
              <h3 className="eyebrow lg:col-span-3 lg:pt-1.5">
                {group.category}
              </h3>

              {/* A run of names rather than a grid of chips. The divider is a
                  thin vertical rule set in the muted tone, so the eye reads
                  one continuous line of type. */}
              <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-2 lg:col-span-9">
                {group.skills.map((skill, j) => (
                  <li
                    key={skill.name}
                    className="flex items-baseline gap-4 text-lg leading-snug text-foreground"
                  >
                    <span>{skill.name}</span>
                    {skill.level < 3 && (
                      <span className="eyebrow -translate-y-px">
                        {levelLabels[skill.level]}
                      </span>
                    )}
                    {j < group.skills.length - 1 && (
                      <span
                        aria-hidden
                        className="h-4 w-px translate-y-0.5 bg-rule"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
