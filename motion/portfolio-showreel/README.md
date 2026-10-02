# Portfolio showreel

The homepage uses the v6 showreel: 30 seconds, 1920 × 1080, native 120 fps. Its
story follows Who I am → What I do → Technologies I use → Proof in Projects,
then shows Apsara Talent, Apsara Assistant, Apsara Agentic, Apsara Elearning,
Apsara Wallet, and Bondex Notch. The artwork uses the portfolio's paper, ink,
and coral palette, with moving ASCII fields and screenshot-filled project
frames. It has an original instrumental score and English/Khmer captions.

## Current source and website assets

- `edit-v6.js`: editable Higgsedit timeline.
- `prepare-v6.py`: prepares the portrait, case-study previews, and technology marks.
- `soundtrack-v6.py`: generates the original score.
- `portfolio-showreel-v6-source.zip`: complete native project and inputs.
- `../../public/videos/portfolio-showreel-v6.mp4`: optimized H.264/AAC export.
- `../../public/videos/portfolio-showreel-v6.en.vtt` and `.km.vtt`: captions.
- `../../public/thumbnails/portfolio-showreel-v6-poster.png`: homepage poster.

To render from the source archive, extract it into a separate directory and run
`higgsedit render . --out renders/master.mp4 --quality final`. To rebuild the
editable timeline, run `higgsedit build edit-v6.js` in the extracted project.

The homepage uses click-to-play controls with `preload="none"`. A 120 Hz display
can show every frame; lower-refresh displays play the same video but cannot
display every distinct frame.

## Archived versions

Earlier source projects remain available for reference and rebuilding. Their
obsolete website MP4s, captions, and posters are intentionally not shipped.

- `portfolio-showreel-v5-source.zip` — 30-second, 120 fps four-chapter cut.
- `portfolio-showreel-v4-source.zip` — 30-second, 120 fps dark-tech cut.
- `portfolio-showreel-v3-source.zip` — 36-second, 60 fps cut.
- `portfolio-intro-v2-source.zip` — 32-second, 30 fps background-and-skills cut.
- `portfolio-showreel-source.zip` — original 24-second, 30 fps cut.

Extract an archive into its own directory to inspect or rebuild that version.
