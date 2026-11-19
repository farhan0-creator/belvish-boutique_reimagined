import { createFileRoute } from "@tanstack/react-router";
import { canonicalLinks, ogUrl } from "@/lib/seo";
import { pages } from "@/lib/content";
import { InfoArticle } from "@/components/InfoArticle";

const page = pages["terms"];

export const Route = createFileRoute("/terms")({
  head: () => ({
    links: canonicalLinks("/terms"),
    meta: [
      ogUrl("/terms"),
      { title: page.seoTitle },
      { name: "description", content: page.description },
      { property: "og:title", content: page.seoTitle },
      { property: "og:description", content: page.description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <InfoArticle page={page} />,
});
