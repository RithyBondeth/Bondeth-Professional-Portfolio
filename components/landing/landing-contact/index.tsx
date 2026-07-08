import { siteConfig } from "@/utils/constants/portfolio.constant";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { GitHubIcon, LinkedInIcon, MailIcon } from "@/components/utils/icons";
import ContactForm from "./contact-form";
import { getDictionary, type TLocale } from "@/utils/i18n";

export default function LandingContact(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section id="contact" className="py-24 px-6 bg-card">
      <div className="max-w-2xl mx-auto text-center">
        {/* Heading Section */}
        <AnimateIn>
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <span className="text-muted-foreground">$</span> contact --init
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-4">
            {dict.contact.heading}
          </h2>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <p className="text-muted-foreground text-sm leading-relaxed mb-10 max-w-md mx-auto">
            {dict.contact.blurb}
          </p>
        </AnimateIn>

        {/* Contact Form Section */}
        <AnimateIn delay={0.15}>
          <div className="w-full max-w-md mx-auto mb-10">
            <ContactForm lang={lang} />
          </div>
        </AnimateIn>

        {/* Social Links Section */}
        <StaggerIn
          className="flex justify-center gap-4"
          stagger={0.1}
          delay={0.2}
          y={20}
        >
          <SocialLink
            href={siteConfig.github}
            label="GitHub"
            icon={<GitHubIcon className="w-4 h-4" />}
          />
          <SocialLink
            href={siteConfig.linkedin}
            label="LinkedIn"
            icon={<LinkedInIcon className="w-4 h-4" />}
          />
          <SocialLink
            href={`mailto:${siteConfig.email}`}
            label="Email"
            icon={<MailIcon className="w-4 h-4" />}
          />
        </StaggerIn>
      </div>
    </section>
  );
}

/* --------------------------------- Utilities -------------------------------- */
function SocialLink(props: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  /* ---------------------------------- Props --------------------------------- */
  const { href, label, icon } = props;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 flex items-center justify-center rounded border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
    >
      {icon}
    </a>
  );
}
