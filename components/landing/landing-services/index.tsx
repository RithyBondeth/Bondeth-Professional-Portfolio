import Link from "next/link";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/utils/animations/reveal";
import { getDictionary, type TLocale } from "@/utils/i18n";

/**
 * Services.
 *
 * Numbered entries in the same label/value row as the rest of the page. The
 * four lucide glyphs that used to head each card are gone: a browser frame, a
 * phone and a robot are decorative stand-ins for words that are already right
 * there, and they were the only iconography left in the body of the site.
 */
export default function LandingServices({ lang }: { lang: TLocale }) {
  const { services, sections } = getDictionary(lang);

  return (
    <Section id="services">
      <SectionHeader
        numeral="06"
        label={sections.services}
        title={services.heading}
        lead={services.blurb}
        action={
          <Link
            href="#contact"
            className="btn-fx link-wipe text-sm text-muted-foreground hover:text-foreground"
          >
            {services.discussProject}
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
        }
      />

      <div className="mt-16 border-t border-rule">
        {services.items.map((item, i) => (
          <Reveal key={item.title} delay={i * 70}>
            <div className="grid gap-x-10 gap-y-3 border-b border-rule py-8 lg:grid-cols-12">
              <p className="eyebrow numeral lg:col-span-3 lg:pt-2">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="lg:col-span-9">
                <h3 className="display-sm">{item.title}</h3>
                <p className="measure mt-3 leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
