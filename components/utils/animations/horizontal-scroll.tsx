/**
 * Native horizontal showcase. It remains swipeable and keyboard-scrollable
 * without scroll-jacking, pinning, or a ScrollTrigger hydration dependency.
 */
export function HorizontalScroll(props: {
  children: React.ReactNode;
  header?: React.ReactNode;
  trackClassName?: string;
  className?: string;
  refreshOn?: unknown;
}) {
  const { children, header, trackClassName, className } = props;

  return (
    <div className={className}>
      <div className="flex min-h-svh flex-col justify-center gap-8 py-16 sm:py-20">
        {header ? (
          <div className="mx-auto w-full max-w-6xl shrink-0 px-6">{header}</div>
        ) : null}
        <div className="overflow-hidden">
          <div
            className={[
              "flex gap-5 overflow-x-auto snap-x snap-mandatory overscroll-x-contain",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              "px-6 pb-4",
              trackClassName ?? "",
            ].join(" ")}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
