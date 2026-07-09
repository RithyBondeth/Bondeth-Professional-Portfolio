import { TProjectCategory } from "@/utils/types/portfolio/project-category.type";

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
  /** URL to a public repository, or null for private/closed-source projects */
  github: string | null;
  live: string | null;
  /** URL to a screenshot/preview image */
  image: string | null;
  /** Tailwind gradient classes used as a fallback when image is null */
  gradient: string;
}
