import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, ListChecks, Search, ArrowUpRight } from "lucide-react";
import { AnimateIn } from "@/components/utils/animations/animate-in";
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

export default async function LabsPage({ params }: ILabsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { labs } = getDictionary(lang);

  const labCards = [
    {
      href: `/${lang}/labs/structured-output`,
      title: labs.structuredOutputTitle,
      description: labs.structuredOutputDescription,
      icon: ListChecks,
      visual: (
        <div className="w-full max-w-64 rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
          {["72%", "88%", "64%"].map((width, index) => (
            <div
              key={width}
              className="flex items-center gap-3 border-b border-border/50 py-2.5 last:border-0"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <BadgeCheck aria-hidden className="size-3.5" />
              </span>
              <span
                className="h-2 rounded-full bg-foreground/10"
                style={{ width }}
              />
              <span className="ml-auto text-xs font-semibold text-primary">
                0{index + 1}
              </span>
            </div>
          ))}
        </div>
      ),
    },
    {
      href: `/${lang}/labs/rag-retrieval`,
      title: labs.ragTitle,
      description: labs.ragDescription,
      icon: Search,
      visual: (
        <div className="relative w-full max-w-64 space-y-2">
          {[92, 76, 48].map((score, index) => (
            <div
              key={score}
              className="rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm"
              style={{ marginInlineStart: `${index * 12}px` }}
            >
              <div className="flex items-center gap-3">
                <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-foreground/10">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${score}%` }}
                  />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      ),
    },
    {
      href: `/${lang}/labs/llm-evals`,
      title: labs.evalTitle,
      description: labs.evalDescription,
      icon: BadgeCheck,
      visual: (
        <div className="grid w-full max-w-64 grid-cols-2 gap-3">
          {[
            { score: "100%", tone: "text-primary", fill: "bg-primary/10" },
            { score: "20%", tone: "text-muted-foreground", fill: "bg-card" },
          ].map((item, index) => (
            <div
              key={item.score}
              className={`rounded-2xl border border-border/70 p-4 text-center shadow-sm ${item.fill}`}
            >
              <span className="text-xs font-medium text-muted-foreground">
                0{index + 1}
              </span>
              <p className={`mt-3 text-3xl font-bold ${item.tone}`}>
                {item.score}
              </p>
              <div className="mx-auto mt-3 flex w-fit gap-1">
                {[0, 1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className={`size-1.5 rounded-full ${dot <= (index === 0 ? 3 : 0) ? "bg-primary" : "bg-foreground/15"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 px-6 pb-16 pt-32 font-sans sm:pb-24"
    >
      <div className="mx-auto max-w-6xl">
        <AnimateIn>
          <p data-eyebrow className="text-sm font-semibold text-primary">
            {lang === "km" ? "ការពិសោធន៍អន្តរកម្ម" : "Interactive experiments"}
          </p>
          <div className="mt-4 grid items-end gap-5 md:grid-cols-[1fr_0.8fr]">
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
              {labs.heading}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-field-muted-foreground md:justify-self-end">
              {labs.blurb}
            </p>
          </div>
        </AnimateIn>

        <section className="mt-12 grid gap-5 lg:grid-cols-3">
          {labCards.map((lab, index) => {
            const Icon = lab.icon;
            return (
              <AnimateIn key={lab.href} from="up" delay={0.08 + index * 0.04}>
                <article className="card-interactive group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card">
                  <div className="relative grid min-h-56 place-items-center overflow-hidden border-b border-border/50 bg-secondary/60 p-6">
                    <div
                      aria-hidden
                      className="absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl"
                    />
                    <span className="absolute left-5 top-5 grid size-10 place-items-center rounded-xl border border-border/60 bg-card/80 text-primary shadow-sm backdrop-blur">
                      <Icon aria-hidden className="size-5" />
                    </span>
                    {lab.visual}
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                        {labs.experimental}
                      </span>
                      <span className="rounded-full bg-status-success/10 px-3 py-1 text-status-success">
                        {labs.costFree}
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-foreground">
                      {lab.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {lab.description}
                    </p>
                    <Link
                      href={lab.href}
                      className="btn-fx btn-fx-primary mt-7 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-primary-fill px-5 text-sm font-semibold text-primary-foreground"
                    >
                      {labs.openLab}
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  </div>
                </article>
              </AnimateIn>
            );
          })}
        </section>
      </div>
    </main>
  );
}
