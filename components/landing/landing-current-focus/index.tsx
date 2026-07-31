import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/utils/animations/reveal";
import { getDictionary, type TLocale } from "@/utils/i18n";

/**
 * Current focus.
 *
 * A definition list, printed. The rotating wireframe globe that used to sit
 * beside it was the section's whole visual argument, and it was pure
 * technology-signalling — the copy makes the same point on its own.
 *
 * Each row is label / value across the measure, divided by a hairline: the
 * same shape as the masthead colophon and the experience index below.
 * Repeating one row pattern is what holds the page together.
 */
export default function LandingCurrentFocus({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const { currentFocus, labs, sections } = dict;

  const availability = (
    <p className="text-sm leading-relaxed text-foreground">
      <span
        aria-hidden
        className="mr-2 inline-block h-1.5 w-1.5 -translate-y-px bg-marker"
      />
      {currentFocus.status}
    </p>
  );

  return (
    <Section id="current-focus">
      <SectionHeader
        numeral="02"
        label={sections.now}
        title={currentFocus.heading}
        lead={currentFocus.blurb}
        aside={availability}
      />

      <dl className="mt-16 border-t border-rule">
        {currentFocus.items.map(({ label, value }, i) => (
          <Reveal key={label} delay={i * 70}>
            <div className="grid gap-x-10 gap-y-2 border-b border-rule py-7 lg:grid-cols-12">
              <dt className="eyebrow lg:col-span-3 lg:pt-1">{label}</dt>
              <dd className="measure leading-relaxed text-foreground lg:col-span-9">
                {value}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>

      <Reveal delay={280}>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          {/* The availability line repeats here on narrow screens, where the
              header's aside column is hidden. */}
          <div className="lg:hidden">{availability}</div>
          <Link href={`/${lang}/labs`} className="btn-fx link-wipe text-sm">
            {labs.navLabel}
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
