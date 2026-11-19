import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Truck } from "lucide-react";
import { formatINR, products } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { Eyebrow, ProductCard } from "@/components/Shell";
import { ShareButton, WishButton } from "@/components/Extras";
import { addWorkingDays, useRecentlyViewed } from "@/lib/recent";
import { whatsappLink } from "@/lib/contact";
import { LuxeSeals, ScentPyramid } from "@/components/Luxe";
import { abs, canonicalLinks, ogUrl } from "@/lib/seo";
import { Crumbs, ScentProfile, StickyBuyBar, ZoomImage } from "@/components/Premium";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const p = products.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData, params }) => ({
    links: loaderData ? canonicalLinks(`/product/${params.slug}`) : [],
    meta: loaderData
      ? [
          ogUrl(`/product/${params.slug}`),
          { title: `${loaderData.name} — OLFÉRA` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: `${loaderData.name} — OLFÉRA` },
          { property: "og:description", content: loaderData.description },
          { property: "og:type", content: "product" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Fragrance unavailable — OLFÉRA" }, { name: "robots", content: "noindex" }],
    scripts: loaderData
      ? [{
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: loaderData.name,
            brand: { "@type": "Brand", name: loaderData.house },
            description: loaderData.description,
            category: loaderData.families.join(", "),
            url: abs(`/product/${params.slug}`),
            ...(loaderData.images[0]?.startsWith("http") ? { image: loaderData.images } : {}),
            offers: { "@type": "Offer", priceCurrency: "INR", price: loaderData.price, url: abs(`/product/${params.slug}`) },
          }),
        }, {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
              { "@type": "ListItem", position: 2, name: "The edit", item: abs("/shop") },
              { "@type": "ListItem", position: 3, name: loaderData.name, item: abs(`/product/${params.slug}`) },
            ],
          }),
        }]
      : [],
  }),
  component: ProductPage,
});

function ProductPage() {
  const p = Route.useLoaderData();
  const { add } = useCart();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const recent = useRecentlyViewed(p.slug);
  const [eta, setEta] = useState("");
  const buyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fmt = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    const now = new Date();
    setEta(`${fmt(addWorkingDays(now, 3))} – ${fmt(addWorkingDays(now, 6))}`);
    setImg(0); setQty(1);
  }, [p.slug]);
  const family = products.filter((x) => x.slug !== p.slug && x.families.some((f) => p.families.includes(f)));
  const nearby = [...family, ...products.filter((x) => x.slug !== p.slug && !x.families.some((f) => p.families.includes(f)))].slice(0, 3);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <Crumbs p={p} />
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <ZoomImage key={img} src={p.images[img] ?? p.images[0] ?? ""} alt={`${p.name} still life ${img + 1}`} />
          <div className="mt-4 grid grid-cols-3 gap-3">
            {p.images.map((src, i) => (
              <button key={i} onClick={() => setImg(i)} className={`overflow-hidden rounded-2xl border-2 ${i === img ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt={`${p.name} view ${i + 1}`} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div className="md:pt-8">
          <Eyebrow>{p.house} · {p.tier}</Eyebrow>
          <h1 className="mt-4 font-display text-6xl font-light md:text-7xl">{p.name}</h1>
          <p className="mt-2 text-muted-foreground">{p.tags.join(" · ")}</p>
          <p className="mt-6 text-lg">{p.description}</p>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">A few notes</p>
          <div className="mt-3 flex flex-wrap gap-2">{p.notes.map((n) => <span key={n} className="rounded-full border border-border px-5 py-2 font-display text-lg">{n}</span>)}</div>
          <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6 text-sm">
            <div><dt className="text-muted-foreground">Concentration</dt><dd className="mt-1 font-medium">{p.concentration}</dd></div>
            <div><dt className="text-muted-foreground">Volume</dt><dd className="mt-1 font-medium">{p.volume}</dd></div>
            <div><dt className="text-muted-foreground">Price</dt><dd className="mt-1 font-medium">{formatINR(p.price)}</dd></div>
          </dl>
          <div ref={buyRef} className="mt-8 flex gap-4">
            <div className="flex items-center gap-4 rounded-full border border-border px-5">
              <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus className="h-4 w-4" /></button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(10, qty + 1))} aria-label="Increase"><Plus className="h-4 w-4" /></button>
            </div>
            <button onClick={() => add(p.slug, qty)} className="btn-gold flex-1">Add to bag</button>
            <WishButton slug={p.slug} className="!h-auto !w-14 !rounded-full border border-border" />
          </div>
          {eta && (
            <p className="mt-5 flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 text-sm">
              <Truck className="h-4 w-4 shrink-0 text-accent" /> Order today, arrives <span className="text-accent">{eta}</span>
            </p>
          )}
          <p className="mt-4 text-xs text-muted-foreground">Free delivery across India · Cash on Delivery · Dispatched in 24–48 hours.</p>
          <div className="mt-3"><ShareButton title={`${p.name} — OLFÉRA`} /></div>
          <a href={whatsappLink(`Hi OLFÉRA, I have a question about ${p.name} (${p.volume}).`)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs uppercase tracking-[0.2em] text-accent underline underline-offset-8">Ask about this fragrance on WhatsApp</a>
          <ScentPyramid notes={p.notes} />
          <ScentProfile p={p} />
          <LuxeSeals />
          <div className="mt-8 rounded-3xl bg-secondary p-6">
            <p className="font-display text-xl">Wear it your way</p>
            <p className="mt-2 text-sm text-muted-foreground">Try it on skin and give the notes a little room to unfold. Your experience may vary with skin and setting.</p>
          </div>
        </div>
      </div>
      <section className="mt-24">
        <Eyebrow>Keep your nose curious</Eyebrow>
        <h2 className="mt-4 font-display text-5xl">A few nearby <em>notes.</em></h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">{nearby.map((x) => <ProductCard key={x.slug} p={x} />)}</div>
      </section>
      {recent.length > 0 && (
        <section className="mt-24">
          <Eyebrow>Picking up where you left off</Eyebrow>
          <h2 className="mt-4 font-display text-5xl">Recently <em>viewed.</em></h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{recent.map((x) => <ProductCard key={x.slug} p={x} />)}</div>
        </section>
      )}
      <StickyBuyBar p={p} qty={qty} target={buyRef} />
    </main>
  );
}
