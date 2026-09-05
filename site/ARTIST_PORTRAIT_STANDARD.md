# Artist portrait standard

The label uses one responsive portrait stage for every artist. Original PNGs and faces are not repainted.

1. Record the cropped PNG's real `width` and `height` in the artist data.
2. Measure `headHeight` (visible crown to chin, approximately; group portraits use the average) and `headTop` in source pixels. Do not estimate scale from the whole body or empty canvas.
3. CSS gives every head the same target height: the smaller of 23% of stage height and 20% of stage width. The crown sits at 10% of stage height. Natural differences within a group remain intact.
4. Preserve the original aspect ratio. Center the artwork. Full-length and partial photographs may have different visible body lengths; the common stage fades the lower edge rather than exposing a hard cut.
5. The shared SVG filter slightly contracts and feathers alpha only. It does not blur face or clothing RGB. Do not add a white glow, opaque caption panel, or a whole-image blur.
6. Inspect hair, hands and thin props visually on dark and bright backgrounds. Large residual background patches require source cleanup, not a stronger global blur. Keep source files unchanged until a replacement is approved.
7. Test every artist at phone, tablet, desktop and 4K sizes. Check head alignment, title/button clearance and thin props. Honor the existing local-only publication boundary.

Implementation: `app/page.tsx` artist measurements + `artist-soft-contour`; `app/composition.css` `.artist-portrait`.
