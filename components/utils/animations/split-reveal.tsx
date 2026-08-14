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
 * A server-rendered heading reveal. CSS view timelines provide motion where
 * supported; every other browser receives the readable heading immediately.
 */
export function SplitReveal({
  children,
  className,
  as: Tag = "div",
}: ISplitRevealProps) {
  return <Tag className={`reveal-heading ${className ?? ""}`}>{children}</Tag>;
}
