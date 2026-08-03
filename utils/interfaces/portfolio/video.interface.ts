/**
 * One published video from the YouTube channel.
 *
 * Curated by hand rather than pulled from the Data API: the list is short, the
 * Khmer titles need translating, and a build-time API call would trade an API
 * key and a quota for updates that arrive a few times a year. Revisit if the
 * channel outgrows a hand-maintained list.
 */
export interface IVideo {
  /** YouTube video id — the `LMBePWuJJJA` in a youtu.be link. */
  id: string;
  title: string;
  /** Khmer title, when the video is subtitled or narrated in Khmer. */
  titleKm?: string;
  description: string;
  descriptionKm?: string;
  /**
   * Self-hosted poster under /public/videos. Mirroring YouTube's thumbnail
   * keeps the section free of third-party requests until someone presses play.
   */
  thumbnail: string;
  /**
   * ISO date the video was published. Optional because the list is ordered by
   * hand — when it is set it also feeds `uploadDate` on the VideoObject, which
   * is what Google wants before it will show a video rich result.
   */
  publishedAt?: string;
  /** ISO 8601 duration ("PT8M14S"), the format schema.org expects. */
  duration?: string;
  /** Spoken/subtitle languages, surfaced as a badge on the card. */
  languages: ("en" | "km")[];
  topics: string[];
  /** Slug of a `content/blog` post covering the same ground, if one exists. */
  relatedPost?: string;
}
