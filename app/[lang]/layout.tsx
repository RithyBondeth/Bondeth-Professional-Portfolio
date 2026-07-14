import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  JetBrains_Mono,
  Kantumruy_Pro,
} from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { cn } from "@/lib/utils";
import Nav from "@/components/navbar";
import Footer from "@/components/footer";
import CommandPalette from "@/components/command-palette";
import { ThemeProvider } from "@/components/utils/theme/theme-provider";
import { SmoothScroll } from "@/components/utils/animations/smooth-scroll";
import { CustomCursor } from "@/components/utils/cursor";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { locales, hasLocale, getDictionary } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";
import { getAllPosts } from "@/utils/functions/blog";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  variable: "--font-khmer",
});

/* --------------------------------- Metadata --------------------------------- */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const localized = getSiteConfig(lang);
  const title = `${localized.name} — ${localized.title}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s — ${localized.name}`,
    },
    description: localized.tagline,
    keywords: [
      "Rithy Bondeth",
      "Full Stack Developer",
      "AI Engineer",
      "Software Engineer",
      "Next.js",
      "React",
      "Phnom Penh",
      "Cambodia",
    ],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    alternates: {
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
    openGraph: {
      type: "website",
      locale: lang === "km" ? "km_KH" : "en_US",
      url: `/${lang}`,
      siteName: siteConfig.name,
      title,
      description: localized.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: localized.tagline,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  // Index blog posts into the ⌘K command palette (metadata only, no content).
  const posts = await getAllPosts(lang);
  const palettePosts = posts.map(({ slug, title, tags }) => ({
    slug,
    title,
    tags,
  }));

  return (
    <html
      lang={lang}
      // next-themes mutates the class on <html> before hydration
      suppressHydrationWarning
      // Next 16 no longer overrides CSS smooth-scroll during SPA navigations;
      // this attribute restores instant scroll-to-top on route changes.
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-mono",
        jetbrainsMono.variable,
        kantumruyPro.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {dict.nav.skipToContent}
          </a>
          <Nav lang={lang} />
          {/* Everything that scrolls lives inside the smooth-scroll content;
              the fixed navbar and the portaled command palette stay outside. */}
          <SmoothScroll>
            {children}
            <Footer lang={lang} />
          </SmoothScroll>
          <CommandPalette lang={lang} posts={palettePosts} />
          <CustomCursor />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
