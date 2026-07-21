import { siteConfig } from "@/utils/constants/portfolio.constant";
import { SectionBackdrop } from "@/components/utils/animations/section-backdrop";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { Magnetic } from "@/components/utils/animations/magnetic";
import {
  GitHubIcon,
  LinkedInIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
} from "@/components/utils/icons";
import { ArrowRight, Clock3 } from "lucide-react";
import ContactForm from "./contact-form";
import { getDictionary, type TLocale } from "@/utils/i18n";

export default function LandingContact(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section id="contact" className="relative isolate bg-background px-6 py-16 sm:py-20 lg:py-24">
      <SectionBackdrop />

      <div className="mx-auto max-w-6xl">
        {/* Heading Section */}
        <AnimateIn from="left">
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <ScrambleText text="$ contact --init" />
          </p>
        </AnimateIn>

        <SplitReveal
          as="h2"
          type="lines"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4"
        >
          {dict.contact.heading}
        </SplitReveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <AnimateIn from="left" delay={0.1}>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground">
                {dict.contact.blurb}
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 font-mono text-[11px] text-emerald-500">
                <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
                {dict.contact.availability}
              </div>

              <div className="mt-9 rounded-lg border border-border/60 bg-card p-5">
                <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-foreground">
                  <Clock3 aria-hidden className="size-4 text-primary" />
                  {dict.contact.nextHeading}
                </h3>
                <ol className="mt-4 space-y-3">
                  {dict.contact.nextSteps.map((step, index) => (
                    <li
                      key={step}
                      className="flex gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <span className="font-mono text-xs text-primary">
                        0{index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-8 inline-flex min-h-11 items-center gap-2 font-mono text-xs text-primary hover:underline hover:underline-offset-4"
              >
                {dict.contact.directEmail} {siteConfig.email}
                <ArrowRight aria-hidden className="size-3.5" />
              </a>
            </AnimateIn>
          </div>

          {/* Contact Form Section */}
          <AnimateIn from="right" distance={40} blur={4} delay={0.15}>
            <div className="rounded-lg border border-border/60 bg-card p-5 shadow-2xl shadow-black/5 sm:p-7">
              <ContactForm lang={lang} />
            </div>
          </AnimateIn>
        </div>

        {/* Social Links Section */}
        <div className="mt-12 border-t border-border/50 pt-8">
          <StaggerIn
            className="flex gap-4"
            from="zoom-in"
            stagger={0.1}
            delay={0.2}
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
              href={siteConfig.facebook}
              label="Facebook"
              icon={<FacebookIcon className="w-4 h-4" />}
            />
            <SocialLink
              href={siteConfig.instagram}
              label="Instagram"
              icon={<InstagramIcon className="w-4 h-4" />}
            />
            <SocialLink
              href={`mailto:${siteConfig.email}`}
              label="Email"
              icon={<MailIcon className="w-4 h-4" />}
            />
          </StaggerIn>
        </div>
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
    <Magnetic strength={0.45} className="inline-block">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="btn-fx btn-fx-icon w-10 h-10 flex items-center justify-center rounded border border-border/60 text-muted-foreground hover:text-primary hover:border-primary/40"
      >
        {icon}
      </a>
    </Magnetic>
  );
}
