import { canonicalLinks, ogUrl } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { families, products } from "@/lib/catalog";
import { Eyebrow, ProductCard, PromoBanner } from "@/components/Shell";

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): { family?: string | undefined } => ({ family: typeof s["family"] === "string" ? s["family"] : undefined }),
  head: () => ({
    links: canonicalLinks("/shop"),
    meta: [
      ogUrl("/shop"),
      { title: "The Edit — OLFÉRA Fragrance Catalog" },
      { name: "description", content: "Browse the full OLFÉRA fragrance edit with scent notes and INR prices. Search, filter by scent family and sort by price." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "The Edit — OLFÉRA Fragrance Catalog" },
      { property: "og:description", content: "Every fragrance in the edit, with notes and prices." },
    ],
  }),
  component: Shop,
});

type Sort = "featured" | "low" | "high" | "new";

function Shop() {
  const { family } = Route.useSearch();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    let l = family ? products.filter((p) => p.families.includes(family as never)) : products;
    if (term) l = l.filter((p) => [p.name, p.house, ...p.notes, ...p.tags].join(" ").toLowerCase().includes(term));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "new") l = [...l].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    return l;
  }, [family, q, sort]);
  const tab = (f?: string) => `rounded-full border px-5 py-2 text-xs uppercase tracking-[0.2em] ${family === f ? "border-primary bg-primary text-primary-foreground" : "border-border"}`;
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <Eyebrow>The considered edit</Eyebrow>
      <h1 className="mt-4 font-display text-6xl">The full <em>edit.</em></h1>
      <div className="-mx-6"><PromoBanner /></div>
      <div className="mt-10 flex flex-wrap gap-2">
        <Link to="/shop" search={{}} className={tab(undefined)}>All</Link>
        {families.map((f) => <Link key={f.name} to="/shop" search={{ family: f.name }} className={tab(f.name)}>{f.name}</Link>)}
      </div>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} maxLength={60} placeholder="Search by name, house or note — try oud, rose, vanilla" aria-label="Search fragrances" className="field-lux !pl-11" />
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort" className="field-lux sm:!w-56">
          <option value="featured">Featured</option>
          <option value="new">New arrivals first</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">{list.length} fragrance{list.length === 1 ? "" : "s"}</p>
      {list.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">Nothing matches that search. Try a single note like "jasmine".</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      )}
    </main>
  );
}
