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
- **Dark and light themes,** GSAP scroll animations, and WebGL shader backgrounds, all with reduced-motion fallbacks.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router, React Server Components), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui, Base UI |
| Content | MDX (next-mdx-remote, gray-matter, remark-gfm, rehype-pretty-code, Shiki) |
| Animation | GSAP, Paper Design shaders, d3-geo globe |
| AI | Groq (chatbot and labs) |
| Email | Resend |
| Analytics and hosting | Vercel Analytics, Speed Insights, Vercel |

## Getting Started

### Prerequisites

- Node.js and npm

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

| Variable | Purpose |
| --- | --- |
| `GROQ_API_KEY` | Chatbot and AI lab responses |
| `GROQ_CHAT_MODEL` | Optional Groq model override |
| `RESEND_API_KEY` | Contact-form email |
| `CONTACT_FROM_EMAIL` | Optional verified sender address |
| `NEXT_PUBLIC_SITE_URL` | Optional canonical URL for SEO |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on port 8888 |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run test:rag` | Test the RAG retrieval lab |
| `npm run test:motion` | Test the reduced-motion preferences |

## Project Structure

```text
Bondeth-Professional-Portfolio/
├── app/
│   ├── [lang]/          # Locale-prefixed routes (en | km): landing, blog, projects,
│   │                    # labs, resume, privacy, terms
│   ├── api/             # chat, contact, and AI lab endpoints
│   ├── feed.xml/        # RSS feed
│   ├── sitemap.ts
│   └── robots.ts
├── components/          # Landing sections, blog, labs, chatbot, mascot, command palette
├── content/blog/        # English and Khmer MDX posts
├── utils/               # Portfolio data, i18n dictionaries, blog helpers
├── public/              # Images, logos, project previews, resume PDF
└── proxy.ts             # Locale detection and redirects
```

## Content

- All portfolio data (bio, skills, experience, projects, education) lives in `utils/constants/portfolio.constant.ts`, with Khmer overrides in `utils/i18n/`.
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
