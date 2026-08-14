"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import {
  siteConfig,
  primaryNavLinks,
} from "@/utils/constants/portfolio.constant";
import { scrollToSection } from "@/components/utils/animations/smooth-scroll";
import {
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  YouTubeIcon,
  MailIcon,
} from "@/components/utils/icons";
import { Logo } from "@/components/utils/icons/logo";
import {
  localizeHref,
  getDictionary,
  type TLocale,
  type TDictionary,
} from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

/* ---------------------------------- Utils ---------------------------------- */
function navKeyFromHref(href: string): keyof TDictionary["nav"] {
  return href.replace("/#", "").replace("/", "") as keyof TDictionary["nav"];
}

export default function Footer(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const localized = getSiteConfig(lang);

  /* ---------------------------------- Utils --------------------------------- */
  const pathname = usePathname();
  const onHome = pathname === `/${lang}`;
  const year = new Date().getFullYear();

  // Match the navbar's animated same-page section navigation.
  function handleNavClick(e: React.MouseEvent, href: string) {
    if (!href.startsWith("/#") || !onHome) return;
    e.preventDefault();
    scrollToSection(href.replace("/#", ""));
    history.replaceState(null, "", `/${lang}${href.slice(1)}`);
  }

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <footer className="relative overflow-hidden border-t border-border/55 bg-card/20 [--muted-foreground:var(--field-muted-foreground)]">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_75%_0%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_58%)]" />

      <div className="relative mx-auto max-w-6xl px-6 pt-12 sm:pt-16">
        <div className="flex flex-col gap-6 rounded-3xl border border-border/65 bg-background/65 p-6 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
              {dict.footer.ctaEyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {dict.footer.ctaTitle}
            </h2>
          </div>
          <Link
            href={`/${lang}#contact`}
            onClick={(event) => handleNavClick(event, "/#contact")}
            className="btn-fx btn-fx-primary inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-fill px-5 py-3 font-mono text-xs font-semibold text-primary-foreground"
          >
            {dict.footer.ctaAction}
            <ArrowUpRight data-btn-glyph aria-hidden className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-12 sm:py-14 lg:grid-cols-[1.45fr_0.75fr_0.75fr_1fr] lg:gap-12">
          <div className="col-span-2 lg:col-span-1">
            <Link href={`/${lang}`} aria-label={siteConfig.name} className="inline-flex">
              <Logo className="text-base" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-field-muted-foreground">
              {localized.title} {dict.footer.basedIn}
            </p>
            <p className="mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
              {dict.footer.availability}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {[
                { href: siteConfig.github, label: "GitHub", Icon: GitHubIcon },
                { href: siteConfig.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
                { href: siteConfig.facebook, label: "Facebook", Icon: FacebookIcon },
                { href: siteConfig.instagram, label: "Instagram", Icon: InstagramIcon },
                { href: siteConfig.youtube, label: "YouTube", Icon: YouTubeIcon },
              ].map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="btn-fx btn-fx-icon grid size-9 place-items-center rounded-xl border border-border/65 bg-background/45 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  <Icon data-btn-glyph className="size-3.5" />
                </a>
              ))}
              <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="btn-fx btn-fx-icon grid size-9 place-items-center rounded-xl border border-border/65 bg-background/45 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                <MailIcon data-btn-glyph className="size-3.5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {dict.footer.navigation}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {primaryNavLinks
                .filter(({ href }) => !["/labs", "/blog"].includes(href))
                .map(({ href }) => (
                  <li key={href}>
                    <Link href={localizeHref(href, lang)} onClick={(event) => handleNavClick(event, href)} className="text-xs text-field-muted-foreground transition-colors hover:text-primary">
                      {dict.nav[navKeyFromHref(href)]}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {dict.footer.resources}
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li><Link href={`/${lang}/projects`} className="text-field-muted-foreground transition-colors hover:text-primary">{dict.nav.projects}</Link></li>
              <li><Link href={`/${lang}/labs`} className="text-field-muted-foreground transition-colors hover:text-primary">{dict.nav.labs}</Link></li>
              <li><Link href={`/${lang}/blog`} className="text-field-muted-foreground transition-colors hover:text-primary">{dict.nav.blog}</Link></li>
              <li><Link href={`/${lang}/resume`} className="text-field-muted-foreground transition-colors hover:text-primary">{dict.footer.resume}</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {dict.footer.contact}
            </h3>
            <a href={`mailto:${siteConfig.email}`} className="mt-4 inline-block break-all text-sm font-medium text-foreground underline decoration-primary/35 underline-offset-4 transition-colors hover:text-primary">
              {siteConfig.email}
            </a>
            <p className="mt-3 font-mono text-[10px] leading-5 text-muted-foreground">
              {dict.footer.location}
            </p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-border/45 px-6 pb-24 pt-5 sm:py-5">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>© {year} {siteConfig.name}. {dict.footer.rights}</span>
            <Link href={`/${lang}/privacy`} className="transition-colors hover:text-primary">{dict.footer.privacy}</Link>
            <Link href={`/${lang}/terms`} className="transition-colors hover:text-primary">{dict.footer.terms}</Link>
          </div>
          <p>{dict.footer.madeWithCare}</p>
        </div>
      </div>
    </footer>
  );
}
