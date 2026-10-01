export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function isMotionReduced() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function applyPreference() {
  document.documentElement.dataset.motion = isMotionReduced() ? "quiet" : "full";
}

export function subscribeToMotionPreference(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  const update = () => { applyPreference(); onChange(); };
  media.addEventListener("change", update);
  applyPreference();
  return () => {
    media.removeEventListener("change", update);
  };
}
