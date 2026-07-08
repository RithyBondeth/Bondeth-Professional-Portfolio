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
import { ThemeProvider } from "@/components/utils/theme/theme-provider";
import { siteConfig } from "@/utils/constants/portfolio.constant";
import { locales, hasLocale, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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

  return (
    <html
      lang={lang}
      // next-themes mutates the class on <html> before hydration
      suppressHydrationWarning
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
          <Nav lang={lang} />
          {children}
          <Footer lang={lang} />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
