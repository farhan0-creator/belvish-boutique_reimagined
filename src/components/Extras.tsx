import { useEffect, useState, type FormEvent } from "react";
import { ArrowUp, Heart, Loader2, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/lib/wishlist";
import { whatsappLink } from "@/lib/contact";

export function WishButton({ slug, className = "" }: { slug: string; className?: string }) {
  const { has, toggle } = useWishlist();
  const on = has(slug);
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); toast(on ? "Removed from your wishlist" : "Saved to your wishlist"); }}
      aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
      aria-pressed={on}
      className={`grid h-10 w-10 place-items-center rounded-full bg-background/80 backdrop-blur transition-colors hover:text-accent ${className}`}
    >
      <Heart className={`h-4 w-4 ${on ? "fill-current text-accent" : ""}`} />
    </button>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hi OLFÉRA, I'd like help choosing a fragrance.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="btn-gold fixed bottom-6 right-6 z-40 rounded-full !p-4 shadow-2xl"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

/** Thin gold reading-progress bar plus a back-to-top button. */
export function ScrollHelpers() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const on = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5">
        <div className="h-full origin-left bg-primary transition-transform duration-150" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-24 right-7 z-40 grid h-11 w-11 place-items-center rounded-full border border-border bg-background/80 text-accent shadow-xl backdrop-blur transition-all hover:border-primary ${progress > 0.08 ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </>
  );
}

export function ShareButton({ title }: { title: string }) {
  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title, url }); return; }
      await navigator.clipboard.writeText(url);
      toast("Link copied — share it with someone special");
    } catch { /* user cancelled */ }
  }
  return (
    <button type="button" onClick={share} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent">
      <Share2 className="h-4 w-4" /> Share
    </button>
  );
}

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || v.length > 255) { setState("error"); setMsg("Please enter a valid email."); return; }
    setState("busy");
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: v });
    if (error && error.code !== "23505") { setState("error"); setMsg("Couldn't subscribe right now. Please try again."); return; }
    setState("done"); setMsg(error ? "You're already on the list — thank you." : "Welcome to the list. Expect new arrivals first.");
    setEmail("");
  }

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className="flex gap-2">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} placeholder="Your email" aria-label="Email for newsletter" className="field-lux" />
        <button type="submit" disabled={state === "busy"} className="btn-gold !px-6">
          {state === "busy" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join"}
        </button>
      </div>
      {msg && <p className={`mt-2 text-xs ${state === "error" ? "text-destructive" : "text-accent"}`}>{msg}</p>}
    </form>
  );
}
