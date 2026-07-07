import { TProjectCategory } from "@/utils/types/portfolio/project-category.type";

export interface IProject {
  title: string;
  description: string;
  tags: string[];
  category: TProjectCategory;
  github: string;
  live: string | null;
  /** URL to a screenshot/preview image */
  image: string | null;
  /** Tailwind gradient classes used as a fallback when image is null */
  gradient: string;
}
