import Image from "next/image";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/utils/icons/logo";
import type { IPost } from "@/utils/interfaces/blog/blog.interface";

/* ------------------------------- Accent logic ------------------------------- */
/* AI-flavoured posts pick up the violet accent; everything else stays cyan, so
   the blog reads as two colour families at a glance. */
const AI_TAGS = new Set([
  "ai",
  "llm",
  "llms",
  "rag",
  "machine learning",
  "ml",
  "openai",
  "claude",
  "anthropic",
  "langchain",
  "embeddings",
  "vector search",
  "nlp",
  "pytorch",
  "tensorflow",
  "hugging face",
  "agents",
  "prompt engineering",
]);

function pickAccent(tags: string[]): string {
  return tags.some((t) => AI_TAGS.has(t.toLowerCase())) ? "#8b5cf6" : "#22d3ee";
}

/* --------------------------------- Component -------------------------------- */
type TCoverPost = Pick<IPost, "title" | "slug" | "tags" | "cover" | "coverAlt">;

export function BlogCover({
  post,
  className,
  priority = false,
}: {
  post: TCoverPost;
  className?: string;
  priority?: boolean;
}) {
  const accent = pickAccent(post.tags);
  const bigWord = (post.tags[0] ?? "post").toUpperCase();
  const isSvg = post.cover?.toLowerCase().endsWith(".svg");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-border bg-[#060d1f]",
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
        <>
          {/* Terminal grid backdrop */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />
          {/* Accent glow */}
          <div
            aria-hidden
            className="absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-20 blur-3xl"
            style={{ background: accent }}
          />

          <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
            {/* Window chrome */}
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-3 truncate font-code text-[10px] text-muted-foreground">
                ~/blog/{post.slug}.mdx
              </span>
            </div>

            {/* Prompt + hero keyword */}
            <div>
              <p className="mb-1 font-code text-[11px]" style={{ color: accent }}>
                <span className="text-muted-foreground">$</span> cat {post.slug}
                .mdx
              </p>
              <p className="truncate font-code text-3xl font-black tracking-tight text-foreground/90 sm:text-5xl">
                {bigWord}
              </p>
            </div>

            {/* Tag chips + brand mark */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap gap-1.5">
                {post.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="rounded border px-2 py-0.5 font-code text-[10px]"
                    style={{
                      color: accent,
                      borderColor: `${accent}33`,
                      backgroundColor: `${accent}0d`,
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <Logo className="shrink-0 text-sm opacity-80" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
