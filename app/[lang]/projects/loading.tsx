import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading UI for the projects index. Mirrors projects/page.tsx: heading block,
 * filter bar, and the responsive project card grid.
 */
export default function ProjectsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading projects"
      className="flex-1 bg-background px-6 pb-24 pt-32 font-sans"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading block */}
        <Skeleton className="h-3 w-32" />
        <Skeleton className="mt-4 h-11 w-64 max-w-full" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-4 w-2/3 max-w-md" />

        {/* Filter bar */}
        <div className="mt-10 flex w-fit max-w-full gap-1 rounded border border-border/40 bg-card/50 p-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded" />
          ))}
        </div>

        {/* Project card grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded border border-border/60 bg-card"
            >
              <Skeleton className="aspect-16/10 w-full rounded-none" />
              <div className="p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Skeleton className="h-5 w-14 rounded" />
                  <Skeleton className="h-5 w-16 rounded" />
                  <Skeleton className="h-5 w-12 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
