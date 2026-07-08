/* --------------------------------- Method ---------------------------------- */
/** Average adult silent reading speed for technical prose. */
const WORDS_PER_MINUTE = 200;

/**
 * Estimates how many minutes a post takes to read from its raw MDX content.
 *
 * @param content - The post body (markdown/MDX source)
 * @returns Reading time in whole minutes, never less than 1
 */
export function getReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
