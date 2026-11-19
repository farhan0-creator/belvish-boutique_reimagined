import { canonicalLinks, ogUrl } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatINR } from "@/lib/catalog";
import { Eyebrow } from "@/components/Shell";

export const Route = createFileRoute("/track")({
  head: () => ({
    links: canonicalLinks("/track"),
    meta: [
      ogUrl("/track"),
      { title: "Track Your Order — OLFÉRA" },
      { name: "description", content: "Check the status of your OLFÉRA Cash on Delivery order with your order number and mobile number." },
      { property: "og:title", content: "Track Your Order — OLFÉRA" },
      { property: "og:description", content: "See where your fragrance is." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Track,
});

const STEPS = ["placed", "confirmed", "shipped", "delivered"] as const;
const LABEL: Record<string, string> = { placed: "Order placed", confirmed: "Confirmed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" };

type Result = { order_number: string; status: string; total: number; created_at: string; city: string; items: unknown };

function Track() {
  const [num, setNum] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState<Result | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr(""); setRes(null);
    if (!/^BLV-[A-Z0-9-]{3,30}$/i.test(num.trim())) return setErr("Enter the order number from your confirmation, e.g. BLV-XXXX-XX.");
    if (!/^[6-9]\d{9}$/.test(phone.trim())) return setErr("Enter the 10-digit mobile number used at checkout.");
    setBusy(true);
    const { data, error } = await supabase.rpc("track_order", { _order_number: num.trim(), _phone: phone.trim() });
    setBusy(false);
    if (error) return setErr("Couldn't look that up right now. Please try again.");
    const row = (data as Result[] | null)?.[0];
    if (!row) return setErr("We couldn't find an order with those details.");
    setRes(row);
  }

  const items = Array.isArray(res?.items) ? (res!.items as { name: string; qty: number }[]) : [];
  const stepIndex = res ? STEPS.indexOf(res.status as (typeof STEPS)[number]) : -1;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Eyebrow>Order status</Eyebrow>
      <h1 className="mt-4 font-display text-6xl font-light">Track your <em>order.</em></h1>
      <form onSubmit={submit} noValidate className="mt-10 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <input value={num} onChange={(e) => setNum(e.target.value)} maxLength={40} placeholder="Order number" aria-label="Order number" className="field-lux" />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={10} inputMode="numeric" placeholder="Mobile number" aria-label="Mobile number" className="field-lux" />
        <button type="submit" disabled={busy} className="btn-gold">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track"}</button>
      </form>
      {err && <p className="mt-4 text-sm text-destructive">{err}</p>}
      {res && (
        <section className="mt-10 rounded-[2rem] border border-border bg-card p-8">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Order</p>
              <p className="font-display text-2xl">{res.order_number}</p>
              <p className="text-sm text-muted-foreground">Placed {new Date(res.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })} · Delivering to {res.city}</p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Pay on delivery</p>
              <p className="font-display text-2xl text-gold-gradient">{formatINR(res.total)}</p>
            </div>
          </div>
          {res.status === "cancelled" ? (
            <p className="mt-8 text-destructive">This order was cancelled. Contact us if this is unexpected.</p>
          ) : (
            <ol className="mt-10 grid grid-cols-4 gap-2">
              {STEPS.map((s, i) => (
                <li key={s} className="text-center">
                  <span className={`mx-auto grid h-9 w-9 place-items-center rounded-full border ${i <= stepIndex ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>
                    {i <= stepIndex ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <p className={`mt-2 text-[10px] uppercase tracking-[0.2em] ${i <= stepIndex ? "text-accent" : "text-muted-foreground"}`}>{LABEL[s]}</p>
                </li>
              ))}
            </ol>
          )}
          {items.length > 0 && (
            <ul className="mt-8 space-y-1 border-t border-border pt-6 text-sm text-muted-foreground">
              {items.map((i) => <li key={i.name}>{i.qty} × {i.name}</li>)}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
