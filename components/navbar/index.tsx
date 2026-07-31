"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  localizeHref,
  getDictionary,
  type TLocale,
  type TDictionary,
} from "@/utils/i18n";

/**
 * The masthead bar.
 *
 * A floating panel inset from the top edge rather than a full-bleed bar welded
 * to it: the page visibly runs underneath, which is what makes the layout read
 * as a sheet of paper with a rail over it instead of a chrome-heavy app shell.
 * Translucent paper plus a backdrop blur keeps the type behind it legible
 * without a solid block.
 *
 * The active item is a filled block, not an underline. The old version glided
 * a GSAP indicator between links, which meant the nav couldn't render its own
 * active state until JS had measured the DOM — with a filled `bg-secondary`
 * block it's plain CSS, correct on first paint, and survives resize for free.
 *
 * Also gone: the hide-on-scroll-down transform. The bar is short and quiet
 * enough to simply stay put, and a bar that moves on its own is exactly the
 * kind of unasked-for motion this redesign is removing.
 */

/* ---------------------------------- Utils ---------------------------------- */
function navKeyFromHref(href: string): keyof TDictionary["nav"] {
  return href.replace("/#", "").replace("/", "") as keyof TDictionary["nav"];
}

// Section ids grouped under the desktop "Explore" dropdown — used to decide
// whether the trigger (rather than one of the now-hidden links) is active.
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

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
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
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

