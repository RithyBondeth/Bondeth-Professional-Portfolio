import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/section";
import { PageHeader, PageMain } from "@/components/ui/page-header";
import { Reveal } from "@/components/utils/animations/reveal";
import { getDictionary, hasLocale } from "@/utils/i18n";

interface ILabsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: ILabsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { labs } = getDictionary(lang);

  return {
    title: labs.heading,
    description: labs.blurb,
    alternates: {
      canonical: `/${lang}/labs`,
      languages: {
        en: "/en/labs",
        km: "/km/labs",
        "x-default": "/en/labs",
      },
    },
  };
}

/**
 * The labs index.
 *
 * Three demos, printed as numbered entries. Each used to be a wide card fronted
 * by a neon vignette — a dark navy panel with glowing emerald bars, animated on
 * scroll. They were the only surfaces on the site with their own colour scheme,
 * and they described the demos far less clearly than the demos' own titles do.
 */
export default async function LabsPage({ params }: ILabsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const { labs, sections } = dict;

  const entries = [
    {
      slug: "structured-output",
      title: labs.structuredOutputTitle,
      description: labs.structuredOutputDescription,
    },
    {
      slug: "rag-retrieval",
      title: labs.ragTitle,
      description: labs.ragDescription,
    },
    {
      slug: "llm-evals",
      title: labs.evalTitle,
      description: labs.evalDescription,
    },
  ];

  return (
    <PageMain lang={lang}>
      <PageHeader
        label={sections.now}
        title={labs.heading}
        lead={labs.blurb}
        meta={[labs.experimental, labs.costFree]}
        backHref={`/${lang}`}
        backLabel={dict.nav.backToHome}
      />

      <Container>
        <div className="border-t border-rule">
          {entries.map((entry, i) => (
            <Reveal key={entry.slug} delay={i * 70}>
              <article className="group">
                <Link
                  href={`/${lang}/labs/${entry.slug}`}
                  className="grid gap-x-10 gap-y-3 border-b border-rule py-8 outline-none focus-visible:bg-secondary lg:grid-cols-12"
                >
                  <p className="eyebrow numeral lg:col-span-3 lg:pt-2">
                    {String(i + 1).padStart(2, "0")}
                  </p>

                  <div className="lg:col-span-9">
                    <h2 className="display-sm transition-colors group-hover:text-marker">
                      {entry.title}
                    </h2>
                    <p className="measure mt-3 leading-relaxed text-muted-foreground">
                      {entry.description}
                    </p>
                    <p className="eyebrow mt-5">
                      {labs.openLab}
                      <span
                        aria-hidden
                        className="ml-2 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:transform-none"
                      >
                        →
                      </span>
                    </p>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </PageMain>
  );
}
