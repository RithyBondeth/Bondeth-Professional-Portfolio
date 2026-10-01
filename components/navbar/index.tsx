"use client";

import { isMotionReduced, subscribeToMotionPreference } from "@/lib/motion-preference";
import { MOTION } from "@/lib/motion-timing";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Languages } from "lucide-react";
import { NAV_ICON_BUTTON } from "@/lib/utils";
import { trackCvDownload } from "@/utils/functions/track-cv-download";
import { scrollToSection } from "@/components/utils/animations/smooth-scroll";
import {
  navLinks,
  exploreNavLinks,
  topNavLinks,
  siteConfig,
} from "@/utils/constants/portfolio.constant";
import { MenuIcon, CloseIcon } from "@/components/utils/icons";
import { Logo } from "@/components/utils/icons/logo";
import ThemeToggle from "@/components/utils/theme/theme-toggle";
import { OPEN_COMMAND_PALETTE } from "@/components/command-palette/events";
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

// Section ids grouped under the desktop "Explore" dropdown — used to decide
// whether the trigger button (rather than one of the now-hidden links)
// should pick up the active-link underline.
const EXPLORE_IDS: string[] = exploreNavLinks.map(({ href }) =>
  navKeyFromHref(href),
);

function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(OPEN_COMMAND_PALETTE));
}

