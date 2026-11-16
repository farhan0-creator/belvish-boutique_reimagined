import { canonicalLinks, noindex, ogUrl } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/lib/catalog";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";
import { Eyebrow, ProductCard } from "@/components/Shell";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    links: canonicalLinks("/wishlist"),
    meta: [
      ogUrl("/wishlist"),
      noindex,
      { title: "Your Wishlist — BELVISH" },
      { name: "description", content: "The fragrances you've saved at BELVISH." },
      { property: "og:title", content: "Your Wishlist — BELVISH" },
      { property: "og:description", content: "Fragrances saved for later." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { slugs } = useWishlist();
  const { add } = useCart();
  const list = products.filter((p) => slugs.includes(p.slug));
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <Eyebrow>Saved for later</Eyebrow>
      <h1 className="mt-4 font-display text-6xl font-light">Your <em>wishlist.</em></h1>
      {list.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">Tap the heart on any fragrance to keep it here.</p>
          <Link to="/shop" className="btn-gold mt-8">Explore the edit</Link>
        </div>
      ) : (
        <>
          <button onClick={() => list.forEach((p) => add(p.slug, 1))} className="btn-ghost-gold mt-8">Add all to bag</button>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        </>
      )}
    </main>
  );
}
