import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/utils/animations/reveal";

/**
 * A full-width index row: thumbnail, title, one-line standfirst, then meta.
 *
 * This replaces the card grids the site used for projects, posts and labs. A
 * grid of cards forces every item into the same square regardless of how much
 * it has to say, and at three-across the thumbnails end up too small to read
 * and the titles wrap to three lines. A list gives each item the full measure,
 * puts the titles on a single scannable left edge, and lets the eye run down
 * the column — which is how anyone actually reads an index.
 *
 * The row is one link, not a card with a link inside it, so the whole strip is
 * the hit target and there is only ever one tab stop per item.
 */
export function IndexRow({
  href,
  title,
  description,
  meta,
  image,
  imageAlt = "",
  /**
   * Printed in the thumbnail slot when there is no image, so rows without one
   * still line up with rows that have one. Usually the title's first letter.
   */
  fallbackChar,
  /** Runs above the title — a category, a status, a client. */
  kicker,
  external = false,
  delay = 0,
  className,
}: {
  href: string;
  title: string;
  description?: string;
  /** Short trailing facts: date, reading time, stack. Joined with a middot. */
  meta?: (string | undefined)[];
  image?: string;
  imageAlt?: string;
  fallbackChar?: string;
  kicker?: string;
  external?: boolean;
  delay?: number;
  className?: string;
}) {
  const facts = (meta ?? []).filter(Boolean) as string[];

  const body = (
    <>
      {(image || fallbackChar) && (
        <div className="relative flex aspect-[4/3] w-24 shrink-0 items-center justify-center overflow-hidden border border-rule bg-secondary sm:w-32">
          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="128px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:transform-none"
            />
          ) : (
            <span aria-hidden className="display-sm text-muted-foreground">
              {fallbackChar}
            </span>
          )}
        </div>
      )}

      <div className="min-w-0 flex-1">
        {kicker && <p className="eyebrow mb-2">{kicker}</p>}

        <h3 className="text-lg leading-snug text-foreground transition-colors group-hover:text-marker sm:text-xl">
          {title}
          {external && (
            <span aria-hidden className="ml-2 inline-block text-sm align-middle">
              ↗
            </span>
          )}
        </h3>

        {description && (
          <p className="measure mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}

        {facts.length > 0 && (
          <p className="eyebrow mt-3">{facts.join(" · ")}</p>
        )}
      </div>

      {/* The arrow is the only thing that moves on hover — it slides the width
          of its own gap, which reads as the row opening rather than lifting. */}
      <span
        aria-hidden
        className="hidden shrink-0 self-center text-lg text-muted-foreground transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-hover:text-foreground motion-reduce:transform-none sm:block"
      >
        →
      </span>
    </>
  );

  const rowClass = cn(
    "group flex items-start gap-5 border-b border-rule py-6 outline-none transition-colors focus-visible:bg-secondary sm:gap-7 sm:py-7",
    className,
  );

  return (
    <Reveal delay={delay}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
          {body}
        </a>
      ) : (
        <Link href={href} className={rowClass}>
          {body}
        </Link>
      )}
    </Reveal>
  );
}
