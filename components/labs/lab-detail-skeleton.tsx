import { Skeleton } from "@/components/ui/skeleton";

/**
 * Shared loading UI for the individual lab pages (structured-output,
 * rag-retrieval, llm-evals). They all share the same shell — back link,
 * badge row, title, intro, the interactive panel, then a three-up steps
 * grid — so the three `loading.tsx` files render this one skeleton.
 */
export function LabDetailSkeleton({ label }: { label: string }) {
  return (
    <main
      aria-busy="true"
      aria-label={label}
      className="flex-1 bg-background px-6 pb-24 pt-32 font-sans"
    >
      <div className="mx-auto max-w-6xl">
        {/* Back link */}
        <Skeleton className="h-4 w-28" />

        {/* Badge row */}
        <div className="mt-5 flex gap-2">
          <Skeleton className="h-6 w-28 rounded" />
          <Skeleton className="h-6 w-20 rounded" />
        </div>

        {/* Title + intro */}
        <Skeleton className="mt-5 h-11 w-80 max-w-full" />
        <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
        <Skeleton className="mt-2 h-4 w-3/4 max-w-xl" />

        {/* Interactive panel */}
        <Skeleton className="mt-10 h-80 w-full rounded" />

        {/* Steps grid */}
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded border border-border/60 bg-card p-5">
              <Skeleton className="h-3 w-6" />
              <Skeleton className="mt-3 h-4 w-2/3" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
