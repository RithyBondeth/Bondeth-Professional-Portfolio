import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/section";
import { PageHeader, PageMain } from "@/components/ui/page-header";
import { ProjectExplorer } from "@/components/projects/project-explorer";
import { getProjects } from "@/utils/i18n/content";
import { getDictionary, hasLocale } from "@/utils/i18n";

interface IProjectsPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({
  params,
}: IProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);

  return {
    title: dict.projects.allProjectsHeading,
    description: dict.projects.allProjectsBlurb,
    alternates: {
      canonical: `/${lang}/projects`,
      languages: {
        en: "/en/projects",
        km: "/km/projects",
        "x-default": "/en/projects",
      },
    },
  };
}

export default async function ProjectsPage({ params }: IProjectsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const projects = getProjects(lang);

  return (
    <PageMain lang={lang}>
      <PageHeader
        label={dict.sections.projects}
        title={dict.projects.allProjectsHeading}
        lead={dict.projects.allProjectsBlurb}
        backHref={`/${lang}`}
        backLabel={dict.nav.backToHome}
      />

      <Container>
        <ProjectExplorer projects={projects} dict={dict} lang={lang} />
      </Container>
    </PageMain>
  );
}
