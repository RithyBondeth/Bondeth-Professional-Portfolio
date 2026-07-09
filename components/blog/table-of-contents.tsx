import type { ITableOfContentsItem } from "@/utils/functions/blog/get-table-of-contents";

interface ITableOfContentsProps {
  items: ITableOfContentsItem[];
  label: string;
  mobile?: boolean;
}

function ContentsLinks({ items }: Pick<ITableOfContentsProps, "items">) {
  return (
    <ol className="mt-4 space-y-1.5">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={`block rounded py-1.5 text-sm leading-snug text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
              item.level === 3 ? "pl-4" : ""
            }`}
          >
            {item.title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function TableOfContents({
  items,
  label,
  mobile = false,
}: ITableOfContentsProps) {
  if (items.length === 0) return null;

  if (mobile) {
    return (
      <details className="mb-10 rounded-lg border border-border/60 bg-card/40 px-4 py-3 lg:hidden">
        <summary className="cursor-pointer select-none font-mono text-xs font-medium uppercase tracking-[0.16em] text-foreground">
          {label}
        </summary>
        <nav aria-label={label}>
          <ContentsLinks items={items} />
        </nav>
      </details>
    );
  }

  return (
    <aside className="hidden lg:block">
      <nav
        aria-label={label}
        className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto border-l border-border/60 pl-5"
      >
        <p className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-foreground">
          {label}
        </p>
        <ContentsLinks items={items} />
      </nav>
    </aside>
  );
}
