import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { ScrambleText } from "@/components/utils/animations/scramble-text";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getEducations } from "@/utils/i18n/content";

export default function LandingEducation(props: { lang: TLocale }) {
  /* ---------------------------------- Props --------------------------------- */
  const { lang } = props;
  const dict = getDictionary(lang);
  const educations = getEducations(lang);

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <section id="education" className="relative isolate py-16 sm:py-20 lg:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading Section */}
        <AnimateIn from="zoom-in">
          <p className="text-primary font-mono text-xs tracking-[0.25em] uppercase mb-1">
            <ScrambleText text="// education.md" />
          </p>
        </AnimateIn>

        <SplitReveal
          as="h2"
          type="lines"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-12"
        >
          {dict.education.heading}
        </SplitReveal>

        {/* Degree Cards Section */}
        <StaggerIn
          className="space-y-5"
          from="right"
          distance={60}
          blur={4}
          stagger={0.12}
        >
          {educations.map((edu) => (
            <div
              key={edu.degree}
              className="card-interactive group rounded border border-border/60 bg-card overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-5 border-b border-border/50">
                <div className="flex items-start gap-4">
                  <div
                    data-card-icon
                    className="mt-0.5 shrink-0 w-9 h-9 rounded border border-primary/20 bg-primary/8 flex items-center justify-center"
                  >
                    <GraduationCapIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-base leading-snug">
                      {edu.degree}
                    </h3>
                    <p className="text-primary text-xs font-mono mt-0.5">
                      {edu.institution}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0 pl-13 sm:pl-0">
                  <span className="inline-block text-muted-foreground text-xs font-mono bg-muted/50 border border-border/50 px-3 py-1 rounded">
                    {edu.period}
                  </span>
                  <p className="text-muted-foreground text-[11px] mt-1.5 flex items-center gap-1 sm:justify-end">
                    <LocationPinIcon className="w-3 h-3" />
                    {edu.location}
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {edu.description}
                </p>
                {edu.achievements.length > 0 && (
                  <div className="space-y-2">
                    {edu.achievements.map((achievement) => (
                      <div key={achievement} className="flex items-start gap-2.5">
                        <TrophyIcon className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-secondary-foreground text-xs">
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </StaggerIn>
      </div>
    </section>
  );
}

/* --------------------------------- Utilities -------------------------------- */
function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 14l9-5-9-5-9 5 9 5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 14l6.16-3.422A12.083 12.083 0 0120 17.75V17a2 2 0 00-2-2H6a2 2 0 00-2 2v.75a12.083 12.083 0 011.84-7.172L12 14z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M12 14v7M5 9.5V17"
      />
    </svg>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.75}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

