import { Link, rootRouteId, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { Banknote, Gift, Heart, Menu, Minus, Plus, ShieldCheck, ShoppingBag, Truck, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { formatINR, type Product } from "@/lib/catalog";
import { CONTACT, whatsappLink } from "@/lib/contact";
import { Newsletter, WishButton } from "@/components/Extras";
import { useAuth } from '@/lib/auth';
import { CompleteRitual, QuickView, SearchPalette } from "@/components/Premium";
import { Button } from '@/components/ui/button';
import { DEFAULT_STORE_SETTINGS, safeAnnouncementHref } from "@/lib/store-settings.functions";

const nav = [
  { to: "/shop", label: "The edit" },
  { to: "/families", label: "Scent families" },
  { to: "/finder", label: "Fragrance finder" },
  { to: "/contact", label: "Contact" },
] as const;

export function useStoreSettings() {
  return useLoaderData({ from: rootRouteId }) ?? DEFAULT_STORE_SETTINGS;
}

function AnnouncementBar() {
  const s = useStoreSettings();
  if (!s.announcement_enabled || !s.announcement_text.trim()) return null;
  const href = safeAnnouncementHref(s.announcement_link);
  const text = s.announcement_text;
  return (
    <div className="relative z-40 border-b border-border bg-secondary text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
      <p className="px-4 py-2">
        {href ? (
          href.startsWith("/") ? <a href={href} className="transition-colors hover:text-accent">{text}</a>
            : <a href={href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-accent">{text}</a>
        ) : text}
      </p>
    </div>
  );
}

/** Admin-managed promotional banner with optional coupon code. Hidden when switched off. */
export function PromoBanner() {
  const s = useStoreSettings();
  if (!s.promo_enabled || (!s.promo_text.trim() && !s.promo_code.trim())) return null;
  return (
    <div className="px-6 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 rounded-[2rem] border border-primary/40 bg-card px-8 py-6 text-center sm:flex-row sm:text-left">
        <p className="font-display text-2xl font-light">{s.promo_text}</p>
        {s.promo_code.trim() && (
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Use code <span className="ml-2 rounded-full border border-primary px-4 py-2 text-sm tracking-[0.25em] text-gold-gradient">{s.promo_code}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export function Header() {
  const { count, setOpen } = useCart();
  const { user } = useAuth();
  const [menu, setMenu] = useState(false);
  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-30 px-3 pt-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-border bg-background/75 px-6 py-3 shadow-lg backdrop-blur-md">
          <button className="md:hidden" onClick={() => setMenu(!menu)} aria-label="Menu">
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link to="/" className="font-display text-2xl tracking-[0.35em]">OLFÉRA</Link>
          <nav className="hidden gap-10 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="transition-colors hover:text-foreground" activeProps={{ className: "text-accent" }}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <div className="hidden items-center gap-2 lg:flex">
              {user ? <Button variant="link" size="sm" asChild><Link to="/account">Account</Link></Button> : <><Button variant="link" size="sm" asChild><Link to="/auth" search={{ signup: false }}>Login</Link></Button><Button variant="link" size="sm" asChild><Link to="/auth" search={{ signup: true }}>Sign up</Link></Button></>}
            </div>
            <Button variant="link" size="sm" asChild className="lg:hidden"><Link to={user ? '/account' : '/auth'} search={user ? {} : { signup: false }} aria-label={user ? 'Account' : 'Login'}>{user ? 'Account' : 'Login'}</Link></Button>
            <SearchPalette />
            <WishlistLink />
            <button onClick={() => setOpen(true)} className="relative flex items-center gap-2 text-xs uppercase tracking-[0.2em]" aria-label="Open bag">
              <ShoppingBag className="h-5 w-5" /> <span className="hidden sm:inline">Bag</span>
              {count > 0 && <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{count}</span>}
            </button>
          </div>
        </div>
        {menu && (
          <nav className="mx-auto mt-2 flex max-w-7xl flex-col rounded-3xl border border-border bg-background/95 px-6 py-4 backdrop-blur-md md:hidden">
            {!user && <Button asChild variant="link" className="justify-start"><Link to="/auth" search={{ signup: true }} onClick={() => setMenu(false)}>Sign up</Link></Button>}
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setMenu(false)} className="py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground">{n.label}</Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

export const promises = [
  { icon: Truck, title: "Free delivery", line: "Across India, in 3–6 working days" },
  { icon: Banknote, title: "Cash on Delivery", line: "Pay in cash when it reaches you" },
  { icon: ShieldCheck, title: "100% authentic", line: "Sourced directly from the houses" },
  { icon: Gift, title: "Complimentary gift wrap", line: "Every order, hand-finished" },
];

export function PromiseStrip() {
  return (
    <div className="px-6 py-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 lg:grid-cols-4">
        {promises.map(({ icon: Icon, title, line }) => (
          <div key={title} className="flex items-center gap-4 rounded-3xl border border-border bg-secondary px-6 py-6">
            <Icon className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.2} />
            <div>
              <p className="font-display text-lg">{title}</p>
              <p className="text-xs text-muted-foreground">{line}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 rounded-t-[3rem] border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl items-center gap-8 border-b border-border px-6 py-14 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">The Olféra letter</p>
          <p className="mt-3 font-display text-4xl font-light">New arrivals and rare launches, <em>first.</em></p>
        </div>
        <Newsletter />
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-3xl tracking-[0.35em]">OLFÉRA</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">A maison of niche and haute parfumerie, curated in India for people who wear scent as a signature.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Shop</p>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-foreground">The full edit</Link></li>
            <li><Link to="/families" className="hover:text-foreground">Scent families</Link></li>
            <li><Link to="/finder" className="hover:text-foreground">Fragrance finder</Link></li>
            <li><Link to="/wishlist" className="hover:text-foreground">Your wishlist</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Help</p>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li><Link to="/account" className="hover:text-foreground">My account &amp; orders</Link></li>
            <li><Link to="/faq" className="hover:text-foreground">Delivery &amp; FAQs</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact us</Link></li>
            <li>Cash on Delivery · Free delivery</li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Client care</p>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            <li><a href={`mailto:${CONTACT.email}`} className="hover:text-foreground">{CONTACT.email}</a></li>
            <li><a href={CONTACT.phoneHref} className="hover:text-foreground">{CONTACT.phoneDisplay}</a></li>
            <li><a href={whatsappLink("Hi OLFÉRA!")} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">WhatsApp us</a></li>
            <li>{CONTACT.hours}</li>
          </ul>
        </div>
      </div>
      <div className="gold-rule mx-auto max-w-7xl opacity-40" />
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Olféra Fragrance. All rights reserved.</p>
        <p>Prices in INR, inclusive of all taxes.</p>
      </div>
    </footer>
  );
}

export function CartDrawer() {
  const { open, setOpen, lines, total, setQty } = useCart();
  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-foreground/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-hidden rounded-l-[2rem] bg-background shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-2xl">Your bag</h2>
          <button onClick={() => setOpen(false)} aria-label="Close bag"><X className="h-5 w-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">Your bag is empty. Take your time.</p>
              <Link to="/shop" onClick={() => setOpen(false)} className="btn-ghost-gold mt-6">Explore the edit</Link>
            </div>
          ) : lines.map((l) => (
            <div key={l.slug} className="flex gap-4 border-b border-border py-4">
              <img src={l.product.images[0]} alt="" className="h-20 w-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="font-display text-lg">{l.product.name}</p>
                <p className="text-xs text-muted-foreground">{l.product.volume} · {l.product.concentration}</p>
                <div className="mt-2 flex items-center gap-3">
                  <button onClick={() => setQty(l.slug, l.qty - 1)} aria-label="Decrease"><Minus className="h-4 w-4" /></button>
                  <span className="text-sm">{l.qty}</span>
                  <button onClick={() => setQty(l.slug, l.qty + 1)} aria-label="Increase"><Plus className="h-4 w-4" /></button>
                  <button onClick={() => setQty(l.slug, 0)} className="ml-auto text-xs uppercase tracking-widest text-muted-foreground underline">Remove</button>
                </div>
              </div>
              <p className="text-sm">{formatINR(l.product.price * l.qty)}</p>
            </div>
          ))}
          <CompleteRitual inBag={lines.map((l) => l.product)} />
        </div>
        {lines.length > 0 && (
          <div className="border-t border-border px-6 py-5">
            <div className="flex justify-between text-sm text-muted-foreground"><span>Delivery</span><span>Free</span></div>
            <div className="mt-2 flex justify-between font-display text-xl"><span>Total</span><span>{formatINR(total)}</span></div>
            <Link to="/checkout" onClick={() => setOpen(false)} className="btn-gold mt-4 w-full">Checkout · Cash on Delivery</Link>
            <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><Banknote className="h-4 w-4" /> Pay in cash when your order arrives</p>
          </div>
        )}
      </aside>
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  return (
    <div className="group relative">
    <Link to="/product/$slug" params={{ slug: p.slug }} className="block">
      <div className="lux-shine relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted">
        <img src={p.images[0]} alt={`${p.name} by ${p.house}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {p.isNew && <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1 text-[10px] uppercase tracking-widest">New</span>}
        <WishButton slug={p.slug} className="absolute right-3 top-3" />
        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); add(p.slug); }} aria-label={`Add ${p.name} to bag`} className="btn-gold absolute inset-x-3 bottom-3 !px-4 !py-3 opacity-100 transition-all duration-500 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"><ShoppingBag className="h-4 w-4" /> Quick add</button>
      </div>
      <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-accent">{p.house} · {p.tier}</p>
      <p className="font-display text-2xl">{p.name}</p>
      <p className="text-sm text-muted-foreground">{p.tags.join(" · ")}</p>
      <p className="mt-1 text-sm">{formatINR(p.price)}</p>
    </Link>
    <QuickView p={p} />
    </div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs uppercase tracking-[0.3em] text-accent">{children}</p>;
}

function WishlistLink() {
  const { slugs } = useWishlist();
  return (
    <Link to="/wishlist" aria-label="Wishlist" className="relative">
      <Heart className="h-5 w-5" />
      {slugs.length > 0 && <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">{slugs.length}</span>}
    </Link>
  );
}
