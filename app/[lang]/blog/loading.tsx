import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading UI for the blog index. Mirrors the layout of blog/page.tsx so the
 * real content swaps in without a layout shift.
 */
export default function BlogLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading blog"
      className="flex-1 pt-32 pb-24 px-6 bg-background font-sans"
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading block */}
        <Skeleton className="h-3 w-40" />
        <Skeleton className="mt-4 h-11 w-72 max-w-full" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-4 w-2/3 max-w-md" />
        <Skeleton className="mt-6 h-3 w-32" />

        {/* Search bar */}
        <Skeleton className="mt-12 h-11 w-full rounded" />

        {/* Tag chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-20 rounded-full" />
          ))}
        </div>

        {/* Post grid */}
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="group relative">
              <Skeleton className="aspect-2/1 mb-4 w-full rounded" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="mt-3 h-5 w-11/12" />
              <Skeleton className="mt-2 h-5 w-3/4" />
              <div className="mt-3 flex flex-wrap gap-2">
                <Skeleton className="h-5 w-14 rounded" />
                <Skeleton className="h-5 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