/* ------------------------------ Shared classes ------------------------------ */
/** One nav item. Active is a filled block; inactive is muted type. */
function itemClass(active: boolean) {
  return [
    "relative flex items-center whitespace-nowrap px-3 py-1.5 text-[0.8125rem] transition-colors duration-200",
    active
      ? "bg-secondary text-foreground"
      : "text-muted-foreground hover:text-foreground",
  ].join(" ");
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

function LanguageSwitcher({ lang }: { lang: TLocale }) {
  const pathname = usePathname();
  const router = useRouter();
  const labels: Record<TLocale, string> = { en: "EN", km: "ខ្មែរ" };

  function switchedPath(target: TLocale): string {
    const rest = pathname.replace(/^\/(en|km)(?=\/|$)/, "");
    return `/${target}${rest}`;
  }

  /**
   * Changing locale swaps the `[lang]` route segment, which remounts the whole
   * subtree, so the switch lands with a hard snap. A view transition
   * cross-fades the old page into the new one instead.
   *
   * `router.push` resolves before the new page paints, so the transition is
   * held open by a promise that only settles once the pathname has changed.
   */
  useEffect(() => {
    resolveLocaleTransition();
  }, [pathname]);

  function handleSwitch(e: React.MouseEvent<HTMLAnchorElement>, target: TLocale) {
    persistLocaleCookie(target);
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

  return (
    <div className="flex items-center">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span aria-hidden className="mx-1 h-3 w-px bg-rule" />
          )}
          <Link
            href={switchedPath(locale)}
            onClick={(e) => handleSwitch(e, locale)}
            aria-current={lang === locale ? "true" : undefined}
            className={`eyebrow flex min-h-11 items-center px-1 transition-colors lg:min-h-0 ${
              lang === locale
                ? "text-foreground"
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

export default function Navbar({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const pathname = usePathname();
  const exploreRef = useRef<HTMLLIElement>(null);
  const onHome = pathname === `/${lang}`;
  const isExploreActive = EXPLORE_IDS.includes(activeSection);

  // In-page section links ("/#about") only need scrollToSection when we're
  // already on the homepage. From any other route, let <Link> navigate to
  // "/{lang}#id"; SmoothScroll lands on the hash once the content mounts.
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

  // Which section is currently under the reader — drives the filled item.
  useEffect(() => {
    const sectionIds = navLinks
      .map(({ href }) => href)
      .filter((href) => href.startsWith("/#"))
      .map((href) => href.replace("/#", ""));

    const onScroll = () => {
      setScrolled(window.scrollY > 16);

      const threshold = window.innerHeight * 0.35;
      let current = "";

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

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-5">
      <div
        // At the very top the panel is invisible and the masthead reads as part
        // of the page; once the reader moves, it separates from the content
        // with paper, a hairline and a blur.
        className={`mx-auto flex max-w-[76rem] items-center justify-between gap-4 px-4 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 sm:px-5 ${
          scrolled || menuOpen
            ? "border border-rule bg-background/85 py-2.5 shadow-[0_1px_20px_-12px_rgb(0_0_0/0.35)] backdrop-blur-md"
            : "border border-transparent py-3"
        }`}
      >
        {/* ── Brand ─────────────────────────────────────────────────────── */}
        <Link
          href={`/${lang}`}
          aria-label={siteConfig.name}
          className="btn-fx flex items-center transition-opacity hover:opacity-70"
        >
          <Logo className="text-base" />
          <span className="sr-only">{siteConfig.name}</span>
        </Link>

        {/* ── Desktop links ─────────────────────────────────────────────── */}
        <ul className="hidden items-center lg:flex">
          {/* Explore groups the homepage's own scroll-sections so the bar keeps
              real destinations front and centre. */}
          <li ref={exploreRef} className="relative">
            <button
              type="button"
              onClick={() => setExploreOpen((o) => !o)}
              aria-haspopup="true"
              aria-expanded={exploreOpen}
              className={`${itemClass(isExploreActive)} gap-1.5`}
            >
              {dict.nav.explore}
              <ChevronDownIcon
                className={`h-3 w-3 transition-transform duration-200 motion-reduce:transition-none ${
                  exploreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <ul
              className={`absolute left-0 top-full mt-2 min-w-44 flex-col border border-rule bg-background/95 p-1 shadow-[0_8px_30px_-16px_rgb(0_0_0/0.4)] backdrop-blur-md ${
                exploreOpen ? "flex" : "hidden"
              }`}
            >
              {exploreNavLinks.map(({ href }) => {
                const id = href.replace("/#", "");
                return (
                  <li key={href}>
                    <Link
                      href={localizeHref(href, lang)}
                      onClick={(e) => {
                        handleNavClick(e, href);
                        setExploreOpen(false);
                      }}
                      className={`block ${itemClass(activeSection === id)}`}
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
            return (
              <li key={href}>
                <Link
                  href={localizeHref(href, lang)}
                  onClick={(e) => handleNavClick(e, href)}
                  className={itemClass(activeSection === id)}
                >
                  {dict.nav[navKeyFromHref(href)]}
                </Link>
              </li>
            );
          })}

          {/* ── Tools, parked at the right end ──────────────────────────── */}
          <li aria-hidden className="mx-3 h-4 w-px bg-rule" />
          <li>
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label={dict.commandPalette.open}
              className="btn-fx flex items-center gap-2 px-2 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <SearchIcon data-btn-glyph className="h-4 w-4" />
              <kbd className="eyebrow">⌘K</kbd>
            </button>
          </li>
          <li>
            <a
              href={siteConfig.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-fx link-wipe ml-1 px-2 py-1.5 text-[0.8125rem] text-foreground"
            >
              {dict.nav.resume}
            </a>
          </li>
          <li className="ml-3">
            <LanguageSwitcher lang={lang} />
          </li>
          <li className="ml-2">
            <ThemeToggle label={dict.nav.toggleTheme} />
          </li>
        </ul>

        {/* ── Mobile controls ───────────────────────────────────────────── */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label={dict.commandPalette.open}
            className="btn-fx btn-fx-icon flex size-11 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <SearchIcon data-btn-glyph className="h-4 w-4" />
          </button>
          <LanguageSwitcher lang={lang} />
          <ThemeToggle label={dict.nav.toggleTheme} />
          <button
            className="btn-fx btn-fx-icon flex size-11 items-center justify-center text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={dict.nav.toggleMenu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <CloseIcon data-btn-glyph className="h-5 w-5" />
            ) : (
              <MenuIcon data-btn-glyph className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      <div
        inert={!menuOpen}
        className={`mx-auto grid max-w-[76rem] transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <ul className="border-x border-b border-rule bg-background/95 px-4 py-2 backdrop-blur-md">
            {navLinks.map(({ href }, i) => {
              const id = href.replace("/#", "").replace("/", "");
              const isActive = activeSection === id;
              return (
                <li key={href}>
                  <Link
                    href={localizeHref(href, lang)}
                    onClick={(e) => {
                      handleNavClick(e, href);
                      setMenuOpen(false);
                    }}
                    className={`flex min-h-12 items-center gap-4 border-b border-rule text-sm transition-colors ${
                      isActive ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <span className="eyebrow numeral">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {dict.nav[navKeyFromHref(href)]}
                  </Link>
                </li>
              );
            })}
            <li>
              <a
                href={siteConfig.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center text-sm text-foreground"
              >
                {dict.nav.resumeMobile}
                <span aria-hidden className="ml-2">
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
