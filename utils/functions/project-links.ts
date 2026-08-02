/**
 * Presentation rules for project links.
 *
 * Shared by the card and the detail page so a link is never labelled one way in
 * the grid and another way on its own page. Pure — safe to import from client
 * components.
 */

import type { IProject, IProjectLink } from "@/utils/interfaces/portfolio";
import type { TProjectLinkKind } from "@/utils/types/portfolio";
import type { TDictionary } from "@/utils/i18n";

/** The card's call to action: the first link its visibility lets us show. */
export function getPrimaryLink(project: IProject): IProjectLink | null {
  if (project.visibility === "confidential") return null;
  return project.links[0] ?? null;
}

export function getLinkLabel(
  kind: TProjectLinkKind,
  dict: TDictionary,
): string {
  return dict.projects.linkKinds[kind];
}

/**
 * Only a running web product is "live". A native app's landing page is a
 * brochure, so it gets its platform as a neutral badge instead of the green
 * pill — the badge says what the thing *is* rather than implying you can open
 * it in a tab.
 */
export function getMediaBadge(
  project: IProject,
): { label: string; live: boolean } | null {
  if (project.visibility === "confidential") return null;
  if (project.links.some((link) => link.kind === "app")) {
    return { label: "live", live: true };
  }
  if (project.category === "macOS" || project.category === "Mobile") {
    return { label: project.category, live: false };
  }
  return null;
}
