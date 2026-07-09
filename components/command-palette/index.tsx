"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { siteConfig, navLinks } from "@/utils/constants/portfolio.constant";
import { GitHubIcon, LinkedInIcon } from "@/components/utils/icons";
import {
  getDictionary,
  localizeHref,
  localizeNavHref,
  type TLocale,
} from "@/utils/i18n";

/* --------------------------------- Event ----------------------------------- */
/** Fired by the navbar trigger button to open the palette. */
export const OPEN_COMMAND_PALETTE = "command-palette:open";

/* ---------------------------------- Icons ---------------------------------- */
const iconProps = {
  className: "w-4 h-4 shrink-0",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  viewBox: "0 0 24 24",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function SearchIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function HashIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
    </svg>
  );
}
function BookIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function ThemeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function AtIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg {...iconProps}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <path d="M14 2v5h5M9 13h6M9 17h6" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* --------------------------------- Types ----------------------------------- */
type TGroup = "nav" | "general" | "connect";

interface IAction {
  id: string;
  group: TGroup;
  label: string;
  keywords: string;
  icon: ReactNode;
  shortcut?: string;
  run: () => void;
  /** Keep the palette open after running (used for the "copy" feedback). */
  keepOpen?: boolean;
}

/* -------------------------------- Component -------------------------------- */
export default function CommandPalette(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const cp = dict.commandPalette;

  /* -------------------------------- All States ------------------------------ */
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  /* --------------------------------- Effects -------------------------------- */
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCopied(false);
  }, []);

  // Global ⌘K / Ctrl+K toggle + open event from the navbar trigger.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_COMMAND_PALETTE, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_COMMAND_PALETTE, onOpen);
    };
  }, []);

  // Lock body scroll, focus the input on open, and restore focus on close.
  useEffect(() => {
    if (!open) return;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(raf);
      restoreFocusRef.current?.focus?.();
    };
  }, [open]);

  /* ---------------------------------- Utils --------------------------------- */
  const actions = useMemo<IAction[]>(() => {
    const navActions: IAction[] = navLinks.map((link) => {
      const key = link.href
        .replace("/#", "")
        .replace("/", "") as keyof typeof dict.nav;
      return {
        id: `nav:${link.href}`,
        group: "nav",
        label: dict.nav[key],
        // Keep the English label in keywords so search matches in either
        // language even when the visible label is Khmer.
        keywords: `${dict.nav[key]} ${link.label} ${link.href}`,
        icon: link.href === "/blog" ? <BookIcon /> : <HashIcon />,
        run: () =>
          router.push(
            link.href === "/blog"
              ? localizeNavHref(link.href, lang)
              : localizeHref(link.href, lang),
          ),
      };
    });

    const isDark = resolvedTheme === "dark";

    const generalActions: IAction[] = [
      {
        id: "theme",
        group: "general",
        label: cp.toggleTheme,
        keywords: "theme dark light mode toggle appearance",
        icon: <ThemeIcon />,
        shortcut: isDark ? "☀" : "☾",
        keepOpen: true,
        run: () => setTheme(isDark ? "light" : "dark"),
      },
      {
        id: "copy-email",
        group: "general",
        label: copied ? cp.emailCopied : cp.copyEmail,
        keywords: `email copy contact ${siteConfig.email}`,
        icon: copied ? <CheckIcon /> : <AtIcon />,
        keepOpen: true,
        run: () => {
          navigator.clipboard?.writeText(siteConfig.email);
          setCopied(true);
        },
      },
      {
        id: "resume",
        group: "general",
        label: cp.openResume,
        keywords: "resume cv download curriculum",
        icon: <FileIcon />,
        run: () => window.open(siteConfig.resume, "_blank", "noopener"),
      },
    ];

    const connectActions: IAction[] = [
      {
        id: "github",
        group: "connect",
        label: cp.viewGithub,
        keywords: "github source code repository",
        icon: <GitHubIcon className="w-4 h-4 shrink-0" />,
        run: () => window.open(siteConfig.github, "_blank", "noopener"),
      },
      {
        id: "linkedin",
        group: "connect",
        label: cp.viewLinkedin,
        keywords: "linkedin professional network",
        icon: <LinkedInIcon className="w-4 h-4 shrink-0" />,
        run: () => window.open(siteConfig.linkedin, "_blank", "noopener"),
      },
    ];

    return [...navActions, ...generalActions, ...connectActions];
  }, [lang, dict, router, resolvedTheme, setTheme, cp, copied]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => a.keywords.toLowerCase().includes(q));
  }, [actions, query]);

  // Keep the highlighted row valid as the filtered set shrinks/grows.
  useEffect(() => {
    setActiveIndex((prev) => (prev >= filtered.length ? 0 : prev));
  }, [filtered.length]);

  // Scroll the active row into view when it changes.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const runAction = useCallback(
    (action: IAction | undefined) => {
      if (!action) return;
      action.run();
      if (!action.keepOpen) close();
    },
    [close],
  );

  function onPanelKeyDown(e: ReactKeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        filtered.length ? (i - 1 + filtered.length) % filtered.length : 0,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAction(filtered[activeIndex]);
    }
  }

  const groupLabels: Record<TGroup, string> = {
    nav: cp.groupNav,
    general: cp.groupGeneral,
    connect: cp.groupConnect,
  };
  const groupOrder: TGroup[] = ["nav", "general", "connect"];

  /* -------------------------------- Render UI ------------------------------- */
  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-start justify-center p-4 pt-[14vh] bg-background/70 backdrop-blur-sm"
      role="button"
      tabIndex={-1}
      aria-label={cp.hintClose}
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={cp.open}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onPanelKeyDown}
        className="w-full max-w-xl rounded-lg border border-border bg-popover shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Row */}
        <div className="flex items-center gap-3 px-4 border-b border-border/60">
          <span className="text-primary">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={cp.placeholder}
            aria-label={cp.placeholder}
            className="flex-1 bg-transparent py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <kbd className="hidden sm:block text-[10px] text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm font-mono text-muted-foreground">
              {cp.empty}
            </p>
          ) : (
            groupOrder.map((group) => {
              const items = filtered.filter((a) => a.group === group);
              if (items.length === 0) return null;
              return (
                <div key={group} className="mb-1 last:mb-0">
                  <p className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
                    {groupLabels[group]}
                  </p>
                  <ul>
                    {items.map((action) => {
                      const index = filtered.indexOf(action);
                      const isActive = index === activeIndex;
                      return (
                        <li key={action.id}>
                          <button
                            type="button"
                            data-index={index}
                            onMouseMove={() => setActiveIndex(index)}
                            onClick={() => runAction(action)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-left transition-colors ${
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "text-foreground/90 hover:text-foreground"
                            }`}
                          >
                            <span
                              className={
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }
                            >
                              {action.icon}
                            </span>
                            <span className="flex-1">{action.label}</span>
                            {action.shortcut && (
                              <span className="text-xs text-muted-foreground">
                                {action.shortcut}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border/60 text-[10px] font-mono text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="border border-border/60 rounded px-1">↑↓</kbd>
            {cp.hintNavigate}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-border/60 rounded px-1">↵</kbd>
            {cp.hintSelect}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-border/60 rounded px-1">esc</kbd>
            {cp.hintClose}
          </span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
