import { canonicalLinks, noindex, ogUrl } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { INDIAN_STATES as STATES, readAddress } from "@/lib/profile";
import { Banknote, CheckCircle2, Loader2, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatINR } from "@/lib/catalog";
import { checkoutSchema, placeCodOrder } from "@/lib/orders.functions";
import { Eyebrow } from "@/components/Shell";
import { whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    links: canonicalLinks("/checkout"),
    meta: [
      ogUrl("/checkout"),
      noindex,
      { title: "Checkout — Cash on Delivery | OLFÉRA" },
      { name: "description", content: "Complete your OLFÉRA order with free delivery across India. Pay in cash when your fragrance arrives." },
      { property: "og:title", content: "Checkout — OLFÉRA" },
      { property: "og:description", content: "Free delivery and Cash on Delivery across India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});


const empty = { customerName: "", phone: "", email: "", addressLine: "", city: "", state: "", pincode: "", notes: "" };
type Form = typeof empty;

function Checkout() {
  const { lines, total, clear } = useCart();
  const place = useServerFn(placeCodOrder);
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [done, setDone] = useState<{ orderNumber: string; total: number; name: string } | null>(null);
  const { user } = useAuth();

  // Signed-in customers start from their saved details; anything already typed is kept.
  useEffect(() => {
    if (!user) return;
    let active = true;
    void supabase.from("profiles").select("name, phone, shipping_address").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (!active || !data) return;
      const a = readAddress(data.shipping_address);
      const saved: Partial<Form> = { customerName: data.name, phone: data.phone, email: user.email ?? "", addressLine: a.line, city: a.city, state: a.state, pincode: a.pincode };
      setForm((f) => {
        const next = { ...f };
        for (const [k, v] of Object.entries(saved) as [keyof Form, string][]) if (!next[k] && v) next[k] = v;
        return next;
      });
    });
    return () => { active = false; };
  }, [user]);

  const set = (k: keyof Form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFailure("");
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof Form, string>> = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof Form] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      const res = await place({ data: { ...parsed.data, lines: lines.map((l) => ({ slug: l.slug, qty: l.qty })) } });
      if (!res.ok) { setFailure(res.error); return; }
      setDone({ orderNumber: res.orderNumber, total: res.total, name: parsed.data.customerName });
      clear();
      window.scrollTo({ top: 0 });
    } catch {
      setFailure("We couldn't place your order just now. Please check your details and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-accent" strokeWidth={1} />
        <Eyebrow>Order placed</Eyebrow>
        <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">Thank you, <em>{done.name.split(" ")[0]}.</em></h1>
        <p className="mt-6 text-muted-foreground">Your order <span className="text-foreground">{done.orderNumber}</span> is confirmed. We'll call you to verify before dispatch.</p>
        <div className="mx-auto mt-10 max-w-sm rounded-[2rem] border border-border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Amount to pay on delivery</p>
          <p className="mt-2 font-display text-4xl text-gold-gradient">{formatINR(done.total)}</p>
          <p className="mt-2 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Banknote className="h-4 w-4" /> Cash on Delivery</p>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href={whatsappLink(`Hi OLFÉRA, I just placed order ${done.orderNumber} (Cash on Delivery).`)} target="_blank" rel="noopener noreferrer" className="btn-gold">Confirm on WhatsApp</a>
          {user ? <Link to="/account" className="btn-ghost-gold">View in My Account</Link> : <Link to="/track" className="btn-ghost-gold">Track this order</Link>}
        </div>
        <Link to="/shop" className="mt-6 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-8">Continue shopping</Link>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="font-display text-5xl font-light">Your bag is <em>empty.</em></h1>
        <p className="mt-4 text-muted-foreground">Add a fragrance to begin checkout.</p>
        <Link to="/shop" className="btn-gold mt-10">Explore the edit</Link>
      </main>
    );
  }

  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <input value={form[k]} onChange={set(k)} className="field-lux mt-2" aria-invalid={!!errors[k]} {...props} />
      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <Eyebrow>Secure checkout</Eyebrow>
      <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">Almost <em>yours.</em></h1>

      <form onSubmit={submit} noValidate className="mt-12 grid gap-12 lg:grid-cols-[1fr_420px]">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-2xl">Contact</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {field("customerName", "Full name", { autoComplete: "name", maxLength: 100 })}
              {field("phone", "Mobile number", { autoComplete: "tel-national", inputMode: "numeric", maxLength: 10, placeholder: "10-digit number" })}
              <div className="sm:col-span-2">{field("email", "Email (optional)", { type: "email", autoComplete: "email", maxLength: 255 })}</div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl">Delivery address</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">{field("addressLine", "House, street, area", { autoComplete: "street-address", maxLength: 300 })}</div>
              {field("city", "City", { autoComplete: "address-level2", maxLength: 80 })}
              <label className="block">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">State</span>
                <select value={form.state} onChange={set("state")} className="field-lux mt-2" aria-invalid={!!errors.state}>
                  <option value="">Select state</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <span className="mt-1 block text-xs text-destructive">{errors.state}</span>}
              </label>
              {field("pincode", "PIN code", { autoComplete: "postal-code", inputMode: "numeric", maxLength: 6 })}
              <div className="sm:col-span-2">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Delivery notes (optional)</span>
                  <textarea value={form.notes} onChange={set("notes")} maxLength={500} rows={3} className="field-lux mt-2" placeholder="Landmark, gift message, preferred time…" />
                </label>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-2xl">Payment</h2>
            <div className="mt-6 flex items-start gap-4 rounded-3xl border border-primary bg-card p-6">
              <span className="mt-1 grid h-5 w-5 place-items-center rounded-full border border-primary"><span className="h-2.5 w-2.5 rounded-full bg-primary" /></span>
              <div>
                <p className="flex items-center gap-2 font-display text-xl"><Banknote className="h-5 w-5 text-accent" /> Cash on Delivery</p>
                <p className="mt-1 text-sm text-muted-foreground">Pay in cash to our delivery partner when your order arrives. No extra fee.</p>
              </div>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-[2rem] border border-border bg-card p-8 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl">Order summary</h2>
          <div className="mt-6 divide-y divide-border">
            {lines.map((l) => (
              <div key={l.slug} className="flex gap-4 py-4">
                <div className="relative">
                  <img src={l.product.images[0]} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">{l.qty}</span>
                </div>
                <div className="flex-1">
                  <p className="font-display text-lg leading-tight">{l.product.name}</p>
                  <p className="text-xs text-muted-foreground">{l.product.volume} · {l.product.concentration}</p>
                </div>
                <p className="text-sm">{formatINR(l.product.price * l.qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatINR(total)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>Free</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Cash on Delivery fee</span><span>Free</span></div>
            <div className="flex justify-between pt-2 font-display text-2xl"><span>Total</span><span>{formatINR(total)}</span></div>
          </div>
          {failure && <p className="mt-4 text-sm text-destructive">{failure}</p>}
          <button type="submit" disabled={busy} className="btn-gold mt-6 w-full">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Placing order</> : <>Place order · {formatINR(total)}</>}
          </button>
          <ul className="mt-6 space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-accent" /> Dispatched in 24–48 hours</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent" /> Sealed, 100% authentic fragrances</li>
          </ul>
        </aside>
      </form>
    </main>
  );
}
