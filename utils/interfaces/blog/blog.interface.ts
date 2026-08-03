export interface IPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  /** Broad reader-facing category, e.g. "Tech", "Innovation", "Education". */
  category: string;
  tags: string[];
  /** Optional cover image path (e.g. "/blog/my-post.svg"). When omitted, a
   *  branded terminal-style cover is generated from the post's metadata. */
  cover?: string | null;
  /** Alt text for the cover image; falls back to the title when omitted. */
  coverAlt?: string | null;
  /**
   * How the piece reads, not what it's about.
   *
   * "note" is a ~60-second explainer, usually Khmer-first and usually a written
   * version of something that went out on the Facebook page; "article" is the
   * long-form default. This used to be a separate `/notes` section — collapsing
   * it into a field kept one writing hub instead of two near-identical ones the
   * reader had to choose between.
   */
  format?: "note" | "article" | null;
  /** Series a post belongs to, e.g. "AIIn60Seconds". */
  series?: string | null;
  /**
   * Permalink to the original social post, when the piece was published there
   * first. Rendered as "originally posted on" — this site holds the canonical
   * copy, the link is attribution.
   */
  source?: { platform: "facebook" | "youtube"; url: string } | null;
  /** Slug of the post covering the same topic at the other depth. */
  relatedPost?: string | null;
  /** Path of the lab demonstrating it, e.g. "/labs/rag-retrieval". */
  relatedLab?: string | null;
  /** YouTube id of a video covering the topic. */
  relatedVideo?: string | null;
  /** Estimated reading time in whole minutes, derived from the content. */
  readingTime: number;
  content: string;
}
