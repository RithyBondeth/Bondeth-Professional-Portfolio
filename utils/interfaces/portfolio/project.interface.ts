import {
  TProjectCategory,
  TProjectTier,
} from "@/utils/types/portfolio/project-category.type";
import { IProjectLink } from "./project-link.interface";

export type TProjectVisibility = "public" | "limited" | "confidential";

/** One choice that shaped the build, and what it cost. */
export interface ICaseStudyDecision {
  title: string;
  body: string;
  /** What was given up. Omit rather than invent one. */
  tradeoff?: string;
}

export interface ICaseStudyMetric {
  /** Short and scannable: "3,200", "< 1s", "2 languages". */
  value: string;
  label: string;
}

export interface ICaseStudyImage {
  /** Under /public. Shared by every locale; only captions are translated. */
  src: string;
  alt: string;
  caption?: string;
}

/**
 * The long form of a flagship project: why it existed, the decisions that
 * shaped it, and what came of it. Optional and additive — a project without
 * one keeps the short overview layout, so this only goes on work that has a
 * story worth reading.
 *
 * Every field is a claim a reader may repeat in an interview, so leave a
 * section out rather than fill it with something that is not true.
 */
export interface IProjectCaseStudy {
  /** Who it is for and what was broken or missing. */
  problem: string;
  /** The hard limits the solution had to live within. */
  constraints?: string[];
  decisions: ICaseStudyDecision[];
  /** What changed because it shipped. */
  outcome?: string;
  metrics?: ICaseStudyMetric[];
  gallery?: ICaseStudyImage[];
}

export interface IProject {
  slug: string;
  title: string;
  /**
   * One-sentence hook. Used on the card *and* in the detail hero, so keep it
   * under ~170 characters and make it say what the thing is.
   */
  description: string;
  /**
   * The detail page's Overview section: what the system does, and one thing
   * about how it's built that a reader couldn't guess from the tag list.
   *
   * Separate from `description` because the detail page used to render the
   * description twice — once in the hero, once under a heading promising more.
   */
  overview?: string | null;
  /**
   * The stack, capped at roughly six entries. Listing all sixteen services an
   * app touches reads as inventory rather than authorship, and made the four
   * Apsara projects render as near-identical cards. Anything beyond the six
   * that genuinely matters belongs in `overview`, where it can be claimed.
   */
  tags: string[];
  /** Platform only — see TProjectCategory. */
  category: TProjectCategory;
  /** Problem domains: "AI", "GovTech", "Fintech". Filterable, and additive. */
  domains?: string[];
  /** Defaults to "production" when omitted. */
  tier?: TProjectTier;
  /** Year or range the work happened, e.g. "2025" or "2024–2025". */
  year?: string | null;
  /** What you personally owned, in a few words. */
  role?: string | null;
  /** Slug of a blog post about this work. */
  relatedPost?: string | null;
  /** Path of a lab that demonstrates a technique it uses. */
  relatedLab?: string | null;
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
  caseStudy?: IProjectCaseStudy;
  /** URL to a screenshot/preview image */
  image: string | null;
  /** Tailwind gradient classes used as a fallback when image is null */
  gradient: string;
}
