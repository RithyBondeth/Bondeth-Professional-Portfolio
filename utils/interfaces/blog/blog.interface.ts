export interface IPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  /** Optional cover image path (e.g. "/blog/my-post.svg"). When omitted, a
   *  branded terminal-style cover is generated from the post's metadata. */
  cover?: string | null;
  /** Alt text for the cover image; falls back to the title when omitted. */
  coverAlt?: string | null;
  content: string;
}
