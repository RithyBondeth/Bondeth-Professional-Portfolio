type TSplitGranularity = "lines" | "words" | "chars";

interface ISplitRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div" | "span";
  type?: TSplitGranularity;
  delay?: number;
  duration?: number;
  stagger?: number;
  ease?: string;
  start?: string;
  once?: boolean;
  scrub?: boolean;
}

/**
 * A server-rendered heading reveal: the heading rises out of a mask as it
 * scrolls in. CSS view timelines scrub it where supported, RevealFallback
 * covers the rest, and reduced motion receives the readable heading at once.
 */
export function SplitReveal({
  children,
  className,
  as: Tag = "div",
}: ISplitRevealProps) {
  return <Tag className={`reveal-heading ${className ?? ""}`}>{children}</Tag>;
}
