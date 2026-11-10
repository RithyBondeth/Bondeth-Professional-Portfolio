# Project catalog

The catalog separates a project's **collection** (why someone would browse it), **platform** (where it runs), **topics** (what it does), **status** (how mature it is), and **visibility** (what the portfolio can disclose). Assign one collection per project and use topic tags only when they help visitors find related work.

Each card uses the same pattern: a real preview, the project mark, a short description, up to six technology names, and links to the profile and primary resource. Detail pages add an overview, the problem and engineering decisions, the stack, and public resources. Document outcomes or numbers only when a source substantiates them. Public-sector profiles use published pages and do not link to internal repositories or documentation.

## Media sources

- **AskDB**: captured the local app with its bundled Chinook sample database. The small mark is from the app header, not the deployment platform's favicon.
- **Cambodia 3D Map**: captured the running project and its header mark from the source repository.
- **Bondeth Studio and Bondeth AI**: captured their landing pages from their local source builds. Their marks come from their repositories.
- **Boon Sop and Angkor Architect**: captured their public browser builds and used their repository icons.
- **Nexus-PC**: captured the landing page shipped in its repository. The mark comes from that same site.
- **VisionCare AI**: captured the home page from the local frontend. No medical images were uploaded or assessed.
- **Existing projects**: the original preview files stay in place. Card thumbnails are top-aligned crops derived from those originals, so card media fills its frame without adding side bars.
- **Logos**: use repository marks, app icons, or marks displayed on the projects' public sites. The Apple, Tesla, and Sabay marks identify the reference sites in practice builds; the projects are not affiliated with those brands.

Keep web images in `public/previews` or the existing `public/project-preview` directory, and marks in `public/project-logos`. Keep source and documentation links in `features/portfolio/data/project-resources.ts`. New short case studies belong in `project-notes.ts`; don't replace an existing longer case study with a shorter summary.

Run `npm run generate:project-thumbnails` after adding or changing a preview. The catalog serves these small WebP files directly from `public/project-thumbnails`. The generator also records image dimensions for detail and gallery previews so they can use the original aspect ratio. Thumbnail filenames include a SHA-256 content revision, and new landing captures use `<slug>-landing-<revision>.webp` with the first 12 characters of their SHA-256 digest. When replacing a landing capture, update its revision and catalog path before regenerating thumbnails. This gives changed images fresh URLs in both browser and Next.js image caches; existing original preview URLs remain unchanged. Commit the generated files with the project change. New landing-page captures use a full viewport screenshot, without cropping. Mark these projects with `previewType: "landing"` so their cards and detail pages can open the original in the full-screen viewer. Case-study gallery screenshots use the same viewer. Keep logo marks distinct from preview images; use an official standalone mark or the symbol from an official wordmark where available.

## Case-study gallery policy

Galleries contain direct browser captures of public pages, with a source URL and capture date displayed below each image. Sign-in pages are labeled as sign-in pages; installation documentation is labeled as documentation. Do not present these as evidence of authenticated product behavior.

The earlier gallery's lesson illustrations, promotional feature sections, mobile marketing mockups, and app previews without a verified capture were removed from the catalog. The original project-card preview files remain unchanged. A case study without a verified screenshot omits the gallery rather than showing an illustrative substitute. Unused original media files are retained for provenance and are not rendered in the current galleries.
