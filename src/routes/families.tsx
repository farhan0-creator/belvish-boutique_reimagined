import { canonicalLinks, ogUrl } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { families, products } from "@/lib/catalog";
import { Eyebrow } from "@/components/Shell";

export const Route = createFileRoute("/families")({
  head: () => ({
    links: canonicalLinks("/families"),
    meta: [
      ogUrl("/families"),
      { title: "Scent Families — BELVISH" },
      { name: "description", content: "A beginner's guide to fresh, citrus, woody, floral, amber and gourmand fragrance families." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Scent Families — BELVISH" },
      { property: "og:description", content: "Scent families are a starting point, not a set of rules." },
    ],
  }),
  component: Families,
});

function Families() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <Eyebrow>A language of notes</Eyebrow>
      <h1 className="mt-4 font-display text-6xl">Where would you like <em>to begin?</em></h1>
      <div className="mt-12 divide-y divide-border border-y border-border">
        {families.map((f, i) => {
          const picks = products.filter((p) => p.families.includes(f.name));
          return (
            <div key={f.name} className="grid gap-4 py-10 md:grid-cols-[1fr_2fr]">
              <div>
                <p className="text-xs text-muted-foreground">0{i + 1} / 06</p>
                <h2 className="font-display text-5xl">{f.name}</h2>
                <p className="mt-2 text-muted-foreground">{f.line}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {picks.map((p) => (
                  <Link key={p.slug} to="/product/$slug" params={{ slug: p.slug }} className="rounded-full border border-border px-5 py-2 font-display text-lg hover:border-foreground">{p.name}</Link>
                ))}
                <Link to="/shop" search={{ family: f.name }} className="text-xs uppercase tracking-[0.2em] underline">Browse {f.name}</Link>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
