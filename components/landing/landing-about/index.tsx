import { ArrowUpRight, Compass, Heart, Layers3 } from "lucide-react";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { SplitReveal } from "@/components/utils/animations/split-reveal";
import { getDictionary, type TLocale } from "@/utils/i18n";
import { getSiteConfig } from "@/utils/i18n/content";

export default function LandingAbout({ lang }: { lang: TLocale }) {
  const dict = getDictionary(lang);
  const localized = getSiteConfig(lang);
  const principles = lang === "km"
    ? [
        [Compass, "ភាពច្បាស់លាស់", "បំលែងគំនិតស្មុគស្មាញទៅជាបទពិសោធន៍ដែលងាយយល់។"],
        [Heart, "ការយកចិត្តទុកដាក់", "គ្រប់ព័ត៌មានលម្អិតត្រូវបានគិតពីមនុស្សដែលនឹងប្រើវា។"],
        [Layers3, "គុណភាពយូរអង្វែង", "បង្កើតផលិតផលដែលមានភាពរឹងមាំ និងអាចរីកចម្រើនបាន។"],
      ] as const
    : [
        [Compass, "Clarity", "Turning complicated ideas into experiences that feel immediately understandable."],
        [Heart, "Care", "Considering every detail through the eyes of the people who will use it."],
        [Layers3, "Lasting quality", "Building products with the strength and flexibility to grow over time."],
      ] as const;

  return (
    <section id="about" className="relative overflow-hidden px-6 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <AnimateIn from="up">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-primary">
            {lang === "km" ? "អំពីការងាររបស់ខ្ញុំ" : "About my work"}
          </p>
        </AnimateIn>
        <div className="grid items-start gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16">
          <SplitReveal as="h2" type="lines" className="max-w-lg text-4xl font-semibold leading-[1.02] tracking-[-.04em] text-foreground sm:text-5xl lg:text-6xl">
            {dict.about.heading}
          </SplitReveal>
          <div>
            <StaggerIn from="up" distance={24} stagger={.1} className="space-y-5 text-base leading-relaxed text-field-muted-foreground sm:text-lg">
              {localized.bio.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </StaggerIn>
            <AnimateIn from="up" delay={.18}>
              <a
                href="#contact"
                className="btn-fx btn-fx-outline mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/30 bg-background/55 px-5 text-sm font-semibold text-primary backdrop-blur-sm hover:border-primary/60"
              >
                {lang === "km" ? "សហការជាមួយខ្ញុំ" : "Work with me"}
                <ArrowUpRight aria-hidden data-btn-arrow size={16} />
              </a>
            </AnimateIn>
          </div>
        </div>

        <StaggerIn
          from="up"
          distance={30}
          stagger={.12}
          className="mt-14 grid gap-3 sm:grid-cols-3 lg:mt-16"
        >
          {principles.map(([Icon, title, description], index) => (
            <article
              key={title}
              className="card-interactive group relative isolate flex min-h-60 flex-col overflow-hidden rounded-lg border border-border/55 bg-card/75 p-6 backdrop-blur-sm sm:p-7"
            >
              <span
                aria-hidden
                className="absolute inset-x-6 top-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover:scale-x-100"
              />
              <span
                aria-hidden
                className="absolute -right-12 -top-12 -z-10 size-36 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/10"
              />

              <div className="flex items-center justify-between">
                <span
                  data-card-icon
                  className="flex size-11 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-primary"
                >
                  <Icon aria-hidden size={20} strokeWidth={1.7} />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[.18em] text-primary/75">
                  {lang === "km" ? "គោលការណ៍" : "Principle"} 0{index + 1}
                </span>
              </div>

              <div className="mt-auto pt-10">
                <h3 className="text-xl font-semibold tracking-[-.025em] text-foreground sm:text-2xl">
                  {title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
                <span
                  aria-hidden
                  className="mt-6 block h-px w-8 bg-primary/35 transition-[width,background-color] duration-300 group-hover:w-14 group-hover:bg-primary"
                />
              </div>
            </article>
          ))}
        </StaggerIn>
      </div>
    </section>
  );
}
