import { notFound } from "next/navigation";
import {
  getAllCategories,
  getAllPosts,
  getAllTags,
} from "@/utils/functions/blog";
import { Container } from "@/components/ui/section";
import { PageHeader, PageMain } from "@/components/ui/page-header";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { hasLocale, getDictionary } from "@/utils/i18n";

interface IBlogPageProps {
  params: Promise<{ lang: string }>;
}

export default async function BlogPage({ params }: IBlogPageProps) {
  /* ---------------------------------- Utils --------------------------------- */
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const posts = await getAllPosts(lang);
  const categories = await getAllCategories(lang);
  const tags = await getAllTags(lang);

  // Strip MDX content before crossing to the client — the list only needs metadata.
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

  /* -------------------------------- Render UI ------------------------------- */
  return (
    <PageMain lang={lang}>
      <PageHeader
        label={dict.nav.blog}
        title={dict.blog.heading}
        lead={dict.blog.blurb}
        backHref={`/${lang}`}
        backLabel={dict.nav.backToHome}
      >
        <p className="mt-6">
          <a
            href="/feed.xml"
            className="btn-fx link-wipe text-sm text-muted-foreground hover:text-foreground"
          >
            {dict.blog.subscribeRss}
          </a>
        </p>
      </PageHeader>

      <Container>
        {listPosts.length > 0 ? (
          <BlogExplorer
            posts={listPosts}
            categories={categories}
            tags={tags}
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
