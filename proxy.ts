import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, hasLocale, type TLocale } from "@/utils/i18n";

/* ---------------------------------- Utils ---------------------------------- */
/**
 * Picks the visitor's locale: cookie preference first (set by the
 * language switcher), then the Accept-Language header, then English.
 */
function getLocale(request: NextRequest): TLocale {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && hasLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  for (const part of acceptLanguage.split(",")) {
    const code = part.split(";")[0].trim().toLowerCase();
    const base = code.split("-")[0];
    if (hasLocale(base)) return base;
  }

  return defaultLocale;
}

/* ---------------------------------- Proxy ----------------------------------- */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip Next internals, API routes, metadata routes, and
    // any path with a file extension (public/ assets).
    "/((?!_next|api|feed\\.xml|sitemap\\.xml|robots\\.txt|.*\\..*).*)",
  ],
};
