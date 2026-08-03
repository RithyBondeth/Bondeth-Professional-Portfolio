/**
 * The platform a project runs on — and only that.
 *
 * This used to be "Web | AI | macOS | Mobile", which mixed a platform axis with
 * a domain one. The cost was real: Apsara Talent, a Next/Nest recruitment
 * platform with no ML anywhere in its stack, sat under "AI" because that was
 * the closest available label, and the filter told visitors something untrue.
 * Domains now live on `IProject.domains`, so a project can be Web *and* AI
 * without either fact displacing the other.
 */
export type TProjectCategory = "Web" | "macOS" | "Mobile";

/**
 * Production work versus things built to learn. Practice work still belongs on
 * the site — it shows range and progression — but shown as a peer of a national
 * government platform it drags that work down rather than lifting itself up.
 */
export type TProjectTier = "production" | "practice";
