import { experiences } from "@/data/portfolio";
import { AnimateIn, StaggerIn } from "@/components/ui/animate-in";

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 bg-slate-800">
      <div className="max-w-5xl mx-auto">
        <AnimateIn>
          <p className="text-blue-400 font-mono text-sm tracking-widest uppercase">
            Experience
          </p>
        </AnimateIn>

        <AnimateIn delay={0.05}>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-12">
            Where I&apos;ve worked
          </h2>
        </AnimateIn>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-700 ml-[7px] hidden sm:block" />

          <StaggerIn className="space-y-10" stagger={0.15} y={30}>
            {experiences.map((exp, i) => (
              <div key={i} className="sm:pl-10 relative">
                <div className="hidden sm:block absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-slate-800 ring-2 ring-blue-500/30" />

                <div className="bg-slate-900 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {exp.role}
                      </h3>
                      <p className="text-blue-400 text-sm">{exp.company}</p>
                    </div>
                    <span className="text-slate-500 text-sm font-mono">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-md font-mono border border-blue-500/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </StaggerIn>
        </div>
      </div>
    </section>
  );
}
