import { educations, trainingCourses } from "@/data/portfolio";
import { AnimateIn, StaggerIn } from "@/components/ui/animate-in";

export default function Education() {
  return (
    <section id="education" className="py-24 px-6 bg-background">
      <div className="max-w-5xl mx-auto">
        <AnimateIn>
          <p className="text-primary font-mono text-sm tracking-widest uppercase">
            Education
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mt-3 mb-12">
            Academic background
          </h2>
        </AnimateIn>

        {/* Degree cards */}
        <StaggerIn className="space-y-6" stagger={0.12} y={30}>
          {educations.map((edu) => (
            <div
              key={edu.degree}
              className="rounded-2xl bg-card border border-border hover:border-accent transition-colors overflow-hidden"
            >
              {/* Header bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-5 border-b border-border/60">
                <div className="flex items-start gap-4">
                  {/* Cap icon */}
                  <div className="mt-0.5 shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <GraduationCapIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold text-lg leading-snug">
                      {edu.degree}
                    </h3>
                    <p className="text-primary text-sm mt-0.5">
                      {edu.institution}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0 pl-14 sm:pl-0">
                  <span className="inline-block text-muted-foreground text-sm font-mono bg-slate-700/50 px-3 py-1 rounded-lg">
                    {edu.period}
                  </span>
                  <p className="text-muted-foreground text-xs mt-1.5 flex items-center gap-1 sm:justify-end">
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
                      <div
                        key={achievement}
                        className="flex items-start gap-2.5"
                      >
                        <TrophyIcon className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                        <span className="text-secondary-foreground text-sm">
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

        {/* Training courses */}
        <AnimateIn delay={0.1}>
          <div className="mt-12">
            <h3 className="text-foreground font-semibold text-lg mb-5 flex items-center gap-2">
              <BookOpenIcon className="w-5 h-5 text-primary" />
              Training Courses
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trainingCourses.map((course) => (
                <div
                  key={course.title}
                  className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-card border border-border/60 hover:border-accent transition-colors"
                >
                  <span className="text-primary-foreground text-sm font-medium">
                    {course.title}
                  </span>
                  <span className="text-muted-foreground text-xs font-mono">
                    {course.institution}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}

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

function BookOpenIcon({ className }: { className?: string }) {
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
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}
