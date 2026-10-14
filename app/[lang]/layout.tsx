import { MotionScript } from "@/shared/components/motion/motion-script";
import { MOTION_CSS_VARS } from "@/shared/lib/motion-timing";
import type { Metadata } from "next";
import { JetBrains_Mono, Ubuntu } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/app/globals.css";
import { cn } from "@/shared/lib/utils";
import Nav from "@/features/navigation/components/navbar/navbar";
import Footer from "@/features/navigation/components/footer/footer";
import DeferredCommandPalette from "@/features/navigation/components/command-palette/deferred-command-palette";
import DeferredPixelChatbot from "@/features/chatbot/components/deferred-pixel-chatbot";
import {
  ThemeProvider,
  ThemeScript,
} from "@/shared/components/theme/theme-provider";
import { SmoothScroll } from "@/shared/components/motion/smooth-scroll";
import { RevealFallback } from "@/shared/components/motion/reveal-fallback";
import { AmbientBackground } from "@/shared/components/background/ambient-background";
import { siteConfig } from "@/features/portfolio/data/portfolio";
import { locales, hasLocale, getDictionary } from "@/shared/i18n";
import { getSiteConfig } from "@/features/portfolio/data/localized-content";
import { getAllPosts } from "@/features/blog/server";
import { buildChatTours } from "@/features/chatbot/server/tour";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-ubuntu",
});

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
  const tours = await buildChatTours(lang);

  return (
    <html
      style={MOTION_CSS_VARS}
      lang={lang}
      // The theme initialization script sets the class before hydration
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        ubuntu.variable,
        "font-sans",
        jetbrainsMono.variable,
      )}
    >
      <body className="isolate min-h-full flex flex-col">
        {/* Injected once per document before hydration to avoid a theme flash. */}
        <ThemeScript />
        <MotionScript />
        <ThemeProvider>
          {/* The site's ambient background, mounted ONCE and fixed to the
              viewport. It sits here rather than inside each section on purpose:
              a copy per section put a seam at every section boundary, where one
              instance's grid ended and the next one's started over. Landing
              sections carry no background of their own so this shows through.

              It is a sibling of the scroll content so its fixed positioning
              remains independent of every page section. */}
          <AmbientBackground />
          <RevealFallback />
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-lg focus:bg-primary-fill focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {dict.nav.skipToContent}
          </a>
          <Nav lang={lang} />
          {/* Page content and footer share one normal document-flow boundary;
              fixed and portaled controls remain outside it. */}
          <SmoothScroll>
            {children}
            <Footer lang={lang} />
          </SmoothScroll>
          <DeferredCommandPalette lang={lang} posts={palettePosts} />
          <DeferredPixelChatbot lang={lang} tours={tours} />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
