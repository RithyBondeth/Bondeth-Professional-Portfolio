import Image from "next/image";
import { cn } from "@/lib/utils";
import type { IPost } from "@/utils/interfaces/blog";

/* -------------------------------- Seeding --------------------------------- */
/** Cheap deterministic hash of the slug — stable across server and client, so
    the generated plate never changes between renders or hydrates mismatched. */
function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** JetBrains Mono, with the Khmer face behind it for per-glyph fallback. */
const PLATE_FONT =
  "var(--font-jetbrains), var(--font-khmer), ui-monospace, monospace";

/* --------------------------------- Component -------------------------------- */
type TCoverPost = Pick<
  IPost,
  "title" | "slug" | "excerpt" | "tags" | "cover" | "coverAlt" | "format"
>;

/**
 * Cover plate for a post card.
 *
 * When a post ships no `cover` image we generate one, and every post currently
 * takes that path — so this component *is* the look of the blog index.
 *
 * The composition mirrors the `opengraph-image` share card on purpose: the same
 * dark plate, the same `> Bondeth — <topic>` prompt line, the same title-led
 * hierarchy, the same accent rail along the bottom. A link to a post should look
 * the same whether it's seen on the index or pasted into Telegram, and having
 * one design in two places beat having two designs that drift.
 *
 * The plate is treated as an *object* — like a book cover — so it stays dark in
 * both themes rather than inverting, exactly like the hero's `profile.ts` editor
 * window. That gives the blog a row of rich, consistent plates instead of the
 * washed-out light-mode version a theme-aware plate produced.
 *
 * Type is sized in container-query units so the one component reads correctly at
 * every scale it's used — the ~280px related-post card, the ~440px list card,
 * and the ~768px detail cover. The excerpt is the first thing to go when the
 * plate is small: below 300px of width it would set at two or three unreadable
 * pixels per line, so it hides rather than shrinks.
 *
 * Notes take the indigo accent, articles the green, which is the one visual cue
 * left over from when notes were their own section.
 */
export function BlogCover({
  post,
  className,
  priority = false,
  ...rest
}: {
  post: TCoverPost;
  className?: string;
  priority?: boolean;
} & Omit<React.ComponentProps<"div">, "className">) {
  const isSvg = post.cover?.toLowerCase().endsWith(".svg");
  const isNote = post.format === "note";
  const topic = post.tags[0] ?? "post";
  const accent = isNote ? "#94a2ff" : "#34d399";

  // Per-post lighting: nudge the glow around the upper half so a column of
  // plates each catches the light from its own angle instead of tiling.
  const seed = hashSlug(post.slug);
  const glowX = 22 + (seed % 56); // 22% → 78%
  const glowY = 6 + ((seed >> 5) % 30); // 6% → 36%

  return (
    <div
      {...rest}
      className={cn(
        "relative overflow-hidden rounded-lg border border-border",
        className,
      )}
    >
      {post.cover ? (
        <Image
          src={post.cover}
          alt={post.coverAlt ?? post.title}
          fill
          priority={priority}
          unoptimized={isSvg}
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
        />
      ) : (
        <div className="@container absolute inset-0 overflow-hidden bg-technical-surface-elevated">
          {/* Base — a faintly blue-lifted top fading to near-black, so the
              plate has vertical depth before anything sits on it. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(158deg, #121622 0%, #0a0d14 52%, #05070b 100%)",
            }}
          />
          {/* Directional glow — the per-post light source. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(58% 65% at ${glowX}% ${glowY}%, rgb(255 255 255 / 0.10), transparent 68%)`,
            }}
          />
          {/* Grain — pulls the flat gradient toward a physical, printed feel. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-screen"
          />

          {/* Foreground — the share-card composition.
              The family goes on each <p> rather than the wrapper: globals.css
              sets `p { font-family: var(--font-serif) }` in the base layer,
              which beats an inherited value, so a wrapper style would silently
              lose and the plate would set in Noto Serif — a book jacket, not the
              technical object this is. `--font-code` alone carries no Khmer, so
              the Khmer face sits behind it and picks up those glyphs. */}
          <div
            className="relative flex h-full flex-col justify-center overflow-hidden"
            style={{ padding: "6cqw" }}
          >
            <p
              className="flex items-center gap-[0.6em] leading-none"
              style={{
                fontFamily: PLATE_FONT,
                fontSize: "clamp(0.5rem, 2.3cqw, 0.78rem)",
                color: accent,
              }}
            >
              <span aria-hidden>&gt;</span>
              <span className="truncate">Bondeth — #{topic}</span>
            </p>

            <p
              className="mt-[0.9em] line-clamp-2 font-semibold leading-[1.3] tracking-[-0.01em] text-white/95"
              style={{
                fontFamily: PLATE_FONT,
                fontSize: "clamp(0.75rem, 3.5cqw, 1.4rem)",
              }}
            >
              {post.title}
            </p>

            {/* Hidden on the small plates, where it would be unreadable. */}
            <p
              className="mt-[0.8em] hidden leading-[1.5] text-white/50 @[340px]:line-clamp-2 @[340px]:block"
              style={{
                fontFamily: PLATE_FONT,
                fontSize: "clamp(0.55rem, 2.5cqw, 0.9rem)",
              }}
            >
              {post.excerpt}
            </p>
          </div>

          {/* Accent rail — the share card's signature edge. */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0"
            style={{ height: "1.4cqw", minHeight: "3px", background: accent }}
          />
        </div>
      )}
    </div>
  );
}
