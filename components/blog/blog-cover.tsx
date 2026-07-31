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

/* --------------------------------- Component -------------------------------- */
type TCoverPost = Pick<IPost, "title" | "slug" | "tags" | "cover" | "coverAlt">;

/**
 * Cover plate for a post.
 *
 * When a post ships no `cover` image we set one instead of faking a
 * photograph: the lead topic in display type over the paper stock, with a
 * giant tinted monogram behind it for depth and a hairline frame. It is the
 * same two-colour system as the rest of the site, so a column of plates reads
 * as a set of title pages rather than a row of stock imagery.
 *
 * The previous version was a near-black slab with a neon glow, a noise layer
 * and a `~/blog` terminal prompt — an object deliberately held outside the
 * theme. On paper stock it read as a hole punched in the page.
 *
 * Type is sized in container-query units so one component works at every scale
 * it's used: the ~80px related-post thumbnail, the ~128px list row, and the
 * full-width detail cover. The per-post seed only shifts the monogram, which
 * keeps a column of plates from tiling.
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
  const topic = post.tags[0] ?? "post";
  const monogram = topic.charAt(0).toUpperCase();

  // Per-post lighting: nudge the glow around the upper half so a column of
  // plates each catches the light from its own angle instead of tiling.
  const seed = hashSlug(post.slug);
  const glowX = 22 + (seed % 56); // 22% → 78%
  const glowY = 6 + ((seed >> 5) % 30); // 6% → 36%

  return (
    <div
      {...rest}
      className={cn(
        "relative overflow-hidden border border-rule bg-secondary",
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
        <div className="absolute inset-0 overflow-hidden bg-secondary [container-type:size]">
          {/* Depth layer: an oversized monogram in the display face, bled off
              the right edge so it reads as texture rather than a letter. The
              per-post offset stops a column of plates from tiling. */}
          <span
            aria-hidden
            className="pointer-events-none absolute select-none leading-none text-foreground/[0.07]"
            style={{
              fontFamily: "var(--font-display), ui-serif, Georgia, serif",
              fontSize: "clamp(5rem, 90cqh, 26rem)",
              right: `${-8 + (glowX % 10)}%`,
              top: `${38 + (glowY % 16)}%`,
              transform: "translateY(-50%)",
            }}
          >
            {monogram}
          </span>

          {/* Foreground: the topic, set as a title. `clamp` keeps it legible in
              the 80px thumbnail without overwhelming the full-width cover. */}
          <div className="relative flex h-full flex-col justify-end p-[6cqw]">
            <p
              className="leading-[0.95] text-foreground"
              style={{
                fontFamily: "var(--font-display), ui-serif, Georgia, serif",
                fontSize: "clamp(0.8rem, 13cqw, 3.5rem)",
              }}
            >
              {topic}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
