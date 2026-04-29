import { siteConfig, navLinks } from "@/data/portfolio";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/ui/icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand */}
        <div className="sm:col-span-1 flex flex-col gap-3">
          <span className="text-white font-bold text-lg tracking-tight">
            {siteConfig.name}
          </span>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
            {siteConfig.title} based in Phnom Penh, Cambodia.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-3 mt-1">
            <a
              href={siteConfig.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            >
              <GitHubIcon className="w-4 h-4" />
            </a>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-blue-400 hover:border-slate-500 transition-colors"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              aria-label="Email"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
            >
              <MailIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick nav */}
        <div className="flex flex-col gap-3">
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
            Navigation
          </p>
          <ul className="flex flex-col gap-2">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-slate-500 hover:text-white text-sm transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">
            Contact
          </p>
          <ul className="flex flex-col gap-2">
            <li>
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-slate-500 hover:text-white text-sm transition-colors break-all"
              >
                {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white text-sm transition-colors"
              >
                github.com/bondeth
              </a>
            </li>
            <li>
              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white text-sm transition-colors"
              >
                linkedin.com/in/rithybondeth
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-slate-600 text-xs">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-slate-700 text-xs font-mono">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
