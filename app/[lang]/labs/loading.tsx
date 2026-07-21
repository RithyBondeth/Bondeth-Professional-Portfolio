import { Skeleton } from "@/components/ui/skeleton";

/**
 * Loading UI for the labs index. Mirrors labs/page.tsx: the terminal-style
 * heading block followed by the stack of wide, two-column lab cards.
 */
export default function LabsLoading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading labs"
      className="flex-1 bg-background px-6 pb-24 pt-32 font-sans"
    >
      <div className="mx-auto max-w-5xl">
        {/* Heading block */}
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-11 w-72 max-w-full" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-4 w-2/3 max-w-md" />

        {/* Lab cards */}
        <div className="mt-12 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded border border-border/60 bg-card"
            >
              <div className="grid md:grid-cols-[0.8fr_1.2fr]">
                {/* Vignette / preview pane */}
                <Skeleton className="min-h-56 rounded-none" />

                {/* Copy pane */}
                <div className="flex flex-col p-6 sm:p-8">
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded" />
                    <Skeleton className="h-6 w-16 rounded" />
                  </div>
                  <Skeleton className="mt-5 h-7 w-2/3" />
                  <Skeleton className="mt-4 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-5/6" />
                  <Skeleton className="mt-7 h-11 w-32 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
