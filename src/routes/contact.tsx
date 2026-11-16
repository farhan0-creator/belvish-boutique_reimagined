import { canonicalLinks, ogUrl } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import ritual from "@/assets/ritual.jpg";
import { CONTACT, whatsappLink } from "@/lib/contact";
import { Eyebrow } from "@/components/Shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    links: canonicalLinks("/contact"),
    meta: [
      ogUrl("/contact"),
      { title: "Contact BELVISH — WhatsApp, Phone & Email" },
      { name: "description", content: "Reach BELVISH fragrance client care on WhatsApp, phone or email. Open 12:00 pm to 12:00 am, every day." },
      { property: "og:title", content: "Contact BELVISH" },
      { property: "og:description", content: "WhatsApp, call or email our fragrance advisors — open noon to midnight daily." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const cards = [
    { icon: MessageCircle, title: "WhatsApp", value: CONTACT.phoneDisplay, href: whatsappLink("Hi BELVISH, I'd like some help."), cta: "Start a chat", external: true },
    { icon: Phone, title: "Call us", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref, cta: "Call now", external: false },
    { icon: Mail, title: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, cta: "Write to us", external: false },
  ];
  return (
    <main>
      <section className="relative mx-3 overflow-hidden rounded-b-[2.5rem] md:mx-6">
        <img src={ritual} alt="Perfume being applied to a wrist" width={1600} height={1072} className="h-[45vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10">
          <Eyebrow>Client care</Eyebrow>
          <h1 className="mt-4 font-display text-6xl font-light md:text-7xl">We'd love to <em>hear from you.</em></h1>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-6 py-16">
        <p className="flex items-center gap-3 text-muted-foreground"><Clock className="h-5 w-5 text-accent" /> Open {CONTACT.hours}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, value, href, cta, external }) => (
            <a key={title} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group rounded-[2rem] border border-border bg-card p-8 transition-colors hover:border-primary">
              <Icon className="h-7 w-7 text-accent" strokeWidth={1.2} />
              <p className="mt-6 font-display text-3xl">{title}</p>
              <p className="mt-2 break-all text-muted-foreground">{value}</p>
              <p className="mt-6 text-xs uppercase tracking-[0.25em] text-accent underline underline-offset-8">{cta}</p>
            </a>
          ))}
        </div>
        <p className="mt-12 max-w-2xl text-muted-foreground">Not sure which fragrance to choose? Send us a message on WhatsApp with a scent you already love, and our advisors will suggest three to try.</p>
      </section>
    </main>
  );
}
