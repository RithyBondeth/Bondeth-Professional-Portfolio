import Link from "next/link";
import { Container } from "@/components/ui/section";
import { Reveal, RevealRule } from "@/components/utils/animations/reveal";
import type { TLocale } from "@/utils/i18n";

/**
 * The title block for a standalone page (projects, blog, labs, a post).
 *
 * Same anatomy as the homepage masthead at a smaller size: a running head, the
 * title in display type, a standfirst, and a hairline closing the block. The
 * back link is set above everything as a breadcrumb rather than as a button —
 * on a document, "up" is a word, not a control.
 *
 * `pt-32` clears the fixed masthead. Pages own their own bottom spacing.
 */
export function PageHeader({
  label,
  title,
  lead,
  meta,
  backHref,
  backLabel,
  children,
}: {
  /** Short running head, set in caps above the title. */
  label?: string;
  title: string;
  lead?: string;
  /** Facts printed under the rule — date, reading time, stack. */
  meta?: (string | undefined)[];
  backHref?: string;
  backLabel?: string;
  /** Anything that should sit inside the block, below the standfirst. */
  children?: React.ReactNode;
}) {
  const facts = (meta ?? []).filter(Boolean) as string[];

  return (
    <Container>
      <header className="pt-32 pb-10 sm:pt-40">
        {backHref && backLabel && (
          <Reveal>
            <Link
              href={backHref}
              className="btn-fx link-wipe mb-10 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
              <span aria-hidden className="mr-2">
                ←
              </span>
              {backLabel}
            </Link>
          </Reveal>
        )}

        {label && (
          <Reveal delay={40}>
            <p className="eyebrow">{label}</p>
          </Reveal>
        )}

        <Reveal delay={80}>
          <h1 className="display-lg mt-4 text-balance">{title}</h1>
        </Reveal>

        {lead && (
          <Reveal delay={140}>
            <p className="measure mt-6 text-lg leading-relaxed text-muted-foreground">
              {lead}
            </p>
          </Reveal>
        )}

        {children}

        <RevealRule delay={200} className="mt-10" />

        {facts.length > 0 && (
          <Reveal delay={240}>
            <p className="eyebrow mt-4">{facts.join(" · ")}</p>
          </Reveal>
        )}
      </header>
    </Container>
  );
}

/** Convenience wrapper so pages don't repeat the main element's boilerplate. */
export function PageMain({
  children,
  lang,
}: {
  children: React.ReactNode;
  /** Present for symmetry with the page components; not used for styling. */
  lang?: TLocale;
}) {
  return (
    <main id="main-content" tabIndex={-1} lang={lang} className="flex-1 pb-28">
      {children}
    </main>
  );
}
