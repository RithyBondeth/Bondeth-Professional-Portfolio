export interface ITableOfContentsItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export function slugifyHeading(value: string): string {
  return (
    value
      .normalize("NFKC")
      .toLocaleLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function plainHeading(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function getTableOfContents(
  content: string,
): ITableOfContentsItem[] {
  const items: ITableOfContentsItem[] = [];
  const occurrences = new Map<string, number>();
  let insideFence = false;

  for (const line of content.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      insideFence = !insideFence;
      continue;
    }

    if (insideFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const title = plainHeading(match[2]);
    const baseId = slugifyHeading(title);
    const count = occurrences.get(baseId) ?? 0;
    occurrences.set(baseId, count + 1);

    items.push({
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
      title,
      level: match[1].length as 2 | 3,
    });
  }

  return items;
}
