import Image from "next/image";
import { ProjectPreviewViewer } from "@/features/portfolio/components/projects/project-preview-viewer";
import artwork from "@/features/portfolio/data/project-artwork.json";
import type { Project } from "@/features/portfolio/domain";
import type { Dictionary } from "@/shared/i18n";

const projectArtwork: Partial<
  Record<string, { hero: string; features: string[] }>
> = artwork;

export function ProjectArtwork({
  project,
  dict,
}: {
  project: Project;
  dict: Dictionary;
}) {
  const kit = projectArtwork[project.slug];
  if (project.visibility !== "public" || !kit) return null;

  const base = `/project-artwork/${project.slug}`;
  const images = [
    { src: `${base}/hero.webp`, alt: kit.hero, width: 2400, height: 1350 },
    ...kit.features.map((alt, i) => ({
      src: `${base}/feature-0${i + 1}.webp`,
      alt,
      width: 1080,
      height: 1440,
    })),
  ];

  return (
    <section className="mt-14 space-y-5" aria-labelledby="project-artwork">
      <header className="border-b border-border/60 pb-4">
        <h2
          id="project-artwork"
          className="scroll-mt-32 text-3xl font-semibold tracking-tight"
        >
          {dict.projects.artwork.heading}
        </h2>
        <p className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
          {dict.projects.artwork.description}
        </p>
      </header>
      <div className="grid grid-cols-3 items-start gap-2 sm:gap-4">
        {images.map(({ src, alt, width, height }, index) => {
          const title = `${project.title} — ${alt}`;
          return (
            <figure
              key={src}
              className={`relative min-w-0 overflow-hidden rounded-xl border border-border/60 bg-card ${index === 0 ? "col-span-3" : ""}`}
              lang="en"
            >
              <Image
                src={src}
                alt={title}
                width={width}
                height={height}
                sizes={
                  index === 0
                    ? "(min-width: 1152px) 1100px, 94vw"
                    : "(min-width: 1152px) 360px, 31vw"
                }
                className="block h-auto w-full"
              />
              <ProjectPreviewViewer
                src={src}
                title={title}
                openLabel={dict.projects.openPreview}
                closeLabel={dict.projects.closePreview}
              />
            </figure>
          );
        })}
      </div>
    </section>
  );
}
