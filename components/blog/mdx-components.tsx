import type { MDXComponents } from "mdx/types";
import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { slugifyHeading } from "@/utils/functions/blog/get-table-of-contents";

function getTextContent(node: ReactNode): string {
  return Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return getTextContent(child.props.children);
      }

      return "";
    })
    .join("");
}

function AnchoredHeading({
  level,
  children,
  ...props
}: ComponentPropsWithoutRef<"h2"> & { level: 2 | 3 }) {
  const id = slugifyHeading(getTextContent(children));
  const Heading = `h${level}` as "h2" | "h3";

  return (
    <Heading id={id} className="group scroll-mt-28" {...props}>
      <a
        href={`#${id}`}
        className="no-underline transition-colors hover:text-primary"
      >
        {children}
        <span
          aria-hidden
          className="ml-2 text-primary opacity-0 transition-opacity group-hover:opacity-60 group-focus-within:opacity-60"
        >
          #
        </span>
      </a>
    </Heading>
  );
}

/* Custom renderers for elements produced by MDX content. Images become framed
   figures with an optional caption drawn from their alt text, so screenshots
   and diagrams inside a post look intentional rather than dumped inline. */
export const mdxComponents: MDXComponents = {
  h2: (props) => <AnchoredHeading level={2} {...props} />,
  h3: (props) => <AnchoredHeading level={3} {...props} />,
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
