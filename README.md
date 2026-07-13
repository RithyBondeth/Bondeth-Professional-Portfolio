# Rithy Bondeth — Portfolio

Personal portfolio and technical blog for **Rithy Bondeth**, a Full Stack Developer & AI Engineer based in Phnom Penh, Cambodia. A bilingual (English / Khmer) single-page site with a bilingual MDX blog.

🔗 **Live:** https://bondeth-professional-portfolio.vercel.app

## Tech Stack

- **[Next.js 16](https://nextjs.org)** (App Router, React Server Components)
- **React 19** + **TypeScript 5**
- **[Tailwind CSS v4](https://tailwindcss.com)** with CSS variables + `@tailwindcss/typography`
- **MDX** blog via `next-mdx-remote` + `gray-matter` + `remark-gfm`
- **[GSAP](https://gsap.com)** for scroll-driven animations
- **[Resend](https://resend.com)** for the contact form
- **[next-themes](https://github.com/pacocoursey/next-themes)** for dark/light mode
- **Vercel Analytics** + **Speed Insights**
- Custom, library-free i18n (`en` / `km`)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in RESEND_API_KEY

# 3. Run the dev server (http://localhost:8888)
npm run dev
```

### Scripts

| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server on port `8888`  |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Environment Variables

See [`.env.example`](.env.example). Only `RESEND_API_KEY` is required (for the contact form).

| Variable               | Required | Purpose                                                       |
| ---------------------- | -------- | ------------------------------------------------------------- |
| `RESEND_API_KEY`       | Yes      | Sends contact-form email via Resend                           |
| `NEXT_PUBLIC_SITE_URL` | No       | Canonical URL for SEO / sitemap / OG (falls back to Vercel)   |
| `CONTACT_FROM_EMAIL`   | No       | Verified sender address (requires a verified Resend domain)   |

## Project Structure

```
app/
  [lang]/               Locale-prefixed routes (en | km)
    page.tsx            Single-page landing (hero, about, skills, …)
    blog/               Blog index + [slug] posts (en | km)
    layout.tsx          Fonts, theme, nav, footer, command palette
    opengraph-image.tsx Dynamic OG image
  api/contact/          Contact-form POST handler (Resend)
  sitemap.ts, robots.ts, feed.xml/   SEO + RSS
components/             Landing sections, navbar, footer, command palette, animations
content/blog/           MDX blog posts (frontmatter via gray-matter)
utils/
  constants/            portfolio.constant.ts — single source of portfolio data
  i18n/                 Dictionaries + localized content (en / km)
  functions/blog/       Post loading, reading time, related posts
public/                 Images, org logos, project previews, resume PDF
proxy.ts                Locale detection + redirects
```

## Content

All portfolio data (bio, skills, experience, projects, education) lives in
[`utils/constants/portfolio.constant.ts`](utils/constants/portfolio.constant.ts).
Khmer overrides are merged on top in [`utils/i18n/content.km.ts`](utils/i18n/content.km.ts).

Blog posts are MDX files in [`content/blog/`](content/blog) with frontmatter
(`title`, `date`, `excerpt`, `tags`, optional `cover` / `coverAlt`).

## Features

- Bilingual UI (English / Khmer) with locale-aware routing
- Dark / light theme with system preference
- ⌘K command palette (navigation, theme, social links)
- MDX technical blog with reading time, related posts, and RSS feed
- Dynamic Open Graph images, JSON-LD, sitemap, and `hreflang` alternates
- GSAP scroll animations with reduced-motion fallbacks
- Contact form with server-side validation and honeypot anti-spam

## Deployment

Deployed on [Vercel](https://vercel.com). Set the environment variables above in the
project settings, then push to the default branch to trigger a build.
