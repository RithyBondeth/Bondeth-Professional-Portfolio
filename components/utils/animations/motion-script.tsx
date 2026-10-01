import { REDUCED_MOTION_QUERY } from "@/lib/motion-preference";

/** Apply the device preference before the first animated paint. */
export function MotionScript() {
  return <script dangerouslySetInnerHTML={{ __html: `(function(){document.documentElement.dataset.motion=matchMedia(${JSON.stringify(REDUCED_MOTION_QUERY)}).matches?'quiet':'full'})()` }} />;
}
