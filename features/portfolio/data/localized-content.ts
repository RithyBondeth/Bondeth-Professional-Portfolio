import {
  siteConfig,
  experiences,
  educations,
  projects,
  recognitions,
} from "@/features/portfolio/data/portfolio";
import type {
  Experience,
  Project,
  SiteConfig,
  Education,
  ProjectCaseStudy,
  Recognition,
  RecognitionImage,
} from "@/features/portfolio/domain";
import { kmContent } from "@/features/portfolio/data/localized-content.km";
import { getProjectResources } from "@/features/portfolio/data/project-resources";
import { projectNotes } from "@/features/portfolio/data/project-notes";
import type { Locale } from "@/shared/i18n";

/**
 * English lives in the base constants; Khmer overrides merge on top by index.
 */
export function getSiteConfig(lang: Locale): SiteConfig {
  if (lang !== "km") return siteConfig;
  return {
    ...siteConfig,
    title: kmContent.title,
    tagline: kmContent.tagline,
    bio: kmContent.bio,
  };
}

export function getExperiences(lang: Locale): Experience[] {
  if (lang !== "km") return experiences;
  return experiences.map((exp, i) => ({ ...exp, ...kmContent.experiences[i] }));
}

export function getEducations(lang: Locale): Education[] {
  if (lang !== "km") return educations;
  return educations.map((edu, i) => ({ ...edu, ...kmContent.educations[i] }));
}

/**
 * Khmer fields sit on each entry and are optional, so every one falls back to
 * the English copy rather than rendering empty on /km.
 */
export function getRecognitions(lang: Locale): Recognition[] {
  if (lang !== "km") return recognitions;

  const localizeImage = (image: RecognitionImage): RecognitionImage => ({
    ...image,
    alt: image.altKm ?? image.alt,
  });

  return recognitions.map((item) => ({
    ...item,
    title: item.titleKm ?? item.title,
    issuer: item.issuerKm ?? item.issuer,
    dateLabel: item.dateLabelKm ?? item.dateLabel,
    location: item.locationKm ?? item.location,
    description: item.descriptionKm ?? item.description,
    metric: item.metric && {
      ...item.metric,
      value: item.metric.valueKm ?? item.metric.value,
      label: item.metric.labelKm ?? item.metric.label,
    },
    cover: localizeImage(item.cover),
    certificate: localizeImage(item.certificate),
    photos: item.photos.map(localizeImage),
  }));
}

export function getProjects(lang: Locale): Project[] {
  // Keyed by slug, not index: an untranslated project falls back to English
  // rather than silently inheriting its neighbour's copy.
  return projects.map((project) => {
    const translation: Partial<Project> =
      lang === "km"
        ? (kmContent.projects[
            project.slug as keyof typeof kmContent.projects
          ] ?? {})
        : {};

    const original = mergeCaseStudy(project.caseStudy, translation.caseStudy);

    return {
      ...project,
      ...translation,
      links: getProjectResources(project),
      caseStudy: original
        ? {
            ...original,
            language: lang === "km" && !translation.caseStudy ? "en" : lang,
          }
        : projectNotes[project.slug]?.[lang],
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
  source: ProjectCaseStudy | undefined,
  translation: Partial<ProjectCaseStudy> | undefined,
): ProjectCaseStudy | undefined {
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
