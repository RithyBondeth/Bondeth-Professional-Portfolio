import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading UI for a single project. Mirrors projects/[slug]/page.tsx: header
 * (title + preview image) and the detail card sections.
 */
export default function ProjectLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading project"
      className="flex-1 bg-background px-6 pb-24 pt-32 font-sans"
    >
      <div className="mx-auto max-w-5xl">
        {/* Back link */}
        <Skeleton className="mb-8 h-3 w-28" />

        {/* Header: text + preview image */}
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="mt-5 h-12 w-full" />
            <Skeleton className="mt-3 h-12 w-2/3" />
            <Skeleton className="mt-6 h-4 w-full max-w-2xl" />
            <Skeleton className="mt-2 h-4 w-5/6 max-w-xl" />
          </div>
          <Skeleton className="aspect-[16/10] w-full rounded border border-border/60" />
        </div>

        {/* Detail cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-full rounded border border-border/60 bg-card p-6"
            >
              <Skeleton className="h-3 w-28" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-11/12" />
              <Skeleton className="mt-2 h-4 w-4/5" />
            </div>
          ))}
        </div>

        <div className="mt-6 rounded border border-border/60 bg-card p-6">
          <Skeleton className="h-3 w-28" />
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
