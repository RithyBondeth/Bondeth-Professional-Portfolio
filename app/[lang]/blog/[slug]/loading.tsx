import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading UI for a single blog post. Mirrors blog/[slug]/page.tsx: back link,
 * cover, header meta, title, and the article/TOC two-column grid.
 */
export default function BlogPostLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading post"
      className="flex-1 pt-32 pb-24 px-6 bg-background font-sans"
    >
      <div className="mx-auto max-w-6xl">
        {/* Back link */}
        <Skeleton className="mb-8 h-3 w-24" />

        {/* Cover */}
        <Skeleton className="mb-8 aspect-2/1 w-full max-w-3xl rounded sm:aspect-5/2" />

        {/* Meta + title */}
        <div className="max-w-3xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-3 h-10 w-2/3" />
        </div>

        {/* Article body + TOC */}
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,768px)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-4"
                style={{ width: `${90 - (i % 4) * 12}%` }}
              />
            ))}
            <Skeleton className="mt-6 h-40 w-full rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={`b-${i}`}
                className="h-4"
                style={{ width: `${85 - (i % 3) * 15}%` }}
              />
            ))}
          </div>

          {/* TOC (desktop) */}
          <div className="hidden space-y-3 lg:block">
            <Skeleton className="h-3 w-24" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-40" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
