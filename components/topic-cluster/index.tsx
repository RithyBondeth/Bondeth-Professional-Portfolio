import Link from "next/link";
import {
  Boxes,
  FileText,
  FlaskConical,
  Play,
  StickyNote,
} from "lucide-react";
import { getPostBySlug } from "@/utils/functions/blog";
import { videos } from "@/utils/constants/portfolio.constant";
import { getDictionary, type TLocale, type TDictionary } from "@/utils/i18n";

/** Which formats a topic can exist in. Doubles as the card's eyebrow label. */
type TFormat = "note" | "post" | "lab" | "video" | "project";

interface ITopicClusterProps {
  lang: TLocale;
  /** The format the reader is already looking at — omitted from the strip. */
  current: TFormat;
  /**
   * Slug of the note that anchors this topic. The note's frontmatter declares
   * the article, lab, and video, so every surface can hand over one slug and
   * get the whole cluster back — no caller repeats the map.
   */
  hubSlug?: string | null;
  /**
   * Direct links, for surfaces that aren't anchored by a note — a project
   * points at the post and lab covering its techniques without a note existing
   * for that topic at all.
   */
  relatedPostSlug?: string | null;
  relatedLabPath?: string | null;
}

/** Lab paths are stable ids, so their titles come from the dictionary. */
function labTitle(path: string, dict: TDictionary): string | null {
  if (path.endsWith("/rag-retrieval")) return dict.labs.ragTitle;
  if (path.endsWith("/structured-output"))
    return dict.labs.structuredOutputTitle;
  if (path.endsWith("/llm-evals")) return dict.labs.evalTitle;
  return null;
}

/**
 * "This topic, in every format" — the strip that ties a 60-second note to the
 * long-form article, the runnable lab, and the video covering the same ground.
 *
 * Renders nothing when a topic only exists in one place, so it never shows up
 * as an empty shell on a standalone post.
 */
export async function TopicCluster(props: ITopicClusterProps) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang, current, hubSlug, relatedPostSlug, relatedLabPath } = props;
  const dict = getDictionary(lang);
  const { cluster } = dict;

  const hub = hubSlug ? await getPostBySlug(hubSlug, lang) : null;
  if (!hub && !relatedPostSlug && !relatedLabPath) return null;

  /* --------------------------------- Resolve -------------------------------- */
  // Each entry is resolved from its own source of truth so a renamed post or a
  // deleted lab drops out of the strip instead of rendering a dead link.
  const entries: { format: TFormat; href: string; title: string }[] = [];

  const postSlug = hub?.relatedPost ?? relatedPostSlug;
  const labPath = hub?.relatedLab ?? relatedLabPath;
  const videoId = hub?.relatedVideo;

  if (hub && current !== "note") {
    entries.push({
      format: "note",
      href: `/${lang}/blog/${hub.slug}`,
      title: hub.title,
    });
  }

  if (postSlug && current !== "post") {
    const article = await getPostBySlug(postSlug, lang);
    if (article) {
      entries.push({
        format: "post",
        href: `/${lang}/blog/${article.slug}`,
        title: article.title,
      });
    }
  }

  if (labPath && current !== "lab") {
    const title = labTitle(labPath, dict);
    if (title) {
      entries.push({ format: "lab", href: `/${lang}${labPath}`, title });
    }
  }

  if (videoId && current !== "video") {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      entries.push({
        format: "video",
        href: `https://www.youtube.com/watch?v=${video.id}`,
        title: lang === "km" ? (video.titleKm ?? video.title) : video.title,
      });
    }
  }

  if (entries.length === 0) return null;

  /* -------------------------------- Render UI ------------------------------- */
  const icons = {
    note: StickyNote,
    post: FileText,
    lab: FlaskConical,
    video: Play,
    project: Boxes,
  } as const;

  return (
    <aside className="mt-12 rounded-lg border border-primary/20 bg-primary/5 p-5 sm:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        {cluster.heading}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {cluster.blurb}
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {entries.map((entry) => {
          const Icon = icons[entry.format];
          const external = entry.format === "video";

          const inner = (
            <>
              <Icon
                aria-hidden
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-wider text-primary">
                  {cluster.formats[entry.format]}
                </span>
                <span className="mt-1 block text-sm font-medium text-foreground">
                  {entry.title}
                </span>
              </span>
            </>
          );

          const className =
            "card-interactive flex gap-3 rounded border border-border/60 bg-background/70 p-4 h-full";

          return (
            <li key={`${entry.format}-${entry.href}`}>
              {external ? (
                <a
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <Link href={entry.href} className={className}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
