import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getLabCatalog } from "@/components/labs/lab-catalog";
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

  const labCards = getLabCatalog(labs);

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
              <AnimateIn key={lab.path} from="up" delay={0.08 + index * 0.04}>
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
                        {lab.featured ?? labs.experimental}
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
                      href={`/${lang}${lab.path}`}
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
