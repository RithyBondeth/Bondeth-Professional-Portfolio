import { AmbientPointerGlow } from "./ambient-pointer-glow";
import { GlyphField } from "./glyph-field";

/**
 * The site's ambient background, mounted once in the root layout and fixed to
 * the viewport. Back to front:
 *
 * 1. Aurora — large soft radial lights in the brand's warm palette with a cool
 *    counterpoint, drifting on 46–64s loops and swinging slightly as the page
 *    scrolls. Radial gradients are soft by construction, so nothing needs a
 *    `filter: blur()` (which would re-rasterise every frame).
 * 2. Pointer glow — a warm light that eases after the cursor.
 * 3. Glyph field — flowing monospace characters that scramble into code under
 *    the cursor (see glyph-field.tsx).
 * 4. Grain, for a little physical texture.
 *
 * Reduced motion freezes it all into a still composition.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="ambient">
      <div className="ambient-aurora">
        <span className="ambient-blob" data-blob="1" />
        <span className="ambient-blob" data-blob="2" />
        <span className="ambient-blob" data-blob="3" />
        <span className="ambient-blob" data-blob="4" />
      </div>
      <div id="ambient-glow" className="ambient-glow" />
      <GlyphField />
      <div className="ambient-noise bg-noise" />
      <AmbientPointerGlow />
    </div>
  );
}
