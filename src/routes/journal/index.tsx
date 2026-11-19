import { createFileRoute, Link } from "@tanstack/react-router";
import { canonicalLinks, ogUrl } from "@/lib/seo";
import { articles } from "@/lib/content";
import { Eyebrow } from "@/components/Shell";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    links: canonicalLinks("/journal"),
    meta: [
      ogUrl("/journal"),
      { title: "The Olféra Journal — Perfume Guides & Fragrance Education" },
      { name: "description", content: "Guides on spotting authentic perfume, perfume concentrations, fragrance notes and choosing a signature scent." },
      { property: "og:title", content: "The Olféra Journal" },
      { property: "og:description", content: "Clear, practical fragrance guides from Olféra." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Journal,
});

function Journal() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <Eyebrow>The Olféra Journal</Eyebrow>
      <h1 className="mt-4 font-display text-6xl font-light">Fragrance, <em>explained.</em></h1>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {articles.map((a) => (
          <Link key={a.slug} to="/journal/$slug" params={{ slug: a.slug }} className="group rounded-[2rem] border border-border bg-card p-8 transition-colors hover:border-accent">
            <p className="text-xs uppercase tracking-[0.25em] text-accent">{a.category}</p>
            <h2 className="mt-4 font-display text-3xl font-light group-hover:text-accent">{a.title}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{a.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
