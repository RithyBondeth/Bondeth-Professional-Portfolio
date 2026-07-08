import type { MDXComponents } from "mdx/types";

/* Custom renderers for elements produced by MDX content. Images become framed
   figures with an optional caption drawn from their alt text, so screenshots
   and diagrams inside a post look intentional rather than dumped inline. */
export const mdxComponents: MDXComponents = {
  img: ({ src, alt }) => (
    <figure className="my-8 not-prose">
      {/* Content images have no known dimensions, so a plain img is correct
          here rather than next/image. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={typeof src === "string" ? src : ""}
        alt={alt ?? ""}
        className="w-full rounded-lg border border-border bg-card"
      />
      {alt ? (
        <figcaption className="mt-3 text-center font-mono text-xs text-muted-foreground">
          {alt}
        </figcaption>
      ) : null}
    </figure>
  ),
};
