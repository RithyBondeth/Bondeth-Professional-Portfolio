import { track } from "@vercel/analytics";

/** Where the visitor was when they took the CV. */
export type TCvDownloadSource =
  | "hero"
  | "navbar"
  | "navbar-mobile"
  | "command-palette"
  | "resume-page";

/**
 * One event name, one shape, for every route to the PDF.
 *
 * The CV is the second conversion on the site after the contact form, and it
 * was the only one of the two that fired nothing. `source` is carried because
 * "people download it" and "people download it from the hero without reading
 * anything else" are different findings.
 */
export function trackCvDownload(source: TCvDownloadSource) {
  track("cv_downloaded", { source });
}
