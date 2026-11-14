import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AnimateIn, StaggerIn } from "@/shared/components/motion/animate-in";
import { SectionHeading } from "@/features/portfolio/components/section-heading";
import { getDictionary, type Locale } from "@/shared/i18n";
import { getRecognitions } from "@/features/portfolio/data/localized-content";

export default function LandingRecognition(props: { lang: Locale }) {
  const { lang } = props;
  const { recognition: copy } = getDictionary(lang);
  const items = getRecognitions(lang);

  if (items.length === 0) return null;

  return (
    <section
      id="recognition"
      className="relative isolate px-6 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Heading Section */}
        <div className="max-w-2xl">
          <AnimateIn from="zoom-in">
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.25em] text-primary">
              {copy.eyebrow}
            </p>
          </AnimateIn>
          <SectionHeading
            section="recognition"
            className="mt-3 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
          >
            {copy.heading}
          </SectionHeading>
          <AnimateIn from="up" delay={0.1}>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {copy.blurb}
            </p>
          </AnimateIn>
        </div>

        {/* Recognition Cards */}
        <div className="mt-10 space-y-8">
          {items.map((item) => {
            // The certificate leads the thumbnail strip so it's never more
            // than one tap away, even though the ceremony photo is the cover.
            const thumbnails = [item.certificate, ...item.photos];

            return (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg border border-border/60 bg-card"
              >
                <div className="grid lg:grid-cols-[1.35fr_1fr]">
                  {/* Photos */}
                  <div className="border-border/50 p-3 sm:p-4 lg:border-r">
                    <AnimateIn from="rise" distance={40}>
                      <a
                        href={item.cover.src}
                        target="_blank"
                        rel="noopener"
                        className="group block overflow-hidden rounded-md"
                      >
                        <Image
                          src={item.cover.src}
                          width={item.cover.width}
                          height={item.cover.height}
                          alt={item.cover.alt}
                          sizes="(min-width: 1152px) 640px, (min-width: 1024px) 56vw, 100vw"
                          className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.02]"
                        />
                        <span className="sr-only">{copy.openImage}</span>
                      </a>
                    </AnimateIn>

                    <StaggerIn
                      className="mt-3 grid grid-cols-4 gap-2 sm:gap-3"
                      from="up"
                      distance={20}
                      stagger={0.08}
                    >
                      {thumbnails.map((image, index) => (
                        <a
                          key={image.src}
                          href={image.src}
                          target="_blank"
                          rel="noopener"
                          className="group relative block aspect-[3/4] overflow-hidden rounded-md border border-border/50 bg-muted"
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            sizes="(min-width: 1024px) 150px, 25vw"
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          {index === 0 && (
                            <span className="absolute inset-x-1 bottom-1 truncate rounded bg-background/85 px-1.5 py-0.5 text-center font-mono text-[10px] text-foreground backdrop-blur-sm">
                              {copy.certificateLabel}
                            </span>
                          )}
                          <span className="sr-only">{copy.openImage}</span>
                        </a>
                      ))}
                    </StaggerIn>
                  </div>

                  {/* Details */}
                  <StaggerIn
                    className="flex flex-col gap-5 p-6 sm:p-8"
                    from="right"
                    distance={24}
                    stagger={0.08}
                  >
                    <p className="font-mono text-[11px] uppercase leading-5 tracking-[0.18em] text-primary">
                      {item.issuer}
                    </p>

                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-2 font-mono text-xs text-muted-foreground">
                        <time dateTime={item.date}>{item.dateLabel}</time>
                        {" · "}
                        {item.location}
                      </p>
                    </div>

                    {item.metric && (
                      <div className="rounded-lg border border-primary/20 bg-primary/5 px-5 py-4">
                        <p className="text-3xl font-bold tabular-nums text-foreground">
                          {item.metric.value}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {item.metric.label}
                        </p>
                      </div>
                    )}

                    <p className="text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </p>

                    {item.link && (
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-fx btn-fx-primary inline-flex min-h-11 items-center gap-2 self-start rounded-lg bg-primary-fill px-4 font-mono text-xs font-medium text-primary-foreground"
                      >
                        {item.link.label}
                        <ArrowUpRight aria-hidden className="size-3.5" />
                      </a>
                    )}
                  </StaggerIn>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
