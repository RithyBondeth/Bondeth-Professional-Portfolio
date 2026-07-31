import { notFound } from "next/navigation";
import { getPostsByTag } from "@/utils/functions/blog";
import { Container } from "@/components/ui/section";
import { PageHeader, PageMain } from "@/components/ui/page-header";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { hasLocale, getDictionary } from "@/utils/i18n";

interface ITagPageProps {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function TagPage({ params }: ITagPageProps) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const { tag, posts } = await getPostsByTag(slug, lang);

  if (!tag) notFound();

  // Strip MDX content before crossing to the client.
  const listPosts = posts.map(
    ({
      slug,
      title,
      date,
      excerpt,
      category,
      tags,
      cover,
      coverAlt,
      readingTime,
    }) => ({
      slug,
      title,
      date,
      excerpt,
      category,
      tags,
      cover,
      coverAlt,
      readingTime,
    }),
  );

  return (
    <PageMain lang={lang}>
      <PageHeader
        label={dict.blog.taggedPrefix}
        title={tag}
        meta={[
          `${listPosts.length} ${
            listPosts.length === 1 ? dict.blog.postSingular : dict.blog.postPlural
          }`,
        ]}
        backHref={`/${lang}/blog`}
        backLabel={dict.blog.backToAll}
      />

      <Container>
        {listPosts.length > 0 ? (
          <BlogExplorer
            posts={listPosts}
            categories={[]}
            tags={[]}
            lang={lang}
            labels={dict.blog}
          />
        ) : (
          <p className="py-20 text-center text-muted-foreground">
            {dict.blog.empty}
          </p>
        )}
      </Container>
    </PageMain>
  );
}
