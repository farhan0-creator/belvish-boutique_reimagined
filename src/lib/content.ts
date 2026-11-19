// Static editorial content: brand info pages and Journal guides.
export type Section = { h: string; p: string[] };
export type InfoPage = { slug: string; eyebrow: string; title: string; seoTitle: string; description: string; intro: string; sections: Section[] };
export type Article = InfoPage & { category: string };

const contactLine = "WhatsApp, phone or email — details are on our Contact page.";

export const pages: Record<string, InfoPage> = {
  about: {
    slug: "about", eyebrow: "About Olféra", title: "A fragrance discovery destination.",
    seoTitle: "About Olféra — Premium Fragrance Discovery in India",
    description: "Olféra is an online fragrance store in India that helps people explore scent families, understand notes and find a signature perfume.",
    intro: "Olféra is a premium fragrance retailer and discovery destination in India. We help people explore perfumes, understand scent profiles and find fragrances that suit their personality, preferences and lifestyle.",
    sections: [
      { h: "What Olféra offers", p: ["A curated edit of niche and designer-style fragrances in Extrait de Parfum, Eau de Parfum and Eau de Toilette strengths, each listed with its fragrance family, top, heart and base notes, bottle size and price in rupees."] },
      { h: "How discovery works", p: ["Browse by scent family (woody, floral, citrus, fresh, amber, gourmand and more), filter the full edit, or answer a few questions in the Fragrance Finder. Recommendations only ever come from perfumes we actually stock."] },
      { h: "Who we serve", p: ["Fragrance enthusiasts across India who want clear product information, a calm way to explore, and a simple way to buy — with free delivery and Cash on Delivery."] },
      { h: "Our approach", p: ["Transparent product details, plain language, no invented ratings or claims. If you have a question about a perfume, ask us before you buy. " + contactLine] },
    ],
  },
  authenticity: {
    slug: "authenticity", eyebrow: "Trust", title: "Authenticity & sourcing.",
    seoTitle: "Authenticity & Sourcing — Olféra",
    description: "How Olféra describes its products, what we sell and don't sell, and how to raise any concern about a bottle.",
    intro: "This page explains our own policies. They are company commitments, not independent certifications.",
    sections: [
      { h: "What we sell", p: ["Sealed full-size bottles as listed on each product page. We do not sell decants, testers or refilled bottles."] },
      { h: "Product information", p: ["Every product page shows the concentration, fragrance family, notes, bottle size and price. Structured data given to search engines matches what you see on the page."] },
      { h: "Check your bottle on delivery", p: ["With Cash on Delivery you can see the package before paying. If the seal, box or bottle looks wrong, contact us straight away with your order number and photos. " + contactLine] },
      { h: "Secure checkout", p: ["Payment is Cash on Delivery — no card details are collected online. Order prices are recalculated on our server, so totals can't be altered in the browser."] },
    ],
  },
  shipping: {
    slug: "shipping", eyebrow: "Policy", title: "Shipping policy.",
    seoTitle: "Shipping Policy — Free Delivery Across India | Olféra",
    description: "Olféra delivery times, charges and order tracking. Free delivery on every order across India.",
    intro: "How and when your Olféra order reaches you.",
    sections: [
      { h: "Charges", p: ["Delivery is free on every order, anywhere in India. Cash on Delivery carries no extra fee."] },
      { h: "Timelines", p: ["Orders are dispatched within 24–48 hours. Most arrive within 3–6 working days depending on your city."] },
      { h: "Tracking", p: ["Signed-in customers see live order status in My Account. Guest orders can be tracked with the order number and checkout mobile number on the Track Order page."] },
      { h: "Changes and cancellations", p: ["You can change or cancel an order before it ships. " + contactLine] },
    ],
  },
  returns: {
    slug: "returns", eyebrow: "Policy", title: "Returns & refunds.",
    seoTitle: "Return & Refund Policy — Olféra",
    description: "How to cancel an Olféra order and what to do if an item arrives damaged or incorrect.",
    intro: "Because perfume is a personal-care product, opened bottles can't be resold. Here is how we handle problems.",
    sections: [
      { h: "Before dispatch", p: ["Orders can be cancelled at no cost before they ship."] },
      { h: "Damaged, leaking or incorrect items", p: ["Check your parcel at delivery. If something is damaged, leaking or not what you ordered, contact us as soon as possible with your order number and photos, and we'll arrange a resolution."] },
      { h: "Refusing a delivery", p: ["With Cash on Delivery, if you refuse a parcel at the door nothing is charged."] },
      { h: "Questions", p: [contactLine] },
    ],
  },
  privacy: {
    slug: "privacy", eyebrow: "Policy", title: "Privacy policy.",
    seoTitle: "Privacy Policy — Olféra",
    description: "What personal information Olféra collects, why, and how it's protected.",
    intro: "We collect only what we need to deliver your order and run your account.",
    sections: [
      { h: "What we collect", p: ["Name, mobile number, email and delivery address you enter at checkout or in My Account; your order history; and your email if you join the newsletter. Your bag, wishlist and recently viewed list are stored only in your own browser."] },
      { h: "How we use it", p: ["To process and deliver orders, show your order status, respond to your messages and — if you subscribed — send newsletter emails. We don't sell your data."] },
      { h: "Protection", p: ["Accounts are protected by secure sign-in. Customers can only see their own profile and orders; store-wide data is visible only to the store owner."] },
      { h: "Your choices", p: ["You can edit your details in My Account or ask us to delete your account and data. " + contactLine] },
    ],
  },
  terms: {
    slug: "terms", eyebrow: "Policy", title: "Terms & conditions.",
    seoTitle: "Terms & Conditions — Olféra",
    description: "The terms for using the Olféra website and placing orders.",
    intro: "By using this website and placing an order, you agree to these terms.",
    sections: [
      { h: "Orders and prices", p: ["Prices are in Indian rupees and inclusive of taxes. An order is confirmed once placed; we may cancel it if an item is unavailable or details can't be verified, and will tell you if so."] },
      { h: "Payment", p: ["Orders are paid by Cash on Delivery to the delivery partner."] },
      { h: "Product information", p: ["We aim to describe every fragrance accurately. How a perfume smells and lasts varies with skin, climate and application."] },
      { h: "Contact", p: [contactLine] },
    ],
  },
};

