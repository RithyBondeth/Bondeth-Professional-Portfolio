# Architecture

The application uses feature folders with explicit dependency boundaries. Routes compose the site, domain modules hold framework-independent rules and types, and server modules adapt filesystem and external services. Layers are added where they have a purpose; static portfolio data does not need repository classes or a dependency injection container.

```text
app/                         Next.js routes, metadata, global styles, API adapters
features/
  blog/                      MDX writing and navigation between related content
  chatbot/                   Chat UI, stream contracts, server orchestration
  contact/                   Contact email adapter
  labs/                      Deterministic AI demo rules and their presentation
  legal/                     Localized legal content and presentation
  navigation/                Navbar, footer, command palette
  portfolio/                 Portfolio domain, localized data, sections, projects
shared/
  components/                Reusable UI, mascot, backgrounds, motion, theme
  hooks/                     Shared React hooks
  i18n/                      Locale helpers and UI dictionaries
  lib/                       Browser-safe helpers and GSAP setup
  server/                    Server-only infrastructure such as rate limiting
content/blog/                English and Khmer MDX content
scripts/                     Repeatable asset generators
motion/                      Editable showreel sources and archived source inputs
public/                      Assets served by the website
```

## Dependency rules

- `app` composes features and shared modules. API route configuration remains in the route file; chat and contact handlers live with their features.
- Features can consume other features' domain metadata or server services when a use case needs them. For example, the chatbot catalogs blog posts, labs, and projects. Cross-feature dependencies should be explicit and acyclic.
- `domain` modules do not import UI components, server adapters, data sources, React, or Next.js. Type imports from shared localization contracts are allowed.
- Server adapters never import components or routes. All server modules import `server-only` so Next.js rejects accidental browser imports.
- `shared` never imports features or routes.
- Browser components import pure helpers directly, rather than importing a barrel that also exports filesystem readers.

ESLint enforces these rules for the `@/` imports used throughout this repository. Use those aliases for cross-layer imports so boundary checks apply. TypeScript also rejects unused local variables and parameters. Knip detects unreachable files, unused exports, and unused dependencies.

## Conventions

Use kebab-case file and directory names, PascalCase types and components, camelCase functions and values, and UPPER_SNAKE_CASE constants. Name component files explicitly instead of using `index.tsx`. Reserve `index.ts` for small public export surfaces. Keep related types with their feature rather than separating all interfaces and type aliases into global folders. Use `import type` for types.

Run `npm run format` to apply Prettier. Check changes with `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run check:unused`, `npm test`, and `npm run build`.

## Assets and tooling

Static URLs are independent of TypeScript module imports: check content, styles, and source preparation scripts before removing an asset. The globe generator uses Natural Earth data and emits `shared/components/ui/globe-land-dots.ts`; regenerate with `npm run generate:globe`. The GitHub profile generator runs with `npm run generate:profile`. Showreel archives and preparation scripts are maintained source assets, even though the Next.js app does not import them. Archived v6 previews live under `motion/portfolio-showreel/source-assets/v6` rather than in `public`.

npm and `package-lock.json` are the dependency source of truth. Knip explicitly includes standalone generators and showreel scripts as entry points. Its sole dependency exclusion is the Khmer Fontsource package: `app/globals.css` loads its exact WOFF2 subset through a relative `node_modules` URL that Knip cannot resolve as a package dependency.
