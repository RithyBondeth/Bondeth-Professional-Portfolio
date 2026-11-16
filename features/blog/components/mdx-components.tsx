import type { MDXComponents } from "mdx/types";
import {
  Children,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { slugifyHeading } from "@/features/blog/domain/get-table-of-contents";
import { cn } from "@/shared/lib/utils";

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

type ImageProps = ComponentPropsWithoutRef<"img">;

function MdxImage({ alt, ...props }: ImageProps) {
  return (
    // Markdown images have no intrinsic dimensions in the source.
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={alt ?? ""} />
  );
}

function MdxParagraph({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  const items = Children.toArray(children);
  const image = items[0];

  // Markdown wraps a standalone image in a paragraph. Replace the whole
  // paragraph so the figure is valid HTML and inline images can stay inline.
  if (
    items.length === 1 &&
    isValidElement<ImageProps>(image) &&
    image.type === MdxImage
  ) {
    return (
      <figure {...props} className={cn("my-8 not-prose", className)}>
        <MdxImage
          {...image.props}
          className={cn(
            "w-full rounded-lg border border-border bg-card",
            image.props.className,
          )}
        />
        {image.props.alt ? (
          <figcaption className="mt-3 text-center font-mono text-xs text-muted-foreground">
            {image.props.alt}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <p {...props} className={className}>
      {children}
    </p>
  );
}

export const mdxComponents: MDXComponents = {
  h2: (props) => <AnchoredHeading level={2} {...props} />,
  h3: (props) => <AnchoredHeading level={3} {...props} />,
  img: MdxImage,
  p: MdxParagraph,
};
