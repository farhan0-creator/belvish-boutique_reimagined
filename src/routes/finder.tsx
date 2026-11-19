import { canonicalLinks, ogUrl } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@/components/Shell";
import { Finder } from "@/components/Finder";

export const Route = createFileRoute("/finder")({
  head: () => ({
    links: canonicalLinks("/finder"),
    meta: [
      ogUrl("/finder"),
      { title: "Fragrance Finder — OLFÉRA" },
      { name: "description", content: "Answer three simple questions and get beginner-friendly fragrance starting points." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Fragrance Finder — OLFÉRA" },
      { property: "og:description", content: "Three questions to find your kind of scent." },
    ],
  }),
  component: () => (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Eyebrow>A small place to start</Eyebrow>
      <h1 className="mt-4 font-display text-6xl">Find your <em>kind of scent.</em></h1>
      <p className="mb-10 mt-3 text-muted-foreground">Tell us a little about the feeling you're after. We'll narrow the edit — not decide for you.</p>
      <Finder />
    </main>
  ),
});
