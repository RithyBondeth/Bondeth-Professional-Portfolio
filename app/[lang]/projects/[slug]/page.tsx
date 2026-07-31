import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/section";
import { PageMain } from "@/components/ui/page-header";
import { Reveal } from "@/components/utils/animations/reveal";
import { ExternalLinkIcon } from "@/components/utils/icons";
import { projects, siteConfig } from "@/utils/constants/portfolio.constant";
import { getProjects } from "@/utils/i18n/content";
import { getDictionary, hasLocale, locales, type TLocale } from "@/utils/i18n";

interface IProjectPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

function getProject(slug: string, lang: TLocale) {
  return getProjects(lang).find(
    (project) => project.slug === slug && project.visibility !== "confidential",
  );
}

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    projects
      .filter((project) => project.visibility !== "confidential")
      .map((project) => ({ lang, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: IProjectPageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const project = getProject(slug, lang);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description,
    alternates: {
      canonical: `/${lang}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        km: `/km/projects/${slug}`,
        "x-default": `/en/projects/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      url: `/${lang}/projects/${slug}`,
      title: project.title,
      description: project.description,
      ...(project.image ? { images: [{ url: project.image }] } : {}),
    },
  };
}

export default async function ProjectPage({ params }: IProjectPageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const project = getProject(slug, lang);
  if (!project) notFound();

  const dict = getDictionary(lang);
  const visibilityLabel =
    project.visibility === "limited"
      ? dict.projects.limitedProject
      : dict.projects.publicProject;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${siteConfig.url}/${lang}/projects/${project.slug}`,
  };

  return (
    <PageMain lang={lang}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Container>
        {/* ── Head ──────────────────────────────────────────────────────── */}
        <header className="pt-32 pb-12 sm:pt-40">
          <Reveal>
            <Link
              href={`/${lang}/#projects`}
              className="btn-fx link-wipe mb-10 inline-block text-sm text-muted-foreground hover:text-foreground"
            >
              <span aria-hidden className="mr-2">
                ←
              </span>
              {dict.projects.backToProjects}
            </Link>
          </Reveal>

          <Reveal delay={40}>
            <p className="eyebrow">
              {project.category}
              {" · "}
              <span className="text-marker">{visibilityLabel}</span>
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="display-lg mt-4 text-balance">{project.title}</h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="measure mt-6 text-lg leading-relaxed text-muted-foreground">
              {project.description}
            </p>
          </Reveal>
        </header>

        {/* ── Plate ─────────────────────────────────────────────────────── */}
        <Reveal delay={180}>
          <ProjectPreview
            title={project.title}
            image={project.image}
            gradient={project.gradient}
          />
        </Reveal>

        {/* ── Confidentiality notice ────────────────────────────────────── */}
        {project.visibility === "limited" && (
          <Reveal delay={80}>
            <aside className="mt-14 border-l-2 border-marker pl-6">
              <p className="eyebrow">{dict.projects.limitedNoticeTitle}</p>
              <p className="measure mt-3 leading-relaxed text-muted-foreground">
                {dict.projects.limitedNotice}
              </p>
            </aside>
          </Reveal>
        )}

        {/* ── Fact rows ─────────────────────────────────────────────────── */}
        <dl className="mt-16 border-t border-rule">
          <Reveal>
            <div className="grid gap-x-10 gap-y-3 border-b border-rule py-8 lg:grid-cols-12">
              <dt className="eyebrow lg:col-span-3 lg:pt-1">
                <span className="numeral mr-3">01</span>
                {dict.projects.overview}
              </dt>
              <dd className="measure leading-relaxed text-foreground lg:col-span-9">
                {project.description}
              </dd>
            </div>
          </Reveal>

          <Reveal delay={70}>
            <div className="grid gap-x-10 gap-y-3 border-b border-rule py-8 lg:grid-cols-12">
              <dt className="eyebrow lg:col-span-3 lg:pt-1">
                <span className="numeral mr-3">02</span>
                {dict.projects.technologies}
              </dt>
              <dd className="lg:col-span-9">
                <p className="text-lg leading-relaxed text-foreground">
                  {project.tags.join(" · ")}
                </p>
              </dd>
            </div>
          </Reveal>

          {project.live && (
            <Reveal delay={140}>
              <div className="grid gap-x-10 gap-y-3 border-b border-rule py-8 lg:grid-cols-12">
                <dt className="eyebrow lg:col-span-3 lg:pt-1">
                  <span className="numeral mr-3">03</span>
                  {dict.projects.publicResources}
                </dt>
                <dd className="lg:col-span-9">
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-fx link-wipe inline-flex items-center gap-2 text-lg"
                  >
                    {dict.projects.liveProduct}
                    <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                </dd>
              </div>
            </Reveal>
          )}
        </dl>
      </Container>
    </PageMain>
  );
}

/**
 * The project plate.
 *
 * When there is no screenshot it prints the title on plain stock instead of
 * the old fake browser window — inventing chrome around a project that has no
 * picture claims more than the page can back up.
 */
function ProjectPreview({
  title,
  image,
}: {
  title: string;
  image: string | null;
  /** Retained for call-site compatibility; the gradient plate was removed. */
  gradient?: string;
}) {
  return (
    <figure className="relative aspect-16/10 overflow-hidden border border-rule bg-secondary">
      {image ? (
        <Image
          src={image}
          alt={`${title} preview`}
          fill
          priority
          sizes="(min-width: 1200px) 76rem, 100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="display-md text-muted-foreground">{title}</span>
        </div>
      )}
    </figure>
  );
}
