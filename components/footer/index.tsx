"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  siteConfig,
  primaryNavLinks,
} from "@/utils/constants/portfolio.constant";
import { Container } from "@/components/ui/section";
import { Reveal } from "@/components/utils/animations/reveal";
import { scrollToSection } from "@/components/utils/animations/smooth-scroll";
import {
  localizeHref,
  getDictionary,
  type TLocale,
  type TDictionary,
} from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

/**
 * The colophon.
 *
 * A book's last page: the name set large one final time, then three columns of
 * plain listed links, then the imprint line. The scrolling outline-stroke
 * marquee that used to sit on top is gone — a 7xl word sliding sideways
 * forever is the single most attention-grabbing thing you can put at the
 * bottom of a page, which is exactly backwards.
 *
 * External links are printed as their bare host + path rather than as
 * platform names. It's a printed convention, and it tells the reader where
 * they're actually going.
 */

function navKeyFromHref(href: string): keyof TDictionary["nav"] {
  return href.replace("/#", "").replace("/", "") as keyof TDictionary["nav"];
}

/** Strips the scheme and any trailing slash so a URL reads as a printed address. */
function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default function Footer({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const localized = getSiteConfig(lang);

  const pathname = usePathname();
  const onHome = pathname === `/${lang}`;
  const year = new Date().getFullYear();

  // See components/navbar/index.tsx for why in-page section links go through
  // scrollToSection instead of a plain hash href.
  function handleNavClick(e: React.MouseEvent, href: string) {
    if (!href.startsWith("/#") || !onHome) return;
    e.preventDefault();
    scrollToSection(href.replace("/#", ""));
    history.replaceState(null, "", `/${lang}${href.slice(1)}`);
  }

  const elsewhere = [
    { href: siteConfig.github, label: displayUrl(siteConfig.github) },
    { href: siteConfig.linkedin, label: displayUrl(siteConfig.linkedin) },
    { href: siteConfig.facebook, label: displayUrl(siteConfig.facebook) },
    { href: siteConfig.instagram, label: displayUrl(siteConfig.instagram) },
  ];

  return (
    <footer className="border-t border-rule">
      <Container>
        {/* ── Sign-off ──────────────────────────────────────────────────── */}
        <Reveal>
          <div className="border-b border-rule py-14 sm:py-20">
            <p className="display-lg leading-[0.9]">
              {siteConfig.fullName.split(" ")[0]}{" "}
              <span className="display-em">
                {siteConfig.fullName.split(" ").slice(1).join(" ")}
              </span>
            </p>
            <p className="eyebrow mt-6">
              {localized.title} — {dict.footer.basedIn}
            </p>
          </div>
        </Reveal>

        {/* ── Columns ───────────────────────────────────────────────────── */}
        <div className="grid gap-x-10 gap-y-10 py-12 sm:grid-cols-3">
          <Reveal>
            <p className="eyebrow">{dict.footer.navigation}</p>
            <ul className="mt-5 space-y-2.5">
              {primaryNavLinks.map(({ href }) => (
                <li key={href}>
                  <Link
                    href={localizeHref(href, lang)}
                    onClick={(e) => handleNavClick(e, href)}
                    className="btn-fx link-wipe text-sm text-muted-foreground hover:text-foreground"
                  >
                    {dict.nav[navKeyFromHref(href)]}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={70}>
            <p className="eyebrow">{dict.footer.contact}</p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="btn-fx link-wipe text-sm break-all text-muted-foreground hover:text-foreground"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-fx link-wipe text-sm text-muted-foreground hover:text-foreground"
                >
                  {dict.nav.resume} ↗
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={140}>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-5 space-y-2.5">
              {elsewhere.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-fx link-wipe text-sm break-all text-muted-foreground hover:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ── Imprint ───────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 border-t border-rule py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="eyebrow">
            © {year} {siteConfig.fullName}. {dict.footer.rights}
          </p>
          <p className="eyebrow">Next.js · Tailwind CSS · v0.2.0</p>
        </div>
      </Container>
    </footer>
  );
}
