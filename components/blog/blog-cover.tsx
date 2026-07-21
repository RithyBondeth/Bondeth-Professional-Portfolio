import Image from "next/image";
import { cn } from "@/lib/utils";
import type { IPost } from "@/utils/interfaces/blog/blog.interface";

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
 * Cover plate for a post card.
 *
 * When a post ships no `cover` image we generate one. This plate is treated as
 * an *object* — like a book cover — so it stays dark in both themes rather than
 * inverting, exactly like the hero's `profile.ts` editor window. That gives the
 * blog a row of rich, consistent plates instead of the washed-out dots-on-white
 * a theme-aware version produced in light mode.
 *
 * The composition is a single confident wordmark (the post's lead topic) lit
 * from a per-post angle, with a giant faint serif monogram behind it for depth
 * and a grain layer for tactility. Type is sized in container-query units, so
 * the one component reads correctly at every scale it's used — the ~280px
 * related-post card, the ~440px list card, and the ~768px detail cover.
 *
 * Earlier passes failed two different ways: the very first plate ruled the one
 * surface on an otherwise dot-stippled site in a foreign line *grid*; the pass
 * after it over-corrected into something flat and quiet. This one keeps a real
 * focal point (the wordmark), one depth layer (the monogram), and atmosphere
 * (gradient + directional glow + grain) — and nothing else.
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
        <div className="absolute inset-0 overflow-hidden bg-[#07090e] [container-type:size]">
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
              background: `radial-gradient(58% 65% at ${glowX}% ${glowY}%, rgb(255 255 255 / 0.12), transparent 68%)`,
            }}
          />
          {/* Giant monogram — the depth layer. Serif, so it plays against the
              monospace wordmark; sized off the plate height and bled off the
              right edge so it reads as texture, not a letter to be read. */}
          <span
            aria-hidden
            className="pointer-events-none absolute -right-[6%] top-1/2 -translate-y-1/2 select-none font-sans font-bold leading-none text-white/[0.05]"
            style={{ fontSize: "clamp(7rem, 74cqh, 26rem)" }}
          >
            {monogram}
          </span>
          {/* Grain — pulls the flat gradient toward a physical, printed feel. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-screen"
          />
          {/* Hairline top edge catching the light. */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />

          {/* Foreground */}
          <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
            <span className="font-code text-[11px] uppercase tracking-[0.3em] text-white/40">
              ~/blog
            </span>
            <p
              className="font-code font-bold uppercase leading-[0.9] tracking-tight text-white/90"
              style={{ fontSize: "clamp(1.6rem, 15cqw, 4rem)" }}
            >
              <span className="mr-[0.15em] text-white/30">#</span>
              {topic}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
