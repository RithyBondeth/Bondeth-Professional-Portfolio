/**
 * Lightweight in-memory fixed-window rate limiter.
 *
 * No external dependencies: it keeps a per-key counter in module memory.
 * On serverless (Vercel) each instance has its own memory, so this is a
 * best-effort throttle — enough to stop a single client hammering an
 * endpoint in a loop, not a distributed guarantee. Swap in a shared store
 * (e.g. Upstash Redis) if you need strict cross-instance limits.
 */

interface IWindow {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, IWindow>();

export interface IRateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets. Present when `allowed` is false. */
  retryAfter: number;
}

/**
 * Records a hit for `key` and reports whether it is within the allowed
 * `limit` per `windowMs`. Expired windows are reset lazily on access.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): IRateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    // Sweep expired windows before adding a new one so the map, which is
    // process-lifetime, cannot grow without bound on long-lived instances.
    if (buckets.size > 5000) {
      for (const [bucketKey, window] of buckets) {
        if (now >= window.resetAt) buckets.delete(bucketKey);
      }
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { allowed: true, retryAfter: 0 };
}

/**
 * Derives a stable client identifier from proxy headers. Vercel populates
 * `x-forwarded-for` with the real client IP as the first entry.
 */
export function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
