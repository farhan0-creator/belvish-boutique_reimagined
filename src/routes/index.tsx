import { canonicalLinks, ogUrl } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroAsset from "@/assets/hero-lux.jpg.asset.json";
import heroVideoAsset from "@/assets/belvish-hero-spray.mp4.asset.json";
import bloomAsset from "@/assets/journal-bloom.jpg.asset.json";
import atelier from "@/assets/atelier.jpg";
import giftBox from "@/assets/gift-box.jpg";
import ingredients from "@/assets/ingredients.jpg";
import ritual from "@/assets/ritual.jpg";
import atelierVideoAsset from "@/assets/belvish-atelier-move.mp4.asset.json";
import { families, houses, products } from "@/lib/catalog";
import { Eyebrow, ProductCard, PromiseStrip, PromoBanner } from "@/components/Shell";
import { Finder } from "@/components/Finder";
import { assetUrl } from "@/lib/asset-url";
import { useHeroParallax } from "@/components/Luxe";

const hero = assetUrl(heroAsset);
const heroVideo = assetUrl(heroVideoAsset);
const bloom = assetUrl(bloomAsset);

export const Route = createFileRoute("/")({
  head: () => ({
    links: canonicalLinks("/"),
    meta: [
      ogUrl("/"),
      { title: "OLFÉRA — Luxury Niche Perfumes in India | Cash on Delivery" },
      { name: "description", content: "Shop niche and haute parfumerie in India. Free delivery, Cash on Delivery, complimentary gift wrap and a guided fragrance finder." },
      { property: "og:title", content: "OLFÉRA — Find Your Signature Scent" },
      { property: "og:description", content: "Niche and haute parfumerie with free delivery and Cash on Delivery across India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const stats = [
  { n: "14", l: "Signature fragrances" },
  { n: "6", l: "Independent houses" },
  { n: "COD", l: "Free delivery, pay on arrival" },
];

const trust = [
  { h: "Sealed bottles", p: "Full-size, sealed bottles with concentration, notes and size listed on every page.", to: "/authenticity" as const },
  { h: "Free delivery · Cash on Delivery", p: "Free delivery across India. See your parcel before you pay.", to: "/shipping" as const },
  { h: "Help when you need it", p: "Problems with an order? Our returns policy explains what we do.", to: "/returns" as const },
];

function Home() {
  const heroRef = useHeroParallax<HTMLElement>();
  const best = products.filter((p) => p.tier !== "Olféra Study").slice(0, 8);
  const fresh = products.filter((p) => p.isNew);
  return (
    <main>
      {/* Hero */}
      <section ref={heroRef} className="hero-parallax relative -mt-[73px] flex min-h-screen items-end overflow-hidden rounded-b-[3rem]">
        <div className="hero-layer-media absolute inset-0">
          <video src={heroVideo} autoPlay muted loop playsInline poster={hero} ref={(v) => { if (v) v.muted = true; }} className="h-full w-full object-cover object-[80%_50%]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div aria-hidden="true" className="hero-layer-orbs pointer-events-none absolute inset-0">
          <span className="hero-orb hero-orb-a" />
          <span className="hero-orb hero-orb-b" />
          <span className="hero-orb hero-orb-c" />
        </div>
        <div aria-hidden="true" className="hero-layer-dim pointer-events-none absolute inset-0 bg-background" />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40">
          <div className="hero-layer-copy">
            <div className="animate-rise">
              <Eyebrow>Maison de parfum · Curated in India</Eyebrow>
              <h1 className="mt-8 max-w-3xl font-display text-6xl font-light leading-[0.9] sm:text-7xl md:text-8xl">Discover authentic perfumes, find your <em>signature scent.</em></h1>
              <p className="mt-8 max-w-md text-lg font-light text-muted-foreground">Explore premium and designer fragrances with Olféra. Discover fragrance families, understand scent profiles, and find perfumes that suit your personality and lifestyle.</p>
              <div className="mt-12 flex flex-wrap gap-4">
                <Link to="/shop" className="btn-gold">Explore Perfumes <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/finder" className="btn-ghost-gold">Find Your Fragrance</Link>
              </div>
            </div>
          </div>
          <dl className="hero-layer-stats mt-20 grid max-w-xl grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((s) => (
              <div key={s.l}>
                <dt className="font-display text-4xl text-gold-gradient">{s.n}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <PromiseStrip />
      <PromoBanner />

      {/* Houses marquee */}
      <section className="overflow-hidden border-b border-border py-8">
        <div className="flex w-max animate-marquee gap-16 whitespace-nowrap">
          {[...houses, ...houses, ...houses, ...houses].map((h, i) => (
            <span key={i} className="font-display text-3xl italic text-muted-foreground">{h} <span className="ml-16 text-accent">✦</span></span>
          ))}
        </div>
      </section>

      {/* Families */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>A language of notes</Eyebrow>
              <h2 className="mt-4 font-display text-5xl font-light md:text-6xl">Where would you like <em>to begin?</em></h2>
            </div>
            <Link to="/families" className="text-xs uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-8 hover:text-foreground">All scent families</Link>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {families.map((f, i) => (
              <Link key={f.name} to="/shop" search={{ family: f.name }} className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] bg-secondary">
                <img src={f.image} alt={`${f.name} fragrances`} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-1000 group-hover:scale-105 group-hover:opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute bottom-0 p-8">
                  <p className="text-xs tracking-[0.3em] text-accent">0{i + 1} / 06</p>
                  <p className="mt-3 font-display text-5xl font-light md:text-6xl">{f.name}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{f.line}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>Most coveted</Eyebrow>
            <h2 className="mt-4 font-display text-5xl font-light md:text-6xl">The <em>bestsellers.</em></h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-8 hover:text-foreground">See the full edit</Link>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{best.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </section>

      {/* Atelier story */}
      <section className="relative mx-3 mt-24 overflow-hidden rounded-[2.5rem] md:mx-6">
        <video src={assetUrl(atelierVideoAsset)} autoPlay muted loop playsInline poster={atelier} aria-hidden="true" ref={(v) => { if (v) v.muted = true; }} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <div className="max-w-xl">
            <Eyebrow>The atelier</Eyebrow>
            <h2 className="mt-4 font-display text-5xl font-light md:text-7xl">Rare materials, <em>patient hands.</em></h2>
            <p className="mt-8 text-lg font-light leading-relaxed text-muted-foreground">Every bottle we carry is chosen by nose, not by trend. We work with independent perfumers who still age their oud, macerate their orris and hand-pour their extraits — then we bring them to India, sealed and authentic.</p>
            <div className="mt-10 grid grid-cols-2 gap-8">
              <div><p className="font-display text-3xl text-accent">Extrait</p><p className="mt-1 text-sm text-muted-foreground">Up to 30% perfume oil for 12+ hour wear</p></div>
              <div><p className="font-display text-3xl text-accent">Sealed</p><p className="mt-1 text-sm text-muted-foreground">Factory-sealed, batch-coded, guaranteed genuine</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <Eyebrow>Just arrived</Eyebrow>
        <h2 className="mt-4 font-display text-5xl font-light md:text-6xl">New arrivals, <em>in another light.</em></h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{fresh.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </section>

      {/* Ingredients + gifting */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">
        <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-background">
          <img src={ingredients} alt="Saffron, sandalwood, jasmine, oud and vanilla on dark stone" loading="lazy" width={1200} height={1504} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-0 p-10">
            <Eyebrow>From the source</Eyebrow>
            <p className="mt-3 font-display text-4xl font-light md:text-5xl">Saffron, oud, <em>jasmine sambac.</em></p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">Many of our favourite notes begin in India. Discover how they travel the world and return in a bottle.</p>
            <Link to="/families" className="mt-6 inline-block text-xs uppercase tracking-[0.25em] text-accent underline underline-offset-8">Explore the notes</Link>
          </div>
        </div>
        <div className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-background">
          <img src={giftBox} alt="Black and gold Olféra gift box with a crystal perfume bottle" loading="lazy" width={1200} height={1504} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-0 p-10">
            <Eyebrow>The art of gifting</Eyebrow>
            <p className="mt-3 font-display text-4xl font-light md:text-5xl">Wrapped, ribboned, <em>unforgettable.</em></p>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">Every order arrives in our black-and-gold keepsake box with a handwritten note — at no extra cost.</p>
            <Link to="/shop" className="mt-6 inline-block text-xs uppercase tracking-[0.25em] text-accent underline underline-offset-8">Find a gift</Link>
          </div>
        </div>
      </section>

      {/* Finder */}
      <section className="mx-auto max-w-5xl px-6 py-28">
        <Eyebrow>A small place to start</Eyebrow>
        <h2 className="mt-4 font-display text-5xl font-light md:text-6xl">Find your <em>kind of scent.</em></h2>
        <p className="mb-10 mt-3 text-muted-foreground">Tell us a little about the feeling you're after. We'll narrow the collection — not decide for you.</p>
        <Finder />
      </section>

      {/* Ritual banner */}
      <section className="relative mx-3 overflow-hidden rounded-[2.5rem] md:mx-6">
        <img src={ritual} alt="Perfume being spritzed onto a wrist in golden light" loading="lazy" width={1600} height={1072} className="h-[70vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-end px-6">
          <div className="max-w-md text-right">
            <Eyebrow>The ritual</Eyebrow>
            <p className="mt-4 font-display text-5xl font-light md:text-6xl">Pulse points, <em>then patience.</em></p>
            <p className="mt-6 text-muted-foreground">Two sprays on the wrists, one at the neck. Don't rub. Let the heart notes bloom over the next hour — that's the scent people will remember.</p>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="text-center">
          <Eyebrow>Shop with confidence</Eyebrow>
          <h2 className="mt-4 font-display text-5xl font-light md:text-6xl">Clear, <em>honest</em> buying.</h2>
        </div>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {trust.map((t) => (
            <Link key={t.h} to={t.to} className="rounded-[2rem] border border-border bg-card p-8 transition-colors hover:border-accent">
              <h3 className="font-display text-2xl">{t.h}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{t.p}</p>
              <span className="mt-6 inline-block text-xs uppercase tracking-[0.25em] text-accent">Read more</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Journal */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-12 md:grid-cols-2">
        <img src={bloom} alt="Tuberose blossoms and a glass vial in late afternoon sun" loading="lazy" className="aspect-square w-full rounded-[2.5rem] object-cover" />
        <div>
          <Eyebrow>The Olféra journal · A beginner's note</Eyebrow>
          <h2 className="mt-4 font-display text-5xl font-light md:text-6xl">A fragrance is more than its <em>first impression.</em></h2>
          <p className="mt-6 text-muted-foreground">Give it a little time. The bright opening gives way to a quieter heart, then settles close to skin. The best way to know a scent is to live with it.</p>
          <div className="mt-10 flex flex-wrap gap-4"><Link to="/finder" className="btn-ghost-gold">Take the fragrance finder</Link><Link to="/journal" className="btn-ghost-gold">Read the Journal</Link></div>
        </div>
      </section>
    </main>
  );
}
