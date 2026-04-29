import { siteConfig } from "@/data/portfolio";
import { AnimateIn, StaggerIn } from "@/components/ui/animate-in";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-slate-800">
      <div className="max-w-2xl mx-auto text-center">
        <AnimateIn>
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">
            Contact
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
            Let&apos;s work together
          </h2>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <p className="text-slate-400 leading-relaxed mb-10">
            I&apos;m currently open to new opportunities. Whether you have a
            project in mind, a question, or just want to say hi — my inbox is
            always open.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.15}>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors text-lg"
          >
            Say Hello
          </a>
        </AnimateIn>

        <StaggerIn
          className="mt-12 flex justify-center gap-6"
          stagger={0.1}
          delay={0.2}
          y={20}
        >
          <SocialLink
            href={siteConfig.github}
            label="GitHub"
            icon={<GitHubIcon />}
          />
          <SocialLink
            href={siteConfig.linkedin}
            label="LinkedIn"
            icon={<LinkedInIcon />}
          />
          <SocialLink
            href={`mailto:${siteConfig.email}`}
            label="Email"
            icon={<EmailIcon />}
          />
        </StaggerIn>
      </div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
    >
      {icon}
    </a>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}
