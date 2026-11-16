export interface PageMeta {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

type Descriptor = Record<string, string>;

/** Head tags for a page. The canonical link is added only when the site address is known. */
export function pageMeta(page: PageMeta, siteUrl: string | undefined): Descriptor[] {
  const tags: Descriptor[] = [
    { title: page.title },
    { name: "description", content: page.description },
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:type", content: "website" },
  ];
  if (page.noindex) tags.push({ name: "robots", content: "noindex, nofollow" });
  if (siteUrl && !page.noindex) {
    const url = siteUrl.replace(/\/$/, "") + (page.path === "/" ? "/" : page.path);
    tags.push(
      { tagName: "link", rel: "canonical", href: url },
      { property: "og:url", content: url },
      { property: "og:image", content: siteUrl.replace(/\/$/, "") + "/logo.jpg" },
    );
  }
  return tags;
}
