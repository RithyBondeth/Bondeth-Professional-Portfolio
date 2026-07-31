import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/utils/animations/reveal";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import {
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
} from "@/components/utils/icons";
import ContactForm from "./contact-form";
import { getDictionary, type TLocale } from "@/utils/i18n";

/**
 * Contact — the last page of the document.
 *
 * The form no longer sits inside a raised, shadowed panel. On paper the reply
 * card is part of the page, and the fields are rules you write on top of; the
 * inputs are styled the same way, so the section stays flat and the only
 * boxed thing on the whole site is the send button.
 */
export default function LandingContact({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);

  const socials = [
    { href: siteConfig.github, label: "GitHub", Icon: GitHubIcon },
    { href: siteConfig.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: siteConfig.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: siteConfig.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: `mailto:${siteConfig.email}`, label: "Email", Icon: MailIcon },
  ];

  return (
    <Section id="contact">
      <SectionHeader
        numeral="09"
        label={dict.sections.contact}
        title={dict.contact.heading}
        lead={dict.contact.blurb}
        aside={
          <p className="text-sm leading-relaxed text-foreground">
            <span
              aria-hidden
              className="mr-2 inline-block h-1.5 w-1.5 -translate-y-px bg-marker"
            />
            {dict.contact.availability}
          </p>
        }
      />

      <div className="mt-16 grid gap-x-10 gap-y-14 lg:grid-cols-12">
        {/* ── What happens next ─────────────────────────────────────────── */}
        <Reveal className="lg:col-span-4">
          <h3 className="eyebrow">{dict.contact.nextHeading}</h3>
          <ol className="mt-6">
            {dict.contact.nextSteps.map((step, i) => (
              <li
                key={step}
                className="flex gap-4 border-b border-rule py-4 text-sm leading-relaxed text-muted-foreground first:border-t"
              >
                <span className="eyebrow numeral shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <a
            href={`mailto:${siteConfig.email}`}
            className="btn-fx link-wipe mt-8 inline-block text-sm"
          >
            {dict.contact.directEmail} {siteConfig.email}
          </a>
        </Reveal>

        {/* ── Form ──────────────────────────────────────────────────────── */}
        <Reveal delay={100} className="lg:col-span-7 lg:col-start-6">
          <ContactForm lang={lang} />
        </Reveal>
      </div>

      {/* ── Elsewhere ───────────────────────────────────────────────────── */}
      <Reveal delay={200}>
        <ul className="mt-20 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-rule pt-8">
          {socials.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("mailto:") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="btn-fx link-wipe inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
