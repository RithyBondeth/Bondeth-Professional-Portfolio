import { notFound } from "next/navigation";

/**
 * Catch-all for unmatched paths under a locale (e.g. /en/junk).
 * Triggers the [lang]/not-found.tsx boundary.
 */
export default function CatchAllPage() {
  notFound();
}
