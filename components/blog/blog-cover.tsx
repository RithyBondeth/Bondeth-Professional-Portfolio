import Image from "next/image";
import { cn } from "@/lib/utils";
import type { IPost } from "@/utils/interfaces/blog";

function hashSlug(slug: string): number {
  let hash = 0;
  for (let index = 0; index < slug.length; index++) {
    hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
  }
  return hash;
}

type TCoverPost = Pick<
  IPost,
  "title" | "slug" | "excerpt" | "tags" | "cover" | "coverAlt" | "format"
>;

/** A warm editorial cover that shares the portfolio's card language. */
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
  const topic = post.tags[0] ?? "Journal";
  const number = String((hashSlug(post.slug) % 89) + 10).padStart(2, "0");

  return (
    <div
      {...rest}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-secondary/60",
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
        <div className="@container absolute inset-0 overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-[8%] -top-[30%] size-[65%] rounded-full bg-primary/12 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-[45%] -left-[10%] size-[70%] rounded-full bg-primary/8 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-noise opacity-[0.035]"
          />

          <div className="relative flex h-full flex-col justify-between p-[6cqw]">
            <div className="flex items-center justify-between gap-4">
              <p
                className={`rounded-full px-3 py-1 text-[clamp(0.6rem,2.1cqw,0.75rem)] font-semibold ${
                  isNote
                    ? "bg-accent-note/12 text-accent-note"
                    : "bg-primary/10 text-primary"
                }`}
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {isNote ? "Note" : "Article"} · {topic}
              </p>
              <span
                aria-hidden
                className="text-[clamp(1rem,4.5cqw,2rem)] font-bold text-foreground/10"
              >
                {number}
              </span>
            </div>

            <div className="max-w-[88%]">
              <p
                className="line-clamp-2 text-[clamp(0.9rem,4.1cqw,1.65rem)] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {post.title}
              </p>
              <p
                className="mt-[0.8em] hidden max-w-[92%] text-[clamp(0.58rem,2.2cqw,0.85rem)] leading-relaxed text-muted-foreground @[340px]:line-clamp-2 @[340px]:block"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {post.excerpt}
              </p>
            </div>

            <div aria-hidden className="flex items-center gap-1.5">
              <span
                className={`h-1.5 w-8 rounded-full ${isNote ? "bg-accent-note" : "bg-primary"}`}
              />
              <span className="size-1.5 rounded-full bg-foreground/20" />
              <span className="size-1.5 rounded-full bg-foreground/10" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
