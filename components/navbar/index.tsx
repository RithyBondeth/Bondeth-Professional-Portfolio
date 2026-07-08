"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/utils/constants/portfolio.constant";
import { MenuIcon, CloseIcon } from "@/components/utils/icons";
import { Logo } from "@/components/utils/icons/logo";
import ThemeToggle from "@/components/utils/theme/theme-toggle";
import {
  locales,
  localizeHref,
  getDictionary,
  type TLocale,
  type TDictionary,
} from "@/utils/i18n";

/* ---------------------------------- Utils ---------------------------------- */
function navKeyFromHref(href: string): keyof TDictionary["nav"] {
  return href
    .replace("/#", "")
    .replace("/", "") as keyof TDictionary["nav"];
}

/* -------------------------------- Components -------------------------------- */
function LanguageSwitcher(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();
  const labels: Record<TLocale, string> = { en: "EN", km: "ខ្មែរ" };

  function switchedPath(target: TLocale): string {
    const rest = pathname.replace(/^\/(en|km)(?=\/|$)/, "");
    return `/${target}${rest}`;
  }

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="flex items-center gap-0.5 border border-border/60 rounded px-1 py-0.5">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span className="text-muted-foreground dark:text-muted-foreground/30 text-[10px] mx-0.5">
              |
            </span>
          )}
          <Link
            href={switchedPath(locale)}
            onClick={() => {
              document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
            }}
            className={`px-1.5 py-0.5 text-[11px] font-mono rounded transition-colors ${
              lang === locale
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {labels[locale]}
          </Link>
        </span>
      ))}
    </div>
  );
}

export default function Navbar(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);

  /* -------------------------------- All States ------------------------------- */
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [progress, setProgress] = useState(0);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    const sectionIds = navLinks
      .map(({ href }) => href)
      .filter((href) => href.startsWith("/#"))
      .map((href) => href.replace("/#", ""));

    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0);

      const threshold = window.innerHeight * 0.35;
      let current = "";

      // Check if we are on the blog page
      if (window.location.pathname.includes("/blog")) {
        current = "blog";
      } else {
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (!el) continue;
          if (el.getBoundingClientRect().top <= threshold) current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-xl shadow-black/10 dark:shadow-black/40"
          : "bg-transparent"
      }`}
    >
      {/* Scroll Progress Bar Section */}
      <div
        className="absolute bottom-0 left-0 h-px bg-primary/70 transition-[width] duration-75 ease-out pointer-events-none"
        style={{ width: `${progress}%` }}
      />
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Section */}
        <a
          href={`/${lang}`}
          aria-label={siteConfig.name}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Logo className="text-base" />
          <span className="sr-only">{siteConfig.name}</span>
        </a>

        {/* Desktop Links Section */}
        <ul className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {navLinks.map(({ href }, i) => {
            const id = href.replace("/#", "").replace("/", "");
            const isActive = activeSection === id;
            return (
              <li key={href}>
                <a
                  href={localizeHref(href, lang)}
                  className={`relative px-2.5 xl:px-3 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap transition-colors duration-200 rounded ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <span className="text-primary dark:text-primary/40 mr-1 text-[10px] hidden xl:inline">
                    0{i + 1}.
                  </span>
                  {dict.nav[navKeyFromHref(href)]}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-primary/60 rounded-full" />
                  )}
                </a>
              </li>
            );
          })}
          <li aria-hidden className="mx-2 h-4 w-px bg-border" />
          <li>
            <a
              href={siteConfig.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap text-primary border border-primary/30 rounded hover:bg-primary/5 transition-all"
            >
              {dict.nav.resume}
            </a>
          </li>
          <li className="ml-2">
            <LanguageSwitcher lang={lang} />
          </li>
          <li className="ml-1">
            <ThemeToggle label={dict.nav.toggleTheme} />
          </li>
        </ul>

        {/* Mobile Right Section */}
        <div className="lg:hidden flex items-center gap-3">
          <LanguageSwitcher lang={lang} />
          <ThemeToggle label={dict.nav.toggleTheme} />
          <button
            className="p-1 -m-1 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={dict.nav.toggleMenu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <CloseIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Section */}
      <div
        inert={!menuOpen}
        className={`lg:hidden grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-1 border-t border-border px-6 py-4">
            {navLinks.map(({ href }, i) => {
              const id = href.replace("/#", "").replace("/", "");
              const isActive = activeSection === id;
              return (
                <li key={href}>
                  <a
                    href={localizeHref(href, lang)}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 text-xs font-mono rounded border-l transition-all ${
                      isActive
                        ? "text-primary bg-primary/5 border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                    }`}
                  >
                    <span className="text-primary dark:text-primary/40 text-[10px]">
                      0{i + 1}.
                    </span>
                    {dict.nav[navKeyFromHref(href)]}
                  </a>
                </li>
              );
            })}
            <li className="mt-2 pt-3 border-t border-border/50">
              <a
                href={siteConfig.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-mono rounded text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                {dict.nav.resumeMobile}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
