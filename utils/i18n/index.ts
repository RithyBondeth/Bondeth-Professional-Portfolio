import { en } from "./dictionaries/en";
import { km } from "./dictionaries/km";

/* --------------------------------- Locales ---------------------------------- */
export const locales = ["en", "km"] as const;
export type TLocale = (typeof locales)[number];
export const defaultLocale: TLocale = "en";

export function hasLocale(locale: string): locale is TLocale {
  return (locales as readonly string[]).includes(locale);
}

/* ------------------------------- Dictionaries ------------------------------- */
export type TDictionary = typeof en;

const dictionaries: Record<TLocale, TDictionary> = { en, km };

export function getDictionary(lang: TLocale): TDictionary {
  return dictionaries[lang];
}

/* ---------------------------------- Helpers --------------------------------- */
/**
 * Prefixes an app-internal href with the locale segment.
 * "/#about" -> "/en#about", "/blog" -> "/en/blog", "/" -> "/en"
 */
export function localizeHref(href: string, lang: TLocale): string {
  if (href === "/") return `/${lang}`;
  if (href.startsWith("/#")) return `/${lang}${href.slice(1)}`;
  return `/${lang}${href}`;
}

export function localizeNavHref(href: string, lang: TLocale): string {
  return localizeHref(href, lang);
}
