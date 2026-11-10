import Image from "next/image";
import imageDimensions from "@/features/portfolio/data/project-image-dimensions.json";
import type { Project } from "@/features/portfolio/domain";
import { ProjectPreviewViewer } from "@/features/portfolio/components/projects/project-preview-viewer";

export function ProjectLogo({
  project,
  detail = false,
}: {
  project: Project;
  detail?: boolean;
}) {
  if (!project.logo || project.visibility === "confidential") return null;
  return (
    <span
      data-project-logo
      className={`grid shrink-0 place-items-center overflow-hidden rounded-xl border border-black/10 bg-neutral-50 dark:bg-neutral-200 ${detail ? "size-14 p-2.5 sm:size-16" : "size-11 p-1.5 sm:size-12 sm:p-2"}`}
    >
      <Image
        src={project.logo}
        alt=""
        width={48}
        height={48}
        unoptimized
        className="block size-full object-contain"
      />
    </span>
  );
}

export function ProjectMedia({
  project,
  fallback,
  detail = false,
  eager = false,
  openLabel,
  closeLabel,
}: {
  project: Project;
  fallback: string;
  detail?: boolean;
  eager?: boolean;
  openLabel: string;
  closeLabel: string;
}) {
  if (project.image && project.visibility !== "confidential") {
    return (
      <>
        {detail ? (
          <ProjectScreenshot
            src={project.image}
            alt={project.title}
            eager
            sizes="(min-width: 1024px) 460px, 90vw"
          />
        ) : (
          <Image
            src={dimensions[project.image]?.thumbnail ?? project.image}
            alt=""
            fill
            loading={eager ? "eager" : "lazy"}
            unoptimized
            className="object-cover"
            data-card-media=""
          />
        )}
        {project.previewType === "landing" && (
          <ProjectPreviewViewer
            src={project.image}
            title={project.title}
            openLabel={openLabel}
            closeLabel={closeLabel}
          />
        )}
      </>
    );
  }
  return (
    <div className="grid aspect-video place-content-center justify-items-center gap-3 bg-muted/45 text-center">
      <ProjectLogo project={project} />
      <span className="text-xs text-muted-foreground">{fallback}</span>
    </div>
  );
}

const dimensions: Record<
  string,
  { width: number; height: number; thumbnail?: string } | undefined
> = imageDimensions;

/** Use the original aspect ratio for inline screenshots; reserve crops for cards. */
export function ProjectScreenshot({
  src,
  alt,
  sizes,
  eager = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
}) {
  const size = dimensions[src];
  return (
    <Image
      src={src}
      alt={alt}
      width={size?.width ?? 1600}
      height={size?.height ?? 900}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className="block h-auto w-full"
    />
  );
}
