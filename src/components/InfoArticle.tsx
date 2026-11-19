import { Link } from "@tanstack/react-router";
import { Eyebrow } from "@/components/Shell";
import type { InfoPage } from "@/lib/content";

export function InfoArticle({ page, children }: { page: InfoPage; children?: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Eyebrow>{page.eyebrow}</Eyebrow>
      <h1 className="mt-4 font-display text-5xl font-light md:text-6xl">{page.title}</h1>
      <p className="mt-6 text-lg font-light text-muted-foreground">{page.intro}</p>
      {page.sections.map((s) => (
        <section key={s.h} className="mt-12">
          <h2 className="font-display text-3xl font-light">{s.h}</h2>
          {s.p.map((t) => <p key={t} className="mt-3 leading-relaxed text-muted-foreground">{t}</p>)}
        </section>
      ))}
      {children}
      <nav aria-label="Related" className="mt-16 flex flex-wrap gap-4 border-t border-border pt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Link to="/shop" className="hover:text-accent">Explore perfumes</Link>
        <Link to="/finder" className="hover:text-accent">Find your fragrance</Link>
        <Link to="/journal" className="hover:text-accent">Journal</Link>
        <Link to="/contact" className="hover:text-accent">Contact</Link>
      </nav>
    </main>
  );
}
