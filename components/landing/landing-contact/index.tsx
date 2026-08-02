import { siteConfig } from "@/utils/constants/portfolio.constant";
import { AnimateIn } from "@/components/utils/animations/animate-in";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { StatusChip } from "@/components/utils/status-chip";
import { ArrowRight, Clock3 } from "lucide-react";
import ContactForm from "./contact-form";
import { getDictionary, type TLocale } from "@/utils/i18n";

export default function LandingContact(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section id="contact" className="relative isolate px-6 py-16 sm:py-20 lg:py-24">
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
              <p className="max-w-xl text-sm leading-7 text-field-muted-foreground">
                {dict.contact.blurb}
              </p>

              <StatusChip className="mt-6">
                {dict.contact.availability}
              </StatusChip>

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
      </div>
    </section>
  );
}