export const articles: Article[] = [
  {
    slug: "how-to-identify-authentic-perfumes-online", category: "Authenticity", eyebrow: "Authenticity",
    title: "How to identify authentic perfumes when buying online.",
    seoTitle: "How to Identify Authentic Perfumes Online — Olféra Journal",
    description: "Practical checks for spotting genuine perfume online: seller details, price, packaging, batch codes and the bottle itself.",
    intro: "Counterfeit fragrance is common online. A few simple checks before and after buying reduce the risk considerably.",
    sections: [
      { h: "Check the seller first", p: ["A trustworthy store shows real contact details, clear shipping and return policies, and full product information — concentration, size and notes. Missing or vague details are a warning sign."] },
      { h: "Be wary of very low prices", p: ["A big-name fragrance at a fraction of its usual price is rarely genuine. Compare the price per millilitre across several retailers."] },
      { h: "Inspect packaging and batch codes", p: ["Genuine boxes are crisply printed and tightly wrapped. A batch code is usually printed or etched on both the box and the bottle base, and the two should match."] },
      { h: "Look at the bottle and juice", p: ["Check for even glass, a straight, well-fitted cap and a fine, consistent spray. Colour should be uniform, without sediment."] },
      { h: "Use Cash on Delivery when unsure", p: ["Paying on delivery lets you see the parcel before you pay. Read more about our own commitments on the Authenticity page."] },
    ],
  },
  {
    slug: "eau-de-toilette-vs-eau-de-parfum", category: "Fragrance education", eyebrow: "Fragrance education",
    title: "Eau de Toilette vs Eau de Parfum vs Extrait.",
    seoTitle: "Eau de Toilette vs Eau de Parfum vs Extrait — Olféra Journal",
    description: "What perfume concentrations mean, how they differ in strength and longevity, and which to choose.",
    intro: "The name on the bottle describes how much perfume oil is dissolved in alcohol. Higher concentration usually means a richer, longer-lasting scent.",
    sections: [
      { h: "Typical concentrations", p: ["Eau de Toilette: roughly 5–15% perfume oil. Eau de Parfum: roughly 15–20%. Extrait de Parfum: roughly 20–40%. Exact figures vary by house."] },
      { h: "Longevity and projection", p: ["An EDT is lighter and fades sooner — good for daytime and warm weather. An EDP lasts longer and suits everyday wear. An Extrait is the richest and tends to sit closer to skin for many hours."] },
      { h: "Which should you choose?", p: ["Choose by occasion and climate rather than strength alone. Each Olféra product page lists its concentration and a typical wear guide."] },
    ],
  },
  {
    slug: "understanding-top-heart-base-notes", category: "Fragrance education", eyebrow: "Fragrance education",
    title: "Understanding top, heart and base notes.",
    seoTitle: "Top, Heart and Base Notes Explained — Olféra Journal",
    description: "How a perfume unfolds over time, from the first spray to the dry-down, and why you should wait before judging a scent.",
    intro: "A perfume changes as it evaporates. Perfumers describe this in three stages.",
    sections: [
      { h: "Top notes", p: ["What you smell first, for roughly the first 15 minutes: light, bright materials like citrus, herbs and pepper."] },
      { h: "Heart notes", p: ["The character of the scent, appearing as the top fades and lasting a few hours: florals, spices and fruits."] },
      { h: "Base notes", p: ["The long dry-down: woods, amber, musk, vanilla and resins that can last all day."] },
      { h: "Why it matters", p: ["Judge a fragrance after at least an hour on skin, not from the first spray. Every Olféra product page lists its notes by stage."] },
    ],
  },
  {
    slug: "how-to-choose-a-signature-fragrance", category: "Perfume discovery", eyebrow: "Perfume discovery",
    title: "How to find a fragrance that matches you.",
    seoTitle: "How to Choose a Signature Fragrance — Olféra Journal",
    description: "A simple method to choose a perfume by fragrance family, occasion and season.",
    intro: "Finding a signature scent is easier with a method than with guesswork.",
    sections: [
      { h: "Start with what you already like", p: ["Think of scents you enjoy — fresh laundry, citrus, sandalwood, roses, vanilla. Each points to a fragrance family: fresh, citrus, woody, floral or gourmand."] },
      { h: "Match the occasion", p: ["Fresh and citrus scents suit daytime and heat. Florals and musks are easy everyday choices. Woody, amber and spiced scents feel richer for evenings."] },
      { h: "Test on skin", p: ["Wear one scent at a time for a full day and notice how it changes."] },
      { h: "Use the Fragrance Finder", p: ["Answer a few questions and the Finder narrows our collection to perfumes that share your preferences."] },
    ],
  },
];
