import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/utils/animations/reveal";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getEducations, getTrainingCourses } from "@/utils/i18n/content";

/**
 * Education.
 *
 * Same index row as experience — dated sidenote, entry, notes — so the two
 * sections read as consecutive pages of one document. Training courses follow
 * as a plain two-column list, since each is a single line and giving them
 * cards would overstate them.
 */
export default function LandingEducation({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const educations = getEducations(lang);
  const trainingCourses = getTrainingCourses(lang);

  return (
    <Section id="education">
      <SectionHeader
        numeral="05"
        label={dict.sections.education}
        title={dict.education.heading}
      />

      <div className="mt-16 border-t border-rule">
        {educations.map((edu, i) => (
          <Reveal key={edu.degree} delay={i * 70}>
            <article className="grid gap-x-10 gap-y-3 border-b border-rule py-8 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <p className="eyebrow">{edu.period}</p>
                <p className="eyebrow mt-2">{edu.location}</p>
              </div>

              <div className="lg:col-span-9">
                <h3 className="display-sm">{edu.degree}</h3>
                <p className="mt-1 text-base text-muted-foreground">
                  {edu.institution}
                </p>
                <p className="measure mt-4 leading-relaxed text-muted-foreground">
                  {edu.description}
                </p>

                {edu.achievements.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {edu.achievements.map((achievement) => (
                      <li
                        key={achievement}
                        className="measure flex gap-3 text-sm leading-relaxed text-foreground"
                      >
                        <span aria-hidden className="text-marker">
                          —
                        </span>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* ── Training ──────────────────────────────────────────────────── */}
      <Reveal delay={120}>
        <div className="mt-16 grid gap-x-10 gap-y-6 lg:grid-cols-12">
          <p className="eyebrow lg:col-span-3">
            {dict.education.trainingCourses}
          </p>
          <ul className="lg:col-span-9">
            {trainingCourses.map((course) => (
              <li
                key={course.title}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-rule py-3.5 first:border-t"
              >
                <span className="text-base text-foreground">{course.title}</span>
                <span className="eyebrow">{course.institution}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
