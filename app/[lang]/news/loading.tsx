import { NewsStorySkeleton } from "@/features/news/components/news-story-skeleton";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function NewsLoading() {
  return (
    <div aria-busy="true" aria-labelledby="news-heading">
      <Skeleton
        aria-hidden
        className="mb-6 h-[54px] w-52 rounded-xl motion-reduce:animate-none"
      />
      <NewsStorySkeleton />
    </div>
  );
}
