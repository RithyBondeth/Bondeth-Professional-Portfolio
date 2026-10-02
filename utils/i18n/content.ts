import {
  siteConfig,
  experiences,
  educations,
  projects,
} from "@/utils/constants/portfolio.constant";
import {
  IExperience,
  IProject,
  ISiteConfig,
  IEducation,
  IProjectCaseStudy,
} from "@/utils/interfaces/portfolio";
import { kmContent } from "./content.km";
import type { TLocale } from ".";

/* ---------------------------- Localized Accessors --------------------------- */
/**
 * English lives in the base constants; Khmer overrides merge on top by index.
 */
export function getSiteConfig(lang: TLocale): ISiteConfig {
  if (lang !== "km") return siteConfig;
  return {
    ...siteConfig,
    title: kmContent.title,
    tagline: kmContent.tagline,
    bio: kmContent.bio,
  };
}

export function getExperiences(lang: TLocale): IExperience[] {
  if (lang !== "km") return experiences;
  return experiences.map((exp, i) => ({ ...exp, ...kmContent.experiences[i] }));
}

export function getEducations(lang: TLocale): IEducation[] {
  if (lang !== "km") return educations;
  return educations.map((edu, i) => ({ ...edu, ...kmContent.educations[i] }));
}

export function getProjects(lang: TLocale): IProject[] {
  if (lang !== "km") return projects;
  // Keyed by slug, not index: an untranslated project falls back to English
  // rather than silently inheriting its neighbour's copy.
  return projects.map((project) => {
    const translation: Partial<IProject> =
      kmContent.projects[project.slug as keyof typeof kmContent.projects] ?? {};

    return {
      ...project,
      ...translation,
      caseStudy: mergeCaseStudy(project.caseStudy, translation.caseStudy),
    };
  });
}

/**
 * Case studies merge field by field rather than wholesale, so a translation
 * can carry prose alone: metric values and gallery images stay with the
 * English source, and only their labels, alt text, and captions are
 * overridden by index. A section the translation skips falls back to English.
 */
function mergeCaseStudy(
  source: IProjectCaseStudy | undefined,
  translation: Partial<IProjectCaseStudy> | undefined,
): IProjectCaseStudy | undefined {
  if (!source || !translation) return source;

  return {
    ...source,
    ...translation,
    decisions: source.decisions.map((decision, index) => ({
      ...decision,
      ...translation.decisions?.[index],
    })),
    metrics: source.metrics?.map((metric, index) => ({
      ...metric,
      label: translation.metrics?.[index]?.label ?? metric.label,
    })),
    gallery: source.gallery?.map((image, index) => ({
      ...image,
      alt: translation.gallery?.[index]?.alt ?? image.alt,
      caption: translation.gallery?.[index]?.caption ?? image.caption,
    })),
  };
}
