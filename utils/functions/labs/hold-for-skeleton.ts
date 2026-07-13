/**
 * The labs run on a deterministic local endpoint that returns almost instantly,
 * so a real loading state would only flash. To make the skeleton perceptible —
 * and to make the demos feel like genuine async work — hold the loading state
 * for a minimum duration measured from when the request started.
 */
export const MIN_LOADING_MS = 700;

export async function holdForSkeleton(startedAt: number): Promise<void> {
  const remaining = MIN_LOADING_MS - (performance.now() - startedAt);
  if (remaining > 0) {
    await new Promise((resolve) => setTimeout(resolve, remaining));
  }
}
