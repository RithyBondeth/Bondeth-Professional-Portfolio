import {
  TProjectCategory,
  TProjectTier,
} from "@/utils/types/portfolio/project-category.type";
import { IProjectLink } from "./project-link.interface";

export type TProjectVisibility = "public" | "limited" | "confidential";

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
  /**
   * What the work actually achieved — users reached, volume handled, a number
   * that moved, a decision it unblocked. One short line each.
   *
   * Deliberately left empty rather than filled with plausible-sounding figures:
   * these are the claims an interviewer checks, and an invented one is worse
   * than an absent one. The section renders only when this has entries, so a
   * project with nothing measurable to report simply doesn't show it.
   */
  outcomes?: string[] | null;
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
  /**
   * Screenshot path. Always known — whether it is *shown* is a separate,
   * visibility-level decision, which is why this is required rather than
   * nullable. A confidential project still has a screenshot on disk; the card
   * just doesn't render it.
   */
  image: string;
  /**
   * Tailwind gradient for the card plate when the screenshot is withheld.
   *
   * Reads as dead data at a glance — nothing uses it today, because there are
   * currently no confidential projects. It is the paired half of
   * `visibility: "confidential"`: that state deliberately hides the screenshot,
   * and this is what the card shows instead. Delete the two together or not at
   * all.
   */
  gradient: string;
}