/** Persists the chosen locale so the middleware can honour it on the next visit. */
function persistLocaleCookie(target: TLocale) {
  document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000`;
}

/* These take the full SVG props like every icon in components/utils/icons, NOT
   just `className`. They used to take only `className`, which silently dropped
   the `data-btn-glyph` marker at the call site — so `.btn-fx`'s hover glyph
   animation never ran on the search or theme buttons, while it did on every
   icon that came from the shared module. */
function SearchIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronDownIcon({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* -------------------------------- Components -------------------------------- */
function LanguageSwitcher(props: { lang: TLocale; label: string }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang, label } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();

  // With two locales this is a straight toggle; the modulo keeps it honest if a
  // third is ever added — it would then cycle rather than silently stick.
  const next = locales[(locales.indexOf(lang) + 1) % locales.length];

  function switchedPath(target: TLocale): string {
    const rest = pathname.replace(/^\/(en|km)(?=\/|$)/, "");
    return `/${target}${rest}`;
  }

  function handleSwitch(target: TLocale) {
    persistLocaleCookie(target);
  }

  /* -------------------------------- Render UI ------------------------------- */
  // A <Link>, not a <button>: this navigates, so it has to keep its href for
  // middle-click, "open in new tab", and crawlers following the alternate
  // locale. It only *looks* like the theme toggle — see NAV_ICON_BUTTON.
  return (
    <Link
      href={switchedPath(next)}
      onClick={() => handleSwitch(next)}
      aria-label={label}
      title={label}
      className={NAV_ICON_BUTTON}
    >
      <Languages data-btn-glyph className="w-3.5 h-3.5" />
    </Link>
  );
}

export default function Navbar(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);

  /* -------------------------------- All States ------------------------------- */
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [navHidden, setNavHidden] = useState(false);

  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();
  const linksRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const exploreRef = useRef<HTMLLIElement>(null);
  const menuOpenRef = useRef(false);
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);
  const onHome = pathname === `/${lang}`;
  const isExploreActive = EXPLORE_IDS.includes(activeSection);

  // On the homepage, animate section links with the native helper and update
  // the URL without triggering a route render. From another route, let Link
  // navigate normally; the destination resolves its hash after mounting.
  function handleNavClick(e: React.MouseEvent, href: string) {
    if (!href.startsWith("/#") || !onHome) return;
    e.preventDefault();
    scrollToSection(href.replace("/#", ""));
    history.replaceState(null, "", `/${lang}${href.slice(1)}`);
    setMenuOpen(false);
  }

  // Close the "Explore" dropdown on an outside click or Escape.
  useEffect(() => {
    if (!exploreOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExploreOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [exploreOpen]);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => {
    menuOpenRef.current = menuOpen;
    // Opening the menu must always bring the bar back.
    if (menuOpen && hiddenRef.current) {
      hiddenRef.current = false;
      setNavHidden(false);
    }
  }, [menuOpen]);

  useEffect(() => {
    const sectionIds = navLinks
      .map(({ href }) => href)
      .filter((href) => href.startsWith("/#"))
      .map((href) => href.replace("/#", ""));


    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 20);

      // Hide the bar while scrolling down through the page, bring it back the
      // moment the user scrolls up — classic focus-on-content pattern.
      // Reduced motion keeps the bar permanently visible.
      if (isMotionReduced()) {
        hiddenRef.current = false;
        setNavHidden(false);
      } else {
        const goingDown = y > lastYRef.current + 6;
        const goingUp = y < lastYRef.current - 6;
        if (goingDown && y > 400 && !menuOpenRef.current && !hiddenRef.current) {
          hiddenRef.current = true;
          setNavHidden(true);
        } else if ((goingUp || y <= 400) && hiddenRef.current) {
          hiddenRef.current = false;
          setNavHidden(false);
        }
      }
      lastYRef.current = y;

      const threshold = window.innerHeight * 0.35;
      let current = "";

      // Check if we are on the blog page
      if (window.location.pathname.includes("/labs")) {
        current = "labs";
      } else if (window.location.pathname.includes("/blog")) {
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

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    const unsubscribe = subscribeToMotionPreference(onScroll);
    return () => {
      unsubscribe();
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // One sliding underline glides between active links instead of each link
  // painting its own — jumps instantly under reduced motion.
  useEffect(() => {
    const ul = linksRef.current;
    const indicator = indicatorRef.current;
    if (!ul || !indicator) return;

    const place = (animate: boolean) => {
      // Explore-grouped sections don't render their own top-level link — the
      // underline should sit under the dropdown trigger instead.
      const targetId = EXPLORE_IDS.includes(activeSection)
        ? "explore-trigger"
        : activeSection;
      const active = ul.querySelector<HTMLElement>(
        `[data-nav-id="${targetId}"]`,
      );
      if (!active) {
        indicator.style.opacity = "0";
        return;
      }
      const reduce = isMotionReduced();
      indicator.style.transitionDuration = animate && !reduce ? `${MOTION.feedback}ms` : "0ms";
      indicator.style.transform = `translateX(${active.offsetLeft + 10}px)`;
      indicator.style.width = `${Math.max(0, active.offsetWidth - 20)}px`;
      indicator.style.opacity = "1";
    };

    place(true);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    const unsubscribe = subscribeToMotionPreference(onResize);
    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
    };
  }, [activeSection]);

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <nav
      className={`fixed top-3 left-3 right-3 z-50 py-1 mx-auto max-w-6xl overflow-hidden rounded-2xl border backdrop-blur-xl transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out lg:overflow-visible ${
        navHidden ? "-translate-y-[calc(100%+1rem)]" : "translate-y-0"
      } ${
        scrolled || menuOpen
          ? "border-border/70 bg-background/92 shadow-2xl shadow-black/12 dark:shadow-black/45"
          : "border-border/45 bg-background/72 shadow-lg shadow-black/6"
      }`}
    >
      <div className="mx-auto flex items-center justify-between px-4 py-2.5 sm:px-5">
        {/* Brand Section */}
        <Link
          href={`/${lang}`}
          aria-label={siteConfig.name}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Logo className="text-base" />
          <span className="sr-only">{siteConfig.name}</span>
        </Link>

        {/* Desktop Links Section */}
        <ul ref={linksRef} className="relative hidden lg:flex items-center gap-0.5 xl:gap-1">
          {/* Sliding active-link underline (decorative) */}
          <span
            ref={indicatorRef}
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-px w-0 rounded-full bg-primary/70 opacity-0 transition-[transform,width,opacity] ease-out"
          />
          {/* Explore dropdown — groups the homepage's own scroll-sections
              (About, Skills, Experience, Education, Services) so the bar
              keeps real destinations front and center. */}
          <li ref={exploreRef} className="relative">
            <button
              type="button"
              data-nav-id="explore-trigger"
              onClick={() => setExploreOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={exploreOpen}
              className={`relative flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap transition-colors duration-200 rounded-lg ${
                isExploreActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              {dict.nav.explore}
              <ChevronDownIcon
                className={`w-3 h-3 transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`}
              />
            </button>
            <ul
              inert={!exploreOpen}
              aria-hidden={!exploreOpen}
              className={`absolute left-0 top-full z-60 mt-2 flex min-w-40 origin-top flex-col gap-0.5 rounded-lg border border-border bg-background/95 p-1 shadow-xl shadow-black/10 backdrop-blur-md transition-[opacity,transform] duration-200 ease-out dark:shadow-black/40 ${
                exploreOpen
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              {exploreNavLinks.map(({ href }) => {
                const id = href.replace("/#", "");
                const isActive = activeSection === id;
                return (
                  <li key={href}>
                    <Link
                      href={localizeHref(href, lang)}
                      aria-current={isActive ? "location" : undefined}
                      onClick={(e) => {
                        handleNavClick(e, href);
                        setExploreOpen(false);
                      }}
                      className={`block rounded-lg px-3 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap transition-colors ${
                        isActive
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      {dict.nav[navKeyFromHref(href)]}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
          {topNavLinks.map(({ href }) => {
            const id = href.replace("/#", "").replace("/", "");
            const isActive = activeSection === id;
            return (
              <li key={href}>
                <Link
                  href={localizeHref(href, lang)}
                  data-nav-id={id}
                  aria-current={isActive ? "location" : undefined}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`relative px-2.5 xl:px-3 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap transition-colors duration-200 rounded-lg ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  {dict.nav[navKeyFromHref(href)]}
                </Link>
              </li>
            );
          })}
          <li aria-hidden className="mx-2 h-4 w-px bg-border" />
          <li>
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label={dict.commandPalette.open}
              className="btn-fx btn-fx-outline flex items-center gap-2 pl-2.5 pr-2 py-1.5 text-xs font-mono text-muted-foreground border border-border/60 rounded-lg hover:text-foreground"
            >
              <SearchIcon data-btn-glyph className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{dict.commandPalette.open}</span>
            </button>
          </li>
          <li>
            {/* The readable resume, not the file. The PDF is one tracked click
                away on that page, and an HTML resume is what a phone, a search
                engine and the Khmer locale can all actually use. */}
            <Link
              href={`/${lang}/resume`}
              aria-label={dict.nav.resume}
              title={dict.nav.resume}
              className={NAV_ICON_BUTTON}
            >
              <FileText data-btn-glyph className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li>
            <LanguageSwitcher lang={lang} label={dict.nav.toggleLanguage} />
          </li>
          <li>
            <ThemeToggle label={dict.nav.toggleTheme} />
          </li>
        </ul>

        {/* Mobile Right Section */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label={dict.commandPalette.open}
            className={NAV_ICON_BUTTON}
          >
            <SearchIcon data-btn-glyph className="w-3.5 h-3.5" />
          </button>
          <LanguageSwitcher lang={lang} label={dict.nav.toggleLanguage} />
          <ThemeToggle label={dict.nav.toggleTheme} />
          <button
            className="btn-fx btn-fx-icon flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={dict.nav.toggleMenu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <CloseIcon data-btn-glyph className="w-5 h-5" />
            ) : (
              <MenuIcon data-btn-glyph className="w-5 h-5" />
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
        <div className="max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain">
          <ul className="flex flex-col gap-1 border-t border-border px-6 py-4">
            {navLinks.map(({ href }) => {
              const id = href.replace("/#", "").replace("/", "");
              const isActive = activeSection === id;
              return (
                <li key={href}>
                  <Link
                    href={localizeHref(href, lang)}
                    aria-current={isActive ? "location" : undefined}
                    onClick={(e) => {
                      handleNavClick(e, href);
                      setMenuOpen(false);
                    }}
                    className={`flex min-h-11 items-center gap-2 rounded-lg border-l px-3 text-xs font-mono transition-all ${
                      isActive
                        ? "text-primary bg-primary/5 border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                    }`}
                  >
                    {dict.nav[navKeyFromHref(href)]}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 pt-3 border-t border-border/50">
              <a
                href={siteConfig.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackCvDownload("navbar-mobile");
                  setMenuOpen(false);
                }}
                className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 text-xs font-mono text-primary transition-colors hover:bg-primary/10"
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
