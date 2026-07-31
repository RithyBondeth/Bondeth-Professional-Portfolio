import Image from "next/image";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/utils/animations/reveal";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import {
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
} from "@/components/utils/icons";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

/**
 * About.
 *
 * The portrait is now simply a photograph: a hairline frame, a caption
 * underneath, and nothing else. The typed code editor it used to sit inside
 * was the single most "developer-portfolio" element on the site.
 *
 * The bio runs as a lead paragraph followed by the remaining paragraphs in
 * text size, and the four figures are printed as a rule-separated strip —
 * the way a magazine prints statistics, rather than four hovering cards.
 */

const figures = [
  { key: "yearsExp", value: "3+" },
  { key: "projects", value: "20+" },
  { key: "techStack", value: "20+" },
  { key: "clients", value: "15+" },
] as const;

export default function LandingAbout({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const localized = getSiteConfig(lang);
  const [lead, ...rest] = localized.bio;

  const socials = [
    { href: siteConfig.github, label: "GitHub", Icon: GitHubIcon },
    { href: siteConfig.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: siteConfig.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: siteConfig.instagram, label: "Instagram", Icon: InstagramIcon },
  ];

  return (
    <Section id="about">
      <SectionHeader
        numeral="01"
        label={dict.nav.about}
        title={dict.about.heading}
      />

      <div className="mt-16 grid gap-x-10 gap-y-12 lg:grid-cols-12">
        {/* ── Portrait ────────────────────────────────────────────────────
            Held to a portrait aspect and cropped rather than letterboxed, so
            it reads as a plate on the page. */}
        <Reveal className="lg:col-span-4">
          <figure>
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-rule bg-secondary">
              <Image
                src="/bondeth.webp"
                alt={dict.about.portraitAlt}
                fill
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                className="object-cover object-top"
              />
            </div>
            <figcaption className="eyebrow mt-4">
              {siteConfig.fullName} — {localized.title}
            </figcaption>
          </figure>
        </Reveal>

        {/* ── Bio ─────────────────────────────────────────────────────────
            The lead is set a size up and in the ink colour; the rest drops to
            the muted tone. That difference alone establishes the hierarchy —
            no rules or boxes needed. */}
        <div className="lg:col-span-7 lg:col-start-6">
          <Reveal delay={80}>
            <p className="measure text-xl leading-relaxed text-foreground sm:text-2xl">
              {lead}
            </p>
          </Reveal>

          <div className="measure mt-8 space-y-5">
            {rest.map((paragraph, i) => (
              <Reveal key={i} delay={140 + i * 70}>
                <p className="leading-relaxed text-muted-foreground">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={320}>
            <ul className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
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
        </div>
      </div>

      {/* ── Figures ───────────────────────────────────────────────────────
          Four columns divided by hairlines. The numbers are set in the display
          face, large, with lining figures so they align on the baseline. */}
      <div className="mt-20 grid grid-cols-2 border-t border-rule sm:grid-cols-4">
        {figures.map(({ key, value }, i) => (
          <Reveal
            key={key}
            delay={i * 70}
            className={
              // Hairlines between columns only — the wrapping second row on
              // phones gets its own top rule instead.
              "border-rule px-1 pt-6 pb-2 sm:px-0 " +
              (i % 2 === 1 ? "border-l pl-5 sm:border-l sm:pl-6 " : "") +
              (i >= 2 ? "border-t sm:border-t-0 " : "") +
              (i === 2 ? "sm:border-l sm:pl-6 " : "")
            }
          >
            <p className="display-sm font-normal tabular-nums [font-variant-numeric:lining-nums_tabular-nums]">
              {value}
            </p>
            <p className="eyebrow mt-3">{dict.about.stats[key]}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
