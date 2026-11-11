import { Skeleton } from "@/shared/components/ui/skeleton";

export function NewsStorySkeleton({ label }: { label?: string }) {
  return (
    <div aria-busy="true" aria-label={label}>
      <div aria-hidden className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="space-y-2 rounded-lg border border-border/75 bg-card px-4 py-3.5"
          >
            <Skeleton className="h-3 w-40 max-w-full motion-reduce:animate-none" />
            <Skeleton className="h-5 w-4/5 motion-reduce:animate-none" />
            <Skeleton className="mt-4 h-3 w-20 motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    </div>
  );
}
