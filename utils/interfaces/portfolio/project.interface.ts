import { TProjectCategory } from "@/utils/types/portfolio/project-category.type";
import { IProjectLink } from "./project-link.interface";

export type TProjectVisibility = "public" | "limited" | "confidential";

export interface IProject {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category: TProjectCategory;
  /**
   * public: normal public project profile
   * limited: public-information-only profile with a confidentiality notice
   * confidential: card only; no detail route is generated
   */
  visibility: TProjectVisibility;
  /**
   * Everywhere this project can be reached, most important first — the head of
   * the list is the card's primary call to action.
   *
   * A native app's landing page belongs here as `site`, not as a separate
   * project: the category describes the artifact, the links describe how you
   * reach it. Empty for projects with no public surface at all.
   */
  links: IProjectLink[];
  /** URL to a screenshot/preview image */
  image: string | null;
  /** Tailwind gradient classes used as a fallback when image is null */
  gradient: string;
}
