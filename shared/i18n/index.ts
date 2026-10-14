import { en } from "@/shared/i18n/dictionaries/en";
import { km } from "@/shared/i18n/dictionaries/km";

export const locales = ["en", "km"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function hasLocale(locale: string): locale is Locale {
  return (locales as readonly string[]).includes(locale);
}

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, km };

export function getDictionary(lang: Locale): Dictionary {
  return dictionaries[lang];
}

/**
 * Prefixes an app-internal href with the locale segment.
 * "/#about" -> "/en#about", "/blog" -> "/en/blog", "/" -> "/en"
 */
export function localizeHref(href: string, lang: Locale): string {
  if (href === "/") return `/${lang}`;
  if (href.startsWith("/#")) return `/${lang}${href.slice(1)}`;
  return `/${lang}${href}`;
}
