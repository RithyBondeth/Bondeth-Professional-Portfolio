import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { YouTubeIcon } from "@/components/utils/icons";
import { siteConfig, videos } from "@/utils/constants/portfolio.constant";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { VideoFacade } from "./video-facade";

export default function LandingMedia(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const { media } = getDictionary(lang);

  /* ---------------------------------- Utils --------------------------------- */
  const [featured, ...rest] = videos;
  if (!featured) return null;

  // The Khmer fields are optional per video, so every read falls back to the
  // English copy rather than rendering an empty card on /km.
  const title =
    lang === "km" ? (featured.titleKm ?? featured.title) : featured.title;
  const description =
    lang === "km"
      ? (featured.descriptionKm ?? featured.description)
      : featured.description;
  const watchUrl = `https://www.youtube.com/watch?v=${featured.id}`;

  /* ------------------------------ Structured Data ---------------------------- */
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: title,
    description,
    thumbnailUrl: `${siteConfig.url}${featured.thumbnail}`,
    contentUrl: watchUrl,
    embedUrl: `https://www.youtube-nocookie.com/embed/${featured.id}`,
    ...(featured.publishedAt && { uploadDate: featured.publishedAt }),
    ...(featured.duration && { duration: featured.duration }),
    inLanguage: featured.languages,
    author: { "@type": "Person", name: siteConfig.name },
  };

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section
      id="media"
      className="relative isolate overflow-hidden px-6 py-16 sm:py-20 lg:py-24"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="max-w-2xl">
          <AnimateIn from="left" distance={40}>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
              <ScrambleText text={media.label} />
            </p>
          </AnimateIn>
          <SplitReveal
            as="h2"
            type="lines"
            className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            {media.heading}
          </SplitReveal>
          <AnimateIn from="up" delay={0.1}>
            <p className="mt-5 text-sm leading-7 text-field-muted-foreground">
              {media.blurb}
            </p>
          </AnimateIn>
        </div>

        {/* Featured Video */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <AnimateIn from="up" distance={30}>
            <VideoFacade
              video={featured}
              title={title}
              playLabel={media.playLabel}
            />
            <p className="mt-2 font-mono text-[10px] text-muted-foreground">
              {media.loadNotice}
            </p>
          </AnimateIn>

          <StaggerIn from="right" distance={24} stagger={0.08}>
            {/* Language + Topic Badges */}
            <div className="flex flex-wrap gap-2">
              {featured.languages.map((code) => (
                <span
                  key={code}
                  className="rounded border border-primary/30 bg-primary/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-primary"
                >
                  {media.languageBadge[code]}
                </span>
              ))}
              {featured.topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded border border-border/60 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {topic}
                </span>
              ))}
            </div>

            <h3 className="mt-4 text-xl font-semibold text-foreground">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>

            {/* Actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={siteConfig.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fx btn-fx-primary inline-flex min-h-11 items-center gap-2 rounded bg-primary-fill px-4 font-mono text-xs font-medium text-primary-foreground"
              >
                <YouTubeIcon aria-hidden className="size-3.5" />
                {media.subscribe}
              </a>
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded border border-border/60 px-4 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {media.watchOnYouTube}
              </a>
            </div>

            {/* Companion Blog Post */}
            {featured.relatedPost && (
              <Link
                href={`/${lang}/blog/${featured.relatedPost}`}
                className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-primary transition-opacity hover:opacity-80"
              >
                {media.readPost}
                <ArrowRight aria-hidden className="size-3.5" />
              </Link>
            )}
          </StaggerIn>
        </div>

        {/* Remaining uploads land here once the channel has more than one. */}
        {rest.length > 0 && (
          <StaggerIn
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            from="up"
            stagger={0.1}
          >
            {rest.map((video) => {
              const restTitle =
                lang === "km" ? (video.titleKm ?? video.title) : video.title;

              return (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-interactive rounded-lg border border-border/60 bg-background/70 p-5"
                >
                  <YouTubeIcon aria-hidden className="size-5 text-primary" />
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    {restTitle}
                  </h3>
                </a>
              );
            })}
          </StaggerIn>
        )}
      </div>
    </section>
  );
}
