import {
  AppleIcon,
  DownloadIcon,
  ExternalLinkIcon,
  GitHubIcon,
  YouTubeIcon,
} from "@/shared/components/icons/icons";
import type { ProjectLinkKind } from "@/features/portfolio/domain";

/** One icon per link kind, so a download never wears the "opens a tab" arrow. */
export function ProjectLinkIcon(props: {
  kind: ProjectLinkKind;
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
    case "video":
      return <YouTubeIcon className={className} />;
    default:
      return <ExternalLinkIcon className={className} />;
  }
}
