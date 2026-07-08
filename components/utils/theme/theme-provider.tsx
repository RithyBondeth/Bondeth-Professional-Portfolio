"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Class-based theme switching (toggles `dark` on <html>), persisted in
 * localStorage. The site is dark-first, so dark is the default theme.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
