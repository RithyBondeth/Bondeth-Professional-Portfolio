import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags } from "@/utils/functions/blog";
import { Container } from "@/components/ui/section";
import { PageHeader, PageMain } from "@/components/ui/page-header";
import { Reveal } from "@/components/utils/animations/reveal";
import { hasLocale, getDictionary } from "@/utils/i18n";

interface ITagsPageProps {
  params: Promise<{ lang: string }>;
}

/**
 * The tag index — a printed subject index: one tag per line, its post count
 * set right, divided by hairlines. The old wrap of coloured pills gave every
 * tag equal visual weight and no sense of which ones actually have depth.
 */
export default async function TagsPage({ params }: ITagsPageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const tags = await getAllTags(lang);

  return (
    <PageMain lang={lang}>
      <PageHeader
        label={dict.nav.blog}
        title={dict.blog.allTagsHeading}
        lead={dict.blog.allTagsBlurb}
        backHref={`/${lang}/blog`}
        backLabel={dict.blog.backToAll}
      />

      <Container>
        {tags.length > 0 ? (
          <ul className="border-t border-rule">
            {tags.map((t, i) => (
              <li key={t.slug}>
                <Reveal delay={Math.min(i, 8) * 40}>
                  <Link
                    href={`/${lang}/blog/tags/${t.slug}`}
                    className="group flex items-baseline justify-between gap-8 border-b border-rule py-4 outline-none focus-visible:bg-secondary"
                  >
                    <span className="text-lg text-foreground transition-colors group-hover:text-marker">
                      {t.tag}
                    </span>
                    <span className="eyebrow numeral">{t.count}</span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            {dict.blog.empty}
          </p>
        )}
      </Container>
    </PageMain>
  );
}
