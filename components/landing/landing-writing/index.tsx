import Link from "next/link";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import { AnimateIn, StaggerIn } from "@/components/utils/animations/animate-in";
import { SectionHeading } from "@/components/landing/section-heading";
import { getLabCatalog } from "@/components/labs/lab-catalog";
import { getAllPosts } from "@/utils/functions/blog";
import { getDictionary, type TLocale } from "@/utils/i18n";

const LATEST_COUNT = 3;

/**
 * "Labs & writing" — the homepage's window into the labs and the blog.
 *
 * Each lab is paired with its write-up: the newest article whose `relatedLab`
 * front matter names it (falling back to a 60-second note), so the pairing
 * lives in the posts rather than in this file. "Latest writing" then shows
 * the newest articles that are NOT already a lab's write-up, so the six cards
 * cover six different pieces and the list updates itself on every new post.
 */
export default async function LandingWriting(props: { lang: TLocale }) {
  const { lang } = props;
  const { writing, labs, blog } = getDictionary(lang);
  const posts = await getAllPosts(lang);
  const articles = posts.filter((post) => post.format !== "note");

  const labCards = getLabCatalog(labs).map((lab) => ({
    ...lab,
    writeUp:
      articles.find((post) => post.relatedLab === lab.path) ??
      posts.find((post) => post.relatedLab === lab.path) ??
      null,
  }));
  const writeUpSlugs = new Set(labCards.map((lab) => lab.writeUp?.slug));
  const latest = articles
    .filter((post) => !writeUpSlugs.has(post.slug))
    .slice(0, LATEST_COUNT);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(lang === "km" ? "km-KH" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section id="writing" className="relative isolate overflow-clip px-6 py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <AnimateIn from="left">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            {writing.eyebrow}
          </p>
        </AnimateIn>
        <SectionHeading
          section="writing"
          className="mt-3 max-w-3xl text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
        >
          {writing.heading}
        </SectionHeading>
        <AnimateIn from="up" distance={24} delay={0.1}>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-field-muted-foreground">
            {writing.blurb}
          </p>
        </AnimateIn>

        {/* Labs */}
        <div className="mt-12 flex items-end justify-between gap-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-field-muted-foreground">
            {writing.labsLabel}
          </h3>
          <SeeAll href={`/${lang}/labs`} label={writing.allLabs} />
        </div>
        <StaggerIn
          from="zoom-in"
          pattern="cascade"
          stagger={0.1}
          className="mt-5 grid gap-4 md:grid-cols-3"
        >
          {labCards.map((lab, index) => {
            const Icon = lab.icon;
            return (
              <article
                key={lab.path}
                className="card-interactive group flex h-full flex-col overflow-clip rounded-lg border border-border/60 bg-card/85 backdrop-blur-sm"
              >
                <div className="relative grid h-44 place-items-center overflow-clip border-b border-border/50 bg-secondary/50 px-5">
                  <span
                    aria-hidden
                    className="absolute -right-12 -top-12 size-32 rounded-full bg-primary/10 blur-3xl"
                  />
                  <span className="absolute left-4 top-4 grid size-9 place-items-center rounded-lg border border-border/60 bg-card/80 text-primary">
                    <Icon aria-hidden data-card-icon className="size-4" />
                  </span>
                  <div aria-hidden data-card-media className="flex w-full scale-[0.82] justify-center">
                    {lab.visual}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                    {lab.featured ?? `${labs.experimental} 0${index + 1}`} · {labs.costFree}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-foreground">{lab.title}</h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {lab.description}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
                    <Link
                      href={`/${lang}${lab.path}`}
                      className="btn-fx btn-fx-primary inline-flex min-h-10 items-center gap-2 rounded-full bg-primary-fill px-4 text-xs font-semibold text-primary-foreground"
                    >
                      {writing.tryLab}
                      <ArrowUpRight aria-hidden data-btn-glyph className="size-3.5" />
                    </Link>
                    {lab.writeUp ? (
                      <Link
                        href={`/${lang}/blog/${lab.writeUp.slug}`}
                        title={lab.writeUp.title}
                        className="inline-flex min-h-10 items-center gap-1.5 text-xs font-semibold text-field-muted-foreground transition-colors hover:text-primary"
                      >
                        <FileText aria-hidden className="size-3.5" />
                        {writing.readWriteUp}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </StaggerIn>

        {/* Writing */}
        {latest.length > 0 ? (
          <>
            <div className="mt-14 flex items-end justify-between gap-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.22em] text-field-muted-foreground">
                {writing.postsLabel}
              </h3>
              <SeeAll href={`/${lang}/blog`} label={writing.allPosts} />
            </div>
            <StaggerIn
              from="up"
              pattern="alternate"
              stagger={0.1}
              className="mt-5 grid gap-4 md:grid-cols-3"
            >
              {latest.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${lang}/blog/${post.slug}`}
                  className="card-interactive group flex h-full flex-col rounded-lg border border-border/60 bg-card/85 p-5 backdrop-blur-sm"
                >
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden className="text-muted-foreground/40">
                      ·
                    </span>
                    <span>
                      {post.readingTime} {blog.minRead}
                    </span>
                    <span className="ml-auto font-semibold text-primary">{post.category}</span>
                  </div>
                  <h4 className="mt-3 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {post.title}
                  </h4>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg border border-primary/15 bg-primary/8 px-2 py-0.5 font-mono text-[10px] text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ArrowRight aria-hidden data-card-arrow className="size-4 shrink-0 text-primary" />
                  </div>
                </Link>
              ))}
            </StaggerIn>
          </>
        ) : null}
      </div>
    </section>
  );
}

function SeeAll({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="btn-fx btn-fx-outline inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border border-border/70 bg-background/55 px-4 text-xs font-semibold text-foreground backdrop-blur-sm hover:border-primary/50 hover:text-primary"
    >
      {label}
      <ArrowRight aria-hidden data-btn-arrow className="size-3.5" />
    </Link>
  );
}
