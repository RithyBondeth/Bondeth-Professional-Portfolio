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
  return projects.map((project, i) => ({
    ...project,
    ...kmContent.projects[i],
  }));
}
