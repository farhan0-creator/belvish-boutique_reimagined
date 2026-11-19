import { createFileRoute, notFound } from "@tanstack/react-router";
import { abs, canonicalLinks, ogUrl } from "@/lib/seo";
import { articles } from "@/lib/content";
import { InfoArticle } from "@/components/InfoArticle";

export const Route = createFileRoute("/journal/$slug")({
  loader: ({ params }) => {
    const article = articles.find((a) => a.slug === params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData: a, params }) => a ? ({
    links: canonicalLinks(`/journal/${params.slug}`),
    meta: [
      ogUrl(`/journal/${params.slug}`),
      { title: a.seoTitle },
      { name: "description", content: a.description },
      { property: "og:title", content: a.seoTitle },
      { property: "og:description", content: a.description },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify([
        { "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.description, author: { "@type": "Organization", name: "Olféra Editorial" }, publisher: { "@type": "Organization", name: "Olféra" }, mainEntityOfPage: abs(`/journal/${params.slug}`) },
        { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
          { "@type": "ListItem", position: 2, name: "Journal", item: abs("/journal") },
          { "@type": "ListItem", position: 3, name: a.title, item: abs(`/journal/${params.slug}`) },
        ] },
      ]),
    }],
  }) : {},
  component: ArticlePage,
});

function ArticlePage() {
  const a = Route.useLoaderData();
  return <InfoArticle page={a}><p className="mt-12 text-xs uppercase tracking-[0.2em] text-muted-foreground">By Olféra Editorial</p></InfoArticle>;
}
