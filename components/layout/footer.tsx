import Image from "next/image";
import { siteConfig, navLinks } from "@/data/portfolio";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="sm:col-span-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.webp"
              alt={siteConfig.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-foreground font-bold text-lg tracking-tight">
              {siteConfig.name}
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            {siteConfig.title} based in Phnom Penh, Cambodia.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-1">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-card border border-border text-muted-foreground hover:text-primary hover:border-accent transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Email"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
            >
              <MailIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick nav */}
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">
            Navigation
          </p>
          <ul className="flex flex-col gap-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-xs font-mono uppercase tracking-widest">
            Contact
          </p>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors break-all"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                github.com/bondeth
              </a>
            </li>
            <li>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                linkedin.com/in/rithybondeth
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs font-mono">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
