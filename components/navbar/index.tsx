"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/components/utils/animations/gsap";
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
import { OPEN_COMMAND_PALETTE } from "@/components/command-palette";
import {
  locales,
  localizeNavHref,
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* -------------------------------- Components -------------------------------- */
/** View Transitions API — not yet in every TS lib. */
type TDocWithViewTransition = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => {
    finished: Promise<void>;
  };
};

/**
 * Resolver that ends the in-flight locale view transition.
 *
 * Module scope is deliberate: switching locale remounts LanguageSwitcher, so a
 * ref would be torn down with the old instance and the transition would never
 * be told the new page had arrived — it would hang until the browser's 4s
 * timeout. The module survives the remount, so the newly mounted instance can
 * resolve the transition its predecessor started.
 */
let endLocaleTransition: (() => void) | null = null;

function resolveLocaleTransition() {
  endLocaleTransition?.();
  endLocaleTransition = null;
}

function LanguageSwitcher(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;

  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();
  const router = useRouter();
  const labels: Record<TLocale, string> = { en: "EN", km: "ខ្មែរ" };

  function switchedPath(target: TLocale): string {
    const rest = pathname.replace(/^\/(en|km)(?=\/|$)/, "");
    return `/${target}${rest}`;
  }

  /**
   * Changing locale swaps the `[lang]` route segment, which remounts the whole
   * subtree — nav, footer and every entry animation rebuild at once, so the
   * switch lands with a hard snap. A view transition cross-fades the old page
   * into the new one instead.
   *
   * `router.push` resolves before the new page paints, so the transition is
   * held open by a promise that only settles once the pathname has changed.
   */
  useEffect(() => {
    resolveLocaleTransition();
  }, [pathname]);

  function handleSwitch(
    e: React.MouseEvent<HTMLAnchorElement>,
    target: TLocale,
  ) {
    document.cookie = `NEXT_LOCALE=${target};path=/;max-age=31536000`;
    if (target === lang) return;

    const doc = document as TDocWithViewTransition;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Without the API, or with reduced motion, let <Link> navigate as usual.
    if (!doc.startViewTransition || reduce) return;

    e.preventDefault();
    const root = document.documentElement;
    root.classList.add("locale-switching");

    const transition = doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          endLocaleTransition = resolve;
          // Never hold the frozen snapshot for long: if the new page is slow,
          // drop the cross-fade rather than leave the page looking hung.
          setTimeout(() => {
            if (endLocaleTransition === resolve) resolveLocaleTransition();
          }, 600);
          router.push(switchedPath(target));
        }),
    );
    transition.finished.finally(() => {
      root.classList.remove("locale-switching");
    });
  }

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="flex items-center gap-0.5 rounded border border-border/60 px-1 lg:py-0.5">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span className="text-muted-foreground dark:text-muted-foreground/30 text-[10px] mx-0.5">
              |
            </span>
          )}
          <Link
            href={switchedPath(locale)}
            onClick={(e) => handleSwitch(e, locale)}
            className={`flex min-h-11 items-center rounded px-1.5 font-mono text-[11px] transition-colors lg:min-h-0 lg:py-0.5 ${
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
  const [exploreOpen, setExploreOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [progress, setProgress] = useState(0);

  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const exploreRef = useRef<HTMLLIElement>(null);
  const menuOpenRef = useRef(false);
  const hiddenRef = useRef(false);
  const lastYRef = useRef(0);
  const onHome = pathname === `/${lang}`;
  const isExploreActive = EXPLORE_IDS.includes(activeSection);

  // In-page section links ("/#about" etc.) only need scrollToSection when
  // we're already on the homepage — the smoother's scrollTo replaces the
  // native hash jump, which lands in the wrong spot once ScrollSmoother is
  // virtualizing scroll. From any other route, let <Link> do a normal
  // client-side navigation to "/{lang}#id"; SmoothScroll picks up the hash
  // once the homepage content mounts.
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
      gsap.to(navRef.current, { yPercent: 0, duration: 0.4, ease: "smooth" });
    }
  }, [menuOpen]);

  useEffect(() => {
    const sectionIds = navLinks
      .map(({ href }) => href)
      .filter((href) => href.startsWith("/#"))
      .map((href) => href.replace("/#", ""));

    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollHeight > 0 ? (y / scrollHeight) * 100 : 0);

      // Hide the bar while scrolling down through the page, bring it back the
      // moment the user scrolls up — classic focus-on-content pattern.
      // Reduced motion keeps the bar permanently visible.
      if (!reduceMq.matches) {
        const goingDown = y > lastYRef.current + 6;
        const goingUp = y < lastYRef.current - 6;
        if (goingDown && y > 400 && !menuOpenRef.current && !hiddenRef.current) {
          hiddenRef.current = true;
          gsap.to(navRef.current, {
            yPercent: -100,
            duration: 0.45,
            ease: "smooth",
            overwrite: "auto",
          });
        } else if ((goingUp || y <= 400) && hiddenRef.current) {
          hiddenRef.current = false;
          gsap.to(navRef.current, {
            yPercent: 0,
            duration: 0.45,
            ease: "smooth",
            overwrite: "auto",
          });
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

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
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
        gsap.to(indicator, { opacity: 0, duration: 0.2 });
        return;
      }
      const vars = {
        x: active.offsetLeft + 10,
        width: Math.max(0, active.offsetWidth - 20),
        opacity: 1,
      };
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (animate && !reduce) {
        gsap.to(indicator, { ...vars, duration: 0.45, ease: "smooth" });
      } else {
        gsap.set(indicator, vars);
      }
    };

    place(true);
    const onResize = () => place(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeSection]);

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
      ref={navRef}
      // Colors/shadow only — GSAP owns the transform for hide/reveal, and a
      // CSS `transition-all` would double-ease it.
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
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
            className="pointer-events-none absolute bottom-0 left-0 h-px w-0 rounded-full bg-primary/70 opacity-0"
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
              className={`relative flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap transition-colors duration-200 rounded ${
                isExploreActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <span className="text-primary dark:text-primary/40 mr-1 text-[10px] hidden xl:inline">
                01.
              </span>
              {dict.nav.explore}
              <ChevronDownIcon
                className={`w-3 h-3 transition-transform duration-200 ${exploreOpen ? "rotate-180" : ""}`}
              />
            </button>
            <ul
              className={`absolute left-0 top-full mt-2 min-w-40 flex-col gap-0.5 rounded border border-border bg-background/95 backdrop-blur-md p-1 shadow-xl shadow-black/10 dark:shadow-black/40 ${
                exploreOpen ? "flex" : "hidden"
              }`}
            >
              {exploreNavLinks.map(({ href }) => {
                const id = href.replace("/#", "");
                const isActive = activeSection === id;
                return (
                  <li key={href}>
                    <Link
                      href={localizeNavHref(href, lang)}
                      onClick={(e) => {
                        handleNavClick(e, href);
                        setExploreOpen(false);
                      }}
                      className={`block rounded px-3 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap transition-colors ${
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
          {topNavLinks.map(({ href }, i) => {
            const id = href.replace("/#", "").replace("/", "");
            const isActive = activeSection === id;
            return (
              <li key={href}>
                <Link
                  href={localizeNavHref(href, lang)}
                  data-nav-id={id}
                  onClick={(e) => handleNavClick(e, href)}
                  className={`relative px-2.5 xl:px-3 py-1.5 text-xs font-mono tracking-wide whitespace-nowrap transition-colors duration-200 rounded ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  }`}
                >
                  <span className="text-primary dark:text-primary/40 mr-1 text-[10px] hidden xl:inline">
                    0{i + 2}.
                  </span>
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
              className="btn-fx btn-fx-outline flex items-center gap-2 pl-2.5 pr-2 py-1.5 text-xs font-mono text-muted-foreground border border-border/60 rounded hover:text-foreground"
            >
              <SearchIcon data-btn-glyph className="w-3.5 h-3.5" />
              <kbd className="text-[10px] text-muted-foreground dark:text-muted-foreground/70">
                ⌘K
              </kbd>
            </button>
          </li>
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
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label={dict.commandPalette.open}
            className="btn-fx btn-fx-icon flex size-11 items-center justify-center rounded border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary"
          >
            <SearchIcon data-btn-glyph className="w-3.5 h-3.5" />
          </button>
          <LanguageSwitcher lang={lang} />
          <ThemeToggle label={dict.nav.toggleTheme} />
          <button
            className="btn-fx btn-fx-icon flex size-11 items-center justify-center rounded text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
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
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-1 border-t border-border px-6 py-4">
            {navLinks.map(({ href }, i) => {
              const id = href.replace("/#", "").replace("/", "");
              const isActive = activeSection === id;
              return (
                <li key={href}>
                  <Link
                    href={localizeNavHref(href, lang)}
                    onClick={(e) => {
                      handleNavClick(e, href);
                      setMenuOpen(false);
                    }}
                    className={`flex min-h-11 items-center gap-2 rounded border-l px-3 text-xs font-mono transition-all ${
                      isActive
                        ? "text-primary bg-primary/5 border-primary"
                        : "text-muted-foreground border-transparent hover:text-foreground hover:border-border"
                    }`}
                  >
                    <span className="text-primary dark:text-primary/40 text-[10px]">
                      0{i + 1}.
                    </span>
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
                onClick={() => setMenuOpen(false)}
                className="flex min-h-11 items-center justify-center gap-2 rounded border border-primary/20 bg-primary/5 px-3 text-xs font-mono text-primary transition-colors hover:bg-primary/10"
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
