/** The platform a project runs on. Topic tags are separate. */
export type ProjectCategory = "Web" | "macOS" | "Mobile" | "CLI";

export const PROJECT_GROUPS = [
  "ai-data",
  "products",
  "developer-tools",
  "games-3d",
  "public-sector",
  "academic",
  "practice",
] as const;

export type ProjectGroup = (typeof PROJECT_GROUPS)[number];

/** Keeps practice work separate in related-project selection and sitemap priority. */
export type ProjectTier = "production" | "practice";
