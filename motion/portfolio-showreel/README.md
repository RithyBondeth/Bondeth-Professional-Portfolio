# Portfolio showreel

The homepage uses the v7 showreel: 30 seconds, 1920 × 1080, native 120 fps. Its
story follows Who I am → What I do → Technologies I use → Proof in Projects,
then shows Apsara Talent, Apsara Assistant, Apsara Agentic, Apsara Elearning,
Apsara Wallet, Romlerk, and Bondex Notch. The opening uses the portrait in
`portrait-v7.png`; the project frames use the images in
`../../public/project-preview/`. Eighteen technology marks animate in, and
moving lines and alternating reveals carry the seven previews. Paper, ink,
coral, Ubuntu, and JetBrains Mono match the site. The score is original and
instrumental, with English and Khmer captions.

## Current source and website assets

- `edit-v7.js`: editable Higgsedit timeline.
- `prepare-v7.py`: copies local previews and prepares the technology marks.
- `soundtrack-v7.py`: generates the cue aligned to the seven projects.
- `portrait-v7.png`: transparent source portrait supplied for this cut.
- `portfolio-showreel-v7-source.zip`: complete native project and inputs.
- `../../public/videos/portfolio-showreel-v7.mp4`: optimized H.264/AAC export.
- `../../public/videos/portfolio-showreel-v7.en.vtt` and `.km.vtt`: captions.
- `../../public/thumbnails/portfolio-showreel-v7-poster.png`: homepage poster.

To render from the source archive, extract it into a separate directory and run
`higgsedit render . --out renders/master.mp4 --quality final`. To rebuild
the editable timeline, run `higgsedit build edit-v7.js` in the extracted
project. From the repository, run `python3 prepare-v7.py` to recopy the
project previews and icon artwork before rebuilding.

The homepage uses click-to-play controls with `preload="none"`. A 120 Hz display
can show every frame; lower-refresh displays play the same video but cannot
display every distinct frame.

## Archived versions

Earlier source projects remain available for reference and rebuilding. Their
obsolete website MP4s, captions, and posters are intentionally not shipped.

- `portfolio-showreel-v6-source.zip` — 30-second, 120 fps six-project cut.
- `portfolio-showreel-v5-source.zip` — 30-second, 120 fps four-chapter cut.
- `portfolio-showreel-v4-source.zip` — 30-second, 120 fps dark-tech cut.
- `portfolio-showreel-v3-source.zip` — 36-second, 60 fps cut.
- `portfolio-intro-v2-source.zip` — 32-second, 30 fps background-and-skills cut.
- `portfolio-showreel-source.zip` — original 24-second, 30 fps cut.

Extract an archive into its own directory to inspect or rebuild that version.
