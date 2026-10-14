<div align="center">

# Rithy Bondeth — Portfolio

**The professional portfolio and technical blog of Rithy Bondeth, Full Stack Developer & AI Engineer, with interactive AI labs.**

[![Live Site](https://img.shields.io/badge/Live_site-bondeth.dev-0A0A0A?style=for-the-badge&logo=vercel&logoColor=white)](https://bondeth.dev)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)

</div>

---

## Overview

This is the source of [bondeth.dev](https://bondeth.dev), the personal portfolio and technical blog of **Rithy Bondeth**, a Full Stack Developer & AI Engineer based in Phnom Penh, Cambodia. The site is fully bilingual (English and Khmer). It showcases projects, experience, and writing, and includes hands-on AI labs and an AI chatbot.

## Features

- **Landing page:** hero, about, skills, experience, education, services, projects, recommendations, media, a showreel, and contact.
- **Projects** with filterable cards and detailed case studies.
- **Bilingual MDX blog** with tags, reading progress, a table of contents, syntax highlighting, sharing, related posts, and an RSS feed.
- **AI labs:** interactive demos of LLM evals, RAG retrieval, and structured output.
- **AI chatbot** powered by Groq, with a pixel-art robot mascot.
- **⌘K command palette** for navigation, theme, and social links.
- **Resume page,** plus privacy and terms pages.
- **SEO:** dynamic Open Graph images, JSON-LD, a sitemap, `hreflang` alternates, and RSS.
- **Contact form** with server-side validation and a honeypot, sent through Resend.
- **Dark and light themes,** GSAP scroll animations, and ambient backgrounds, all with reduced-motion fallbacks.

## Tech Stack

| Area                  | Technology                                                                |
| --------------------- | ------------------------------------------------------------------------- |
| Framework             | Next.js 16 (App Router, React Server Components), React 19                |
| Language              | TypeScript                                                                |
| Styling               | Tailwind CSS 4, shadcn/ui styles                                          |
| Content               | MDX (next-mdx-remote, gray-matter, remark-gfm, rehype-pretty-code, Shiki) |
| Animation             | GSAP, CSS motion, d3-geo globe                                            |
| AI                    | Groq (chatbot); deterministic local AI labs                               |
| Email                 | Resend                                                                    |
| Analytics and hosting | Vercel Analytics, Speed Insights, Vercel                                  |

## Getting Started

### Prerequisites

- Node.js 20.9 or later and npm

### Installation

```bash
git clone https://github.com/RithyBondeth/Bondeth-Professional-Portfolio.git
cd Bondeth-Professional-Portfolio
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:8888](http://localhost:8888).

### Environment Variables

| Variable               | Purpose                          |
| ---------------------- | -------------------------------- |
| `GROQ_API_KEY`         | Chatbot responses                |
| `GROQ_CHAT_MODEL`      | Optional Groq model override     |
| `RESEND_API_KEY`       | Contact-form email               |
| `CONTACT_FROM_EMAIL`   | Optional verified sender address |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical URL for SEO   |

### Scripts

| Command                    | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `npm run dev`              | Start the development server on port 8888                |
| `npm run build`            | Create a production build                                |
| `npm run start`            | Serve the production build                               |
| `npm run lint`             | Check code and architectural import boundaries           |
| `npm run typecheck`        | Check TypeScript, including unused locals and parameters |
| `npm run format`           | Format maintained source and configuration               |
| `npm run format:check`     | Verify formatting                                        |
| `npm run check:unused`     | Detect unused files, exports, and dependencies           |
| `npm test`                 | Run all regression tests                                 |
| `npm run test:rag`         | Test the RAG retrieval lab                               |
| `npm run test:motion`      | Test the reduced-motion preferences                      |
| `npm run generate:globe`   | Regenerate the globe land-dot lattice                    |
| `npm run generate:profile` | Regenerate GitHub profile SVG artwork                    |

## Project Structure

```text
Bondeth-Professional-Portfolio/
├── app/                 # Next.js routes, metadata, API adapters, global styles
├── features/            # Portfolio, blog, labs, chatbot, contact, navigation, legal
│   └── <feature>/       # Domain rules/types, data, components, server adapters
├── shared/              # Reusable UI, hooks, localization, libraries, infrastructure
├── content/blog/        # English and Khmer MDX posts
├── public/              # Website images, videos, logos, resume PDF
├── scripts/             # Repeatable asset generators
├── tests/               # Blog content, RAG retrieval, motion preferences
├── motion/              # Editable showreel sources and archived inputs
├── github-profile/      # Profile artwork and generator
├── docs/architecture.md # Dependency boundaries and naming conventions
└── proxy.ts             # Locale detection and redirects
```

See [architecture guidance](docs/architecture.md) for layer boundaries and conventions. Use npm and the committed `package-lock.json` for reproducible installs.

## Content

- All portfolio data (bio, skills, experience, projects, education) lives in `features/portfolio/data/portfolio.ts`, with Khmer overrides in `features/portfolio/data/localized-content.km.ts`.
- Blog posts are MDX files in `content/blog/`, with frontmatter for `title`, `date`, `excerpt`, `tags`, and an optional cover image.

## Deployment

The site is deployed on [Vercel](https://vercel.com). Set the environment variables in the project settings and push to `main`.

## Author

**Rithy Bondeth** — Full Stack Developer & AI Engineer

[![Portfolio](https://img.shields.io/badge/Portfolio-0A0A0A?style=for-the-badge&logo=vercel&logoColor=white)](https://bondeth.dev)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/RithyBondeth)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/rithy-bondeth-484073282/)

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
