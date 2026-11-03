import { useEffect, useRef, useState } from "react";

/**
 * Layered hero parallax: writes scroll progress (--hp, 0..1) and pointer offset
 * (--hx/--hy, -0.5..0.5) as CSS variables on the element. Styles live in styles.css
 * (.hero-parallax). No React state, so it never re-renders or affects hydration.
 */
export function useHeroParallax<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, mx = 0, my = 0, tx = 0, ty = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height || 1)));
      // ease the pointer so the depth drift feels weighty, not twitchy
      tx += (mx - tx) * 0.12; ty += (my - ty) * 0.12;
      el.style.setProperty("--hp", p.toFixed(4));
      el.style.setProperty("--hx", tx.toFixed(4));
      el.style.setProperty("--hy", ty.toFixed(4));
      if (Math.abs(mx - tx) > 0.001 || Math.abs(my - ty) > 0.001) queue();
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
      queue();
    };
    update();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return ref;
}
import { useRouterState } from "@tanstack/react-router";

/** Brand reveal shown once per browser session. */
export function IntroCurtain() {
  const [phase, setPhase] = useState<"show" | "leave" | "gone">("show");
  useEffect(() => {
    if (sessionStorage.getItem("belvish-intro")) { setPhase("gone"); return; }
    sessionStorage.setItem("belvish-intro", "1");
    const a = setTimeout(() => setPhase("leave"), 1900);
    const b = setTimeout(() => setPhase("gone"), 2900);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, []);
  if (phase === "gone") return null;
  return (
    <div aria-hidden className={`lux-curtain fixed inset-0 z-[200] grid place-items-center bg-background transition-all duration-1000 ${phase === "leave" ? "pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]" : "[clip-path:inset(0_0_0_0)]"}`}>
      <div className="text-center">
        <p className="lux-letters font-display text-5xl tracking-[0.6em] text-gold-gradient md:text-7xl">BELVISH</p>
        <div className="lux-line mx-auto mt-6 h-px w-48 gold-rule" />
        <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-muted-foreground">Maison de Parfum</p>
      </div>
    </div>
  );
}

/** True once React has hydrated this element (lazy page content hydrates after the shell). */
const isHydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber"));

/** Fades sections up as they scroll into view. Content stays visible without JS. */
export function RevealOnScroll() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.setAttribute("data-reveal", "in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    const seen = new WeakSet<Element>();
    let tries = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    // Only touch elements React has already hydrated; otherwise hydration reports a mismatch.
    const scan = () => {
      let pending = false;
      document.querySelectorAll<HTMLElement>("main section, main > div > section, footer").forEach((el) => {
        if (seen.has(el)) return;
        if (!isHydrated(el)) { pending = true; return; }
        seen.add(el);
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        el.setAttribute("data-reveal", "");
        io.observe(el);
      });
      if (pending && ++tries < 40) timer = setTimeout(scan, 100);
    };
    scan();
    return () => { io.disconnect(); if (timer) clearTimeout(timer); };
  }, [path]);
  return null;
}

/** Magnetic gold buttons and 3D-tilting product photos (desktop pointer only, after hydration). */
export function MotionDetails() {
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    const on = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const t = e.target instanceof Element ? e.target : null;
        const m = t?.closest<HTMLElement>(".btn-gold, .btn-ghost-gold") ?? null;
        if (m !== magnet) { magnet?.style.removeProperty("translate"); magnet = m; }
        if (m) {
          const r = m.getBoundingClientRect();
          m.style.translate = `${((e.clientX - r.left) / r.width - 0.5) * 10}px ${((e.clientY - r.top) / r.height - 0.5) * 8}px`;
        }
        const c = t?.closest<HTMLElement>(".lux-shine") ?? null;
        if (c !== tilt) { tilt?.style.removeProperty("transform"); tilt = c; }
        if (c) {
          const r = c.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          c.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * 6}deg) rotateY(${(px - 0.5) * 6}deg)`;
          c.style.setProperty("--mx", `${px * 100}%`);
          c.style.setProperty("--my", `${py * 100}%`);
        }
      });
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => { window.removeEventListener("pointermove", on); cancelAnimationFrame(raf); };
  }, []);
  return null;
}

/** Soft champagne light that follows the pointer on desktop. */
export function CursorGlow() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const on = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => { window.removeEventListener("pointermove", on); cancelAnimationFrame(raf); };
  }, []);
  if (!pos) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
      style={{ background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, color-mix(in oklab, var(--primary) 9%, transparent), transparent 70%)` }}
    />
  );
}

/** Splits a fragrance's notes into a top / heart / base pyramid. */
export function ScentPyramid({ notes }: { notes: string[] }) {
  const n = notes.length;
  const a = Math.max(1, Math.ceil(n / 3));
  const b = Math.max(a + 1, Math.ceil((2 * n) / 3));
  const tiers = [
    { label: "Top", hint: "First impression · minutes", items: notes.slice(0, a), w: "w-2/3" },
    { label: "Heart", hint: "The character · hours", items: notes.slice(a, b), w: "w-5/6" },
    { label: "Base", hint: "The memory · lingers", items: notes.slice(b), w: "w-full" },
  ].filter((t) => t.items.length);
  return (
    <div className="mt-8 rounded-3xl border border-border bg-card/60 p-6 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Olfactory pyramid</p>
      <div className="mt-5 flex flex-col items-center gap-3">
        {tiers.map((t) => (
          <div key={t.label} className={`${t.w} rounded-full border border-border bg-gradient-to-r from-transparent via-primary/10 to-transparent px-5 py-3 text-center`}>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{t.label} · {t.hint}</p>
            <p className="mt-1 font-display text-xl">{t.items.join(" · ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const SEALS = [
  ["100%", "Authentic, sealed"],
  ["Free", "Gift wrapping"],
  ["Free", "Delivery across India"],
  ["COD", "Pay when it arrives"],
];

export function LuxeSeals() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {SEALS.map(([k, v]) => (
        <div key={v} className="rounded-2xl border border-border p-4 text-center">
          <p className="font-display text-2xl text-gold-gradient">{k}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{v}</p>
        </div>
      ))}
    </div>
  );
}
