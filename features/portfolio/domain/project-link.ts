import type { ProjectLinkKind } from "@/features/portfolio/domain/project-link-kind";

export interface ProjectLink {
  kind: ProjectLinkKind;
  url: string;
}
