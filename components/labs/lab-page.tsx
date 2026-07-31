import Link from "next/link";
import { Container } from "@/components/ui/section";
import { PageMain } from "@/components/ui/page-header";
import { Reveal } from "@/components/utils/animations/reveal";
import type { TLocale } from "@/utils/i18n";

/**
 * The shell shared by every lab detail page.
 *
 * All three labs had the same page written out three times — same back link,
 * same pair of status pills, same title block, same three-up "how it works"
 * cards, same related-reading box. They drifted apart in small ways as each
 * was edited. One component, three call sites.
 *
 * The demo itself is the only thing on the page allowed to be a boxed,
 * interactive surface: it's a working instrument, not an illustration.
 */
export function LabPage({
  lang,
  backLabel,
  status,
  title,
  intro,
  steps,
  relatedReadingLabel,
  relatedArticleLabel,
  relatedHref,
  children,
}: {
  lang: TLocale;
  backLabel: string;
  /** Short qualifiers printed under the running head — "experimental", "runs locally". */
  status: string[];
  title: string;
  intro: string;
  steps: { title: string; description: string }[];
  relatedReadingLabel: string;
  relatedArticleLabel: string;
  relatedHref: string;
  /** The lab widget itself. */
  children: React.ReactNode;
}) {
  return (
    <PageMain lang={lang}>
      <Container>
        <header className="pt-32 pb-10 sm:pt-40">
          <Reveal>
            <Link
              href={`/${lang}/labs`}
              className="btn-fx link-wipe mb-10 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
              <span aria-hidden className="mr-2">
                ←
              </span>
              {backLabel}
            </Link>
          </Reveal>

          <Reveal delay={40}>
            <p className="eyebrow">{status.join(" · ")}</p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="display-lg mt-4 text-balance">{title}</h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="measure mt-6 text-lg leading-relaxed text-muted-foreground">
              {intro}
            </p>
          </Reveal>
        </header>

        <Reveal delay={180}>{children}</Reveal>

        {/* ── How it works ──────────────────────────────────────────────── */}
        <div className="mt-16 border-t border-rule">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 70}>
              <div className="grid gap-x-10 gap-y-3 border-b border-rule py-7 lg:grid-cols-12">
                <p className="eyebrow numeral lg:col-span-3 lg:pt-1">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div className="lg:col-span-9">
                  <h2 className="text-lg leading-snug text-foreground">
                    {step.title}
                  </h2>
                  <p className="measure mt-2 leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ── Further reading ───────────────────────────────────────────── */}
        <Reveal delay={120}>
          <div className="mt-12">
            <p className="eyebrow">{relatedReadingLabel}</p>
            <Link href={relatedHref} className="btn-fx link-wipe mt-3 inline-block text-lg">
              {relatedArticleLabel}
              <span aria-hidden className="ml-2">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </Container>
    </PageMain>
  );
}
