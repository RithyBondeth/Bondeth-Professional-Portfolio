"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * False during SSR and on the first client render, true from then on.
 *
 * The gate for anything that can't exist on the server — portals, `document`
 * measurements, resolved theme — where rendering it straight away would break
 * hydration. useSyncExternalStore rather than a mount effect, so the flag flips
 * as part of hydration instead of scheduling an extra render pass.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}
