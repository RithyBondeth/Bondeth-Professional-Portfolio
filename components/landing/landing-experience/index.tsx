import Image from "next/image";
import { SectionBackdrop } from "@/components/utils/animations/section-backdrop";
import { organizations } from "@/utils/constants/portfolio.constant";
import { IOrganization } from "@/utils/interfaces/portfolio/organization.interface";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { MarqueeTrack } from "@/components/utils/animations/marquee-track";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { DrawLine } from "@/components/utils/animations/draw-line";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getExperiences } from "@/utils/i18n/content";

export default function LandingExperience(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const experiences = getExperiences(lang);
  const recentExperiences = experiences.slice(0, 3);
  const earlierExperiences = experiences.slice(3);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section id="experience" className="relative isolate py-24 px-6 bg-card">
      <SectionBackdrop />

      <div className="max-w-6xl mx-auto">
        {/* Heading Section */}
        <AnimateIn from="zoom-in">
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <ScrambleText text="// experience.json" />
          </p>
        </AnimateIn>

        <SplitReveal
          as="h2"
          type="lines"
          className="text-4xl sm:text-5xl font-bold text-foreground mt-3 mb-12"
        >
          {dict.experience.heading}
        </SplitReveal>

        {/* Timeline Section */}
        <div className="relative">
          {/* Vertical Timeline Line — a faint base rail plus a primary line
              that draws itself downward as the reader travels the timeline */}
          <div className="absolute left-0 top-0 bottom-0 w-px ml-[7px] hidden sm:block">
            <div className="absolute inset-0 bg-border" />
            <DrawLine className="absolute inset-0 bg-primary/60" />
          </div>

          <StaggerIn
            className="space-y-8"
            from="left"
            distance={60}
            blur={4}
            stagger={0.12}
          >
            {recentExperiences.map((exp, i) => (
              <div key={i} className="sm:pl-10 relative">
                {/* Timeline Dot */}
                <div className="hidden sm:flex absolute left-0 top-2 w-3.5 h-3.5 rounded-full bg-primary/20 border border-primary/60 items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>

                <div className="bg-background rounded border border-border/60 p-5 hover:border-primary/25 hover:shadow-[0_0_20px_rgba(34,211,238,0.08)] transition-all duration-300 motion-safe:hover:translate-x-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-foreground font-semibold text-base">
                        {exp.role}
                      </h3>
                      <p className="text-primary text-xs font-mono mt-0.5">
                        {exp.company}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-xs font-mono shrink-0 mt-0.5">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-primary/8 text-primary text-[10px] rounded border border-primary/15 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </StaggerIn>

          {earlierExperiences.length > 0 && (
            <AnimateIn from="up" delay={0.1}>
              <details className="group mt-8 sm:ml-10">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-center gap-2 rounded border border-border/60 bg-background px-4 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary">
                  <span>{dict.experience.earlierRoles}</span>
                  <span
                    aria-hidden
                    className="transition-transform group-open:rotate-180"
                  >
                    ↓
                  </span>
                </summary>
                <div className="mt-4 space-y-4">
                  {earlierExperiences.map((exp) => (
                    <article
                      key={`${exp.role}-${exp.company}`}
                      className="rounded border border-border/60 bg-background p-5"
                    >
                      <div className="flex flex-col justify-between gap-1 sm:flex-row">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            {exp.role}
                          </h3>
                          <p className="mt-0.5 font-mono text-xs text-primary">
                            {exp.company}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {exp.period}
                        </span>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {exp.description}
                      </p>
                    </article>
                  ))}
                </div>
              </details>
            </AnimateIn>
          )}
        </div>
      </div>

      {/* Organization Logo Marquee Section */}
      <AnimateIn from="zoom-out" delay={0.1}>
        <div className="mt-16 pt-12 border-t border-border/40">
          <p className="text-center text-[10px] font-mono text-muted-foreground dark:text-muted-foreground/60 uppercase tracking-[0.2em] mb-8">
            {dict.experience.organizations}
          </p>

          <div className="relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-card to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-card to-transparent z-10 pointer-events-none" />

            <MarqueeTrack direction="rtl" duration={40}>
              {Array.from({ length: 10 }, (_, copy) =>
                organizations.map((org) => (
                  <OrgBadge key={`${copy}-${org.name}`} org={org} />
                )),
              )}
            </MarqueeTrack>
          </div>
        </div>
      </AnimateIn>
    </section>
  );
}

/* --------------------------------- Utilities -------------------------------- */
function OrgBadge(props: { org: IOrganization }) {
  /* ---------------------------------- Props --------------------------------- */
  const { org } = props;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div className="relative flex items-center justify-center px-8 py-5 bg-background/60 border border-border/40 hover:border-primary/20 hover:bg-background/80 transition-all duration-300 shrink-0 select-none group">
      <div className="relative w-20 h-20">
        <Image
          src={org.logo}
          alt={org.name}
          fill
          className="object-contain transition-opacity duration-300 group-hover:opacity-20"
        />
      </div>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-medium text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-3 text-center leading-snug">
        {org.name}
      </span>
    </div>
  );
}
