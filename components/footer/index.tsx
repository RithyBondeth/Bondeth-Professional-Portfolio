"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  siteConfig,
  primaryNavLinks,
} from "@/utils/constants/portfolio.constant";
import { StaggerIn } from "@/components/utils/animations/animate-in";
import { Magnetic } from "@/components/utils/animations/magnetic";
import { MarqueeTrack } from "@/components/utils/animations/marquee-track";
import { scrollToSection } from "@/components/utils/animations/smooth-scroll";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/utils/icons";
import { Logo } from "@/components/utils/icons/logo";
import {
  localizeNavHref,
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

  // See components/navbar/index.tsx for why in-page section links need to
  // go through scrollToSection instead of a plain hash href.
  function handleNavClick(e: React.MouseEvent, href: string) {
    if (!href.startsWith("/#") || !onHome) return;
    e.preventDefault();
    scrollToSection(href.replace("/#", ""));
    history.replaceState(null, "", `/${lang}${href.slice(1)}`);
  }

  /* ---------------------------------- Utils --------------------------------- */
  // Big outline-text sign-off — decorative Latin, duplicated for the -50%
  // marquee loop.
  const signOff = `${siteConfig.name} — ${localized.title} — `;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <footer className="overflow-hidden bg-background border-t border-border/50">
      {/* Giant outline marquee sign-off */}
      <div aria-hidden className="group border-b border-border/40 py-6 select-none">
        <MarqueeTrack direction="rtl" duration={40}>
          {[0, 1].map((copy) => (
            <span
              key={copy}
              className="shrink-0 whitespace-nowrap pr-8 font-code text-6xl font-black uppercase tracking-tight text-transparent [-webkit-text-stroke:1px_var(--border)] transition-[-webkit-text-stroke-color] duration-500 group-hover:[-webkit-text-stroke-color:color-mix(in_oklab,var(--primary)_55%,transparent)] sm:text-7xl"
            >
              {signOff.toUpperCase()}
            </span>
          ))}
        </MarqueeTrack>
      </div>

      {/* Main Content Section */}
      <StaggerIn
        from="up"
        distance={24}
        stagger={0.1}
        className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10"
      >
        {/* Brand Section */}
        <div className="sm:col-span-1 flex flex-col gap-3">
          <div className="flex items-center">
            <Logo className="text-base" />
            <span className="sr-only">{siteConfig.name}</span>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
            {localized.title} {dict.footer.basedIn}
          </p>
          {/* Social Icons Section */}
          <div className="flex items-center gap-2 mt-1">
            <Magnetic strength={0.45} className="inline-block">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 flex items-center justify-center rounded border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <GitHubIcon className="w-3.5 h-3.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.45} className="inline-block">
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 flex items-center justify-center rounded border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
              </a>
            </Magnetic>
            <Magnetic strength={0.45} className="inline-block">
              <a
                href={`mailto:${siteConfig.email}`}
                aria-label="Email"
                className="w-8 h-8 flex items-center justify-center rounded border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                <MailIcon className="w-3.5 h-3.5" />
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Quick Nav Section */}
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground dark:text-muted-foreground/60 text-[10px] font-mono uppercase tracking-[0.2em]">
            {dict.footer.navigation}
          </p>
          <ul className="flex flex-col gap-2">
            {primaryNavLinks.map(({ href }, i) => (
              <li key={href}>
                <Link
                  href={localizeNavHref(href, lang)}
                  onClick={(e) => handleNavClick(e, href)}
                  className="text-muted-foreground hover:text-primary text-xs font-mono transition-colors flex items-center gap-1.5"
                >
                  <span className="text-primary dark:text-primary/30 text-[9px]">
                    0{i + 1}.
                  </span>
                  {dict.nav[navKeyFromHref(href)]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground dark:text-muted-foreground/60 text-[10px] font-mono uppercase tracking-[0.2em]">
            {dict.footer.contact}
          </p>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-muted-foreground hover:text-primary text-xs font-mono transition-colors break-all"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-xs font-mono transition-colors"
              >
                github.com/Rithybondeth
              </a>
            </li>
            <li>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary text-xs font-mono transition-colors"
              >
                linkedin.com/in/rithybondeth
              </a>
            </li>
          </ul>
        </div>
      </StaggerIn>

      {/* Bottom Bar Section */}
      <div className="border-t border-border/40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground dark:text-muted-foreground/50 text-[10px] font-mono">
            <span className="text-muted-foreground dark:text-muted-foreground/30">
              {"/* "}
            </span>
            © {year} {siteConfig.name}. {dict.footer.rights}
            <span className="text-muted-foreground dark:text-muted-foreground/30">
              {" */"}
            </span>
          </p>
          <p className="text-muted-foreground dark:text-muted-foreground/50 text-[10px] font-mono">
            Built with Next.js &amp; Tailwind CSS
            <span className="text-primary dark:text-primary/40 ml-2">
              v1.0.0
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
