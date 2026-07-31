import Link from "next/link";
import { Container } from "@/components/ui/section";
import { Reveal, RevealRule } from "@/components/utils/animations/reveal";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

/**
 * The masthead.
 *
 * This is a title page, not a hero banner: the name is set as large as the
 * measure allows, the roles run underneath as a single line of caps, and the
 * standing details are printed as a colophon in the left margin. There is no
 * boot sequence, no typewriter, no code window, no glow — the only thing that
 * moves is the same fade every other section uses, which is why this can be a
 * server component now.
 */
export default function LandingHero({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const localized = getSiteConfig(lang);
  const { colophon } = dict.hero;

  const colophonRows = [
    { label: colophon.practice, value: colophon.practiceValue },
    { label: colophon.based, value: colophon.basedValue },
    { label: colophon.status, value: colophon.statusValue },
  ];

  return (
    <section id="top" className="relative">
      <Container>
        {/* `svh` rather than `vh`: on mobile Safari a `100vh` masthead is
            always taller than the visible viewport, which pushes the roles
            and the colophon below the fold on first paint. */}
        <div className="flex min-h-[92svh] flex-col justify-between pt-32 pb-16 sm:pt-40 lg:pt-44">
          {/* ── Running head ─────────────────────────────────────────────── */}
          <Reveal>
            <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-4">
              <p className="eyebrow">{localized.title}</p>
              <p className="eyebrow hidden sm:block">
                {colophon.basedValue}
              </p>
            </div>
          </Reveal>

          {/* ── Name ─────────────────────────────────────────────────────── */}
          <div className="py-12 sm:py-16">
            <Reveal delay={80}>
              {/* Split across two lines with the surname indented and set in
                  italic — the display face's only emphasis, and the thing
                  that makes the block read as a title page rather than a
                  logotype. `leading-[0.82]` closes the gap between the two
                  lines so they lock together as one shape. */}
              <h1 className="display-xl leading-[0.82] tracking-[-0.02em]">
                <span className="block">{siteConfig.fullName.split(" ")[0]}</span>
                <span className="display-em block pl-[6vw] sm:pl-[10vw]">
                  {siteConfig.fullName.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </Reveal>

            <Reveal delay={180}>
              <p className="eyebrow mt-10 max-w-3xl sm:mt-12">
                {dict.hero.titles.join("  ·  ")}
              </p>
            </Reveal>

            <Reveal delay={240}>
              <p className="measure mt-6 text-lg leading-relaxed text-muted-foreground">
                {localized.tagline}
              </p>
            </Reveal>

            {/* ── Actions ────────────────────────────────────────────────── */}
            <Reveal delay={320}>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href={`/${lang}/projects`}
                  className="btn-fx link-wipe text-base"
                >
                  {dict.hero.viewWork}
                </Link>
                <a
                  href={siteConfig.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-fx link-wipe text-base text-muted-foreground"
                >
                  {dict.hero.downloadCv}
                </a>
                <a
                  href={`#contact`}
                  className="btn-fx link-wipe text-base text-muted-foreground"
                >
                  {dict.hero.getInTouch}
                </a>
              </div>
            </Reveal>
          </div>

          {/* ── Colophon ─────────────────────────────────────────────────── */}
          <div>
            <RevealRule delay={200} />
            <dl className="grid gap-x-10 gap-y-6 pt-6 sm:grid-cols-3">
              {colophonRows.map(({ label, value }, i) => (
                <Reveal key={label} delay={360 + i * 70}>
                  <dt className="eyebrow">{label}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-foreground">
                    {value}
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
