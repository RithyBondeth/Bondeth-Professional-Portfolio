import { TProjectLinkKind } from "@/utils/types/portfolio/project-link-kind.type";

export interface IProjectLink {
  kind: TProjectLinkKind;
  url: string;
}
