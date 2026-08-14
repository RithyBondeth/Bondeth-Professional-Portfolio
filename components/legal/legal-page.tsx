import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import type { ILegalDocument } from "@/utils/i18n/legal";
import type { TLocale } from "@/utils/i18n";

interface ILegalPageProps {
  document: ILegalDocument;
  lang: TLocale;
}

export function LegalPage({ document, lang }: ILegalPageProps) {
  return (
    <main id="main-content" tabIndex={-1} className="flex-1 px-6 pb-20 pt-32 sm:pb-28">
      <article className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
          <Link href={`/${lang}`} className="transition-colors hover:text-primary">
            {lang === "km" ? "ទំព័រដើម" : "Home"}
          </Link>
          <ChevronRight aria-hidden className="size-3.5" />
          <span aria-current="page" className="text-foreground">
            {document.title}
          </span>
        </nav>

        <header className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/55 px-6 py-9 shadow-sm sm:px-10 sm:py-12">
          <div aria-hidden className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_80%_20%,color-mix(in_srgb,var(--primary)_15%,transparent),transparent_62%)]" />
          <div className="relative max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
              {document.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {document.title}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-field-muted-foreground sm:text-base">
              {document.intro}
            </p>
            <p className="mt-6 inline-flex rounded-full border border-border/70 bg-background/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {document.effectiveLabel}: {document.effectiveDate}
            </p>
          </div>
        </header>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <aside className="rounded-2xl border border-border/60 bg-card/35 p-5 lg:sticky lg:top-28">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {document.contentsLabel}
            </h2>
            <ol className="mt-4 space-y-2.5">
              {document.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="block text-xs leading-5 text-field-muted-foreground transition-colors hover:text-primary">
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <div className="min-w-0">
            {document.sections.map((section, index) => (
              <section key={section.id} id={section.id} className={`${index ? "mt-12 border-t border-border/55 pt-10" : ""} scroll-mt-28`}>
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {section.title}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 text-sm leading-7 text-field-muted-foreground sm:text-[15px]">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex gap-3 text-sm leading-7 text-field-muted-foreground sm:text-[15px]">
                        <span aria-hidden className="mt-[0.68rem] size-1.5 shrink-0 rounded-sm bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className="mt-14 grid gap-4 border-t border-border/60 pt-10 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-card/35 p-5">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {document.resourcesLabel}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {document.resources.map((resource) => {
                    const internal = resource.href.startsWith("/");
                    const href = internal ? `/${lang}${resource.href}` : resource.href;
                    const className = "inline-flex items-center gap-1.5 text-xs leading-5 text-field-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-primary";

                    return (
                      <li key={resource.href}>
                        {internal ? (
                          <Link href={href} className={className}>
                            {resource.label}
                          </Link>
                        ) : (
                          <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
                            {resource.label}
                            <ArrowUpRight aria-hidden className="size-3" />
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                  {document.contactLabel}
                </h2>
                <a href={`mailto:${siteConfig.email}`} className="mt-4 inline-block break-all text-sm font-medium text-foreground underline decoration-primary/40 underline-offset-4 transition-colors hover:text-primary">
                  {siteConfig.email}
                </a>
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
