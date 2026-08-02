import {
  AppleIcon,
  DownloadIcon,
  ExternalLinkIcon,
  GitHubIcon,
} from "@/components/utils/icons";
import type { TProjectLinkKind } from "@/utils/types/portfolio";

/** One icon per link kind, so a download never wears the "opens a tab" arrow. */
export function ProjectLinkIcon(props: {
  kind: TProjectLinkKind;
  className?: string;
}) {
  const { kind, className } = props;

  switch (kind) {
    case "download":
      return <DownloadIcon className={className} />;
    case "appstore":
      return <AppleIcon className={className} />;
    case "repo":
      return <GitHubIcon className={className} />;
    default:
      return <ExternalLinkIcon className={className} />;
  }
}
