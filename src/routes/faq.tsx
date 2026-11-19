import { canonicalLinks, ogUrl } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CONTACT } from "@/lib/contact";
import { Eyebrow } from "@/components/Shell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    links: canonicalLinks("/faq"),
    meta: [
      ogUrl("/faq"),
      { title: "Delivery, Cash on Delivery & FAQs — OLFÉRA" },
      { name: "description", content: "Answers about OLFÉRA delivery, Cash on Delivery, authenticity, gift wrapping and order tracking." },
      { property: "og:title", content: "FAQs — OLFÉRA" },
      { property: "og:description", content: "Delivery, Cash on Delivery, authenticity and more." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Faq,
});

const faqs = [
  { q: "How does Cash on Delivery work?", a: "Place your order online with your delivery details. When it arrives, pay the delivery partner in cash. There's no extra fee for Cash on Delivery." },
  { q: "Is delivery really free?", a: "Yes — delivery is free on every order, anywhere in India." },
  { q: "How long will my order take?", a: "We dispatch within 24–48 hours. Most orders arrive within 3–6 working days, depending on your city." },
  { q: "How do I track my order?", a: "Sign in and open My Account to see the live status of every order you placed while signed in. Guest orders can be tracked with the order number from your confirmation and the mobile number you used at checkout." },
  { q: "Are your fragrances authentic?", a: "Every bottle is factory-sealed and sourced directly from the houses we carry. We never sell decants, testers or grey-market stock." },
  { q: "Do you gift wrap?", a: "Every order arrives in our black-and-gold keepsake box. Add a gift message in the delivery notes at checkout and we'll handwrite it." },
  { q: "What is the difference between Eau de Parfum and Extrait de Parfum?", a: "It comes down to how concentrated the perfume oils are. Extrait de Parfum is the richest strength, so it usually lasts longest and sits closer and deeper on skin. Eau de Parfum is a little lighter, still long-lasting, and easier to wear every day. Eau de Toilette is lighter again and suits warm days." },
  { q: "How do I choose a signature fragrance?", a: "Start with a scent family you already enjoy — fresh, citrus, woody, floral, amber or gourmand — then try one or two perfumes from it on skin and live with them for a day. Our Fragrance Finder and Scent Families guide are good places to begin." },
  { q: "Which perfume suits which occasion?", a: "Fresh and citrus scents feel easy for daytime, work and warm weather. Floral and musky scents suit everyday wear and bright days. Woody, amber and spiced scents feel richer and are well suited to evenings out." },
  { q: "Can I change or cancel my order?", a: `Yes, before it ships. Message us on WhatsApp or call ${CONTACT.phoneDisplay} with your order number.` },
];

function Faq() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Eyebrow>Good to know</Eyebrow>
      <h1 className="mt-4 font-display text-6xl font-light">Questions, <em>answered.</em></h1>
      <Accordion type="single" collapsible className="mt-12">
        {faqs.map((f, i) => (
          <AccordionItem key={f.q} value={`q${i}`}>
            <AccordionTrigger className="font-display text-xl hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-12 text-muted-foreground">Still curious? <Link to="/contact" className="text-accent underline underline-offset-4">Contact us</Link> — we're open {CONTACT.hours}.</p>
    </main>
  );
}
