import Image from "next/image";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/utils/animations/reveal";
import { organizations } from "@/utils/constants/portfolio.constant";
import { EarlierRoles } from "./earlier-roles";
import { ExperienceRow } from "./experience-row";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getExperiences } from "@/utils/i18n/content";

/**
 * Experience.
 *
 * An index of roles, most recent first. The three most recent are printed in
 * full; the rest sit behind a disclosure.
 *
 * The organization logos are no longer a scrolling marquee — they are a
 * static row, desaturated to a single ink weight so seven different brand
 * palettes don't shatter the page's two colours. `grayscale` plus a reduced
 * opacity does that in both themes; the dark theme additionally inverts, since
 * these are dark-on-transparent marks.
 */
export default function LandingExperience({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const experiences = getExperiences(lang);
  const recent = experiences.slice(0, 3);
  const earlier = experiences.slice(3);

  return (
    <Section id="experience">
      <SectionHeader
        numeral="04"
        label={dict.sections.experience}
        title={dict.experience.heading}
      />

      <div className="mt-16 border-t border-rule">
        {recent.map((exp, i) => (
          <ExperienceRow
            key={`${exp.role}-${exp.company}`}
            role={exp}
            index={i}
            delay={i * 70}
          />
        ))}

        {earlier.length > 0 && (
          <EarlierRoles
            experiences={earlier}
            label={dict.experience.earlierRoles}
            startIndex={recent.length}
          />
        )}
      </div>

      {/* ── Organizations ─────────────────────────────────────────────── */}
      <Reveal delay={120}>
        <div className="mt-20 border-t border-rule pt-8">
          <p className="eyebrow">{dict.experience.organizations}</p>
          <ul className="mt-8 grid grid-cols-2 items-center gap-x-10 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
            {organizations.map((org) => (
              <li key={org.name} className="flex items-center">
                <Image
                  src={org.logo}
                  alt={org.name}
                  width={120}
                  height={44}
                  className="h-8 w-auto max-w-full object-contain opacity-55 grayscale transition-opacity duration-300 hover:opacity-90 dark:invert"
                />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
