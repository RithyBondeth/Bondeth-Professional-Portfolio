import Image from "next/image";
import { organizations } from "@/utils/constants/portfolio.constant";
import { IOrganization } from "@/utils/interfaces/portfolio";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { EarlierRoles } from "@/components/landing/landing-experience/earlier-roles";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { DrawLine } from "@/components/utils/animations/draw-line";
import { MarqueeTrack } from "@/components/utils/animations/marquee-track";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getExperiences } from "@/utils/i18n/content";

export default function LandingExperience(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const experiences = getExperiences(lang);
  const recentExperiences = experiences.slice(0, 3);
  const earlierExperiences = experiences.slice(3);
  const organizationHalf = organizations;
  const organizationTrack = [...organizationHalf, ...organizationHalf];

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section id="experience" className="relative isolate py-16 sm:py-20 lg:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading Section */}
        <AnimateIn from="zoom-in">
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            {lang === "km" ? "ដំណើរការងារ" : "Career journey"}
          </p>
        </AnimateIn>

        <SplitReveal
          as="h2"
          type="lines"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-12"
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

                {/* Anchored to the timeline rail, so it slides sideways rather
                    than lifting — a vertical lift would drift off its node. */}
                <div className="card-interactive card-interactive-inline rounded-lg border border-border/60 bg-background p-5">
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
                        className="px-2 py-0.5 bg-primary/8 text-primary text-[10px] rounded-lg border border-primary/15 font-mono"
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
              <EarlierRoles
                experiences={earlierExperiences}
                label={dict.experience.earlierRoles}
              />
            </AnimateIn>
          )}
        </div>
      </div>

      {/* Organizations Section */}
      <div className="mx-auto mt-20 w-full">
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/50 py-6 shadow-[0_24px_70px_rgb(0_0_0/.06)] backdrop-blur-sm sm:py-8">
          <div className="mb-5 flex flex-col items-center gap-2 px-6 text-center sm:mb-7">
            <p className="text-sm font-semibold tracking-[-.01em] text-foreground sm:text-base">
              {dict.experience.organizations}
            </p>
            <p className="max-w-xl text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {lang === "km"
                ? "បទពិសោធន៍នៅក្នុងវិស័យសាធារណៈ ការអប់រំ និងក្រុមផលិតផលឌីជីថល។"
                : "Experience across public service, education, and digital product teams."}
            </p>
          </div>

          <MarqueeTrack
            direction="rtl"
            duration={48}
            className="py-2 [mask-image:linear-gradient(to_right,transparent,black_2.5rem,black_calc(100%_-_2.5rem),transparent)] sm:[mask-image:linear-gradient(to_right,transparent,black_6rem,black_calc(100%_-_6rem),transparent)]"
          >
            {organizationTrack.map((org, index) => (
              <OrgBadge key={`${org.name}-${index}`} org={org} />
            ))}
          </MarqueeTrack>

          <p className="mt-5 text-center text-[10px] uppercase tracking-[.15em] text-muted-foreground">
            {lang === "km" ? "ដាក់កណ្ដុរលើដើម្បីផ្អាក" : "Hover to pause"}
          </p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Utilities -------------------------------- */
function OrgBadge(props: { org: IOrganization }) {
  /* ---------------------------------- Props --------------------------------- */
  const { org } = props;

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <div
      tabIndex={0}
      aria-label={org.name}
      className="group relative flex h-32 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/40 bg-background/75 px-4 py-4 text-center shadow-sm outline-none transition-[border-color,background-color,translate,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:border-primary/30 hover:bg-background hover:shadow-[0_14px_30px_rgb(0_0_0/.08)] focus-visible:-translate-y-0.5 focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20 sm:h-36 sm:w-44"
    >
      <div className="relative h-14 w-full max-w-28 transition-[opacity,scale] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-95 group-hover:opacity-0 group-focus-visible:scale-95 group-focus-visible:opacity-0 sm:h-16 sm:max-w-32">
        <Image
          src={org.logo}
          alt={org.name}
          fill
          loading="eager"
          sizes="128px"
          className="object-contain opacity-100"
        />
      </div>
      <span className="pointer-events-none absolute inset-0 flex translate-y-1.5 items-center justify-center px-4 text-xs font-semibold leading-snug text-foreground opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        {org.name}
      </span>
    </div>
  );
}
