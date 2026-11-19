import { assetUrl } from "@/lib/asset-url";
import heroAsset from "@/assets/hero-fragrance.jpg.asset.json";
import amberAsset from "@/assets/bottle-amber.jpg.asset.json";
import bloomAsset from "@/assets/journal-bloom.jpg.asset.json";
import noirAsset from "@/assets/p-noir.jpg.asset.json";
import roseAsset from "@/assets/p-rose.jpg.asset.json";
import oudAsset from "@/assets/p-oud.jpg.asset.json";
import figAsset from "@/assets/p-fig.jpg.asset.json";
import irisAsset from "@/assets/p-iris.jpg.asset.json";
import vanillaAsset from "@/assets/p-vanilla.jpg.asset.json";

const hero = assetUrl(heroAsset);
const amber = assetUrl(amberAsset);
const bloom = assetUrl(bloomAsset);
const noir = assetUrl(noirAsset);
const rose = assetUrl(roseAsset);
const oud = assetUrl(oudAsset);
const fig = assetUrl(figAsset);
const iris = assetUrl(irisAsset);
const vanilla = assetUrl(vanillaAsset);

export type Family = "Fresh" | "Citrus" | "Woody" | "Floral" | "Amber" | "Gourmand" | "Musky";
export type Occasion = "Everyday" | "Work" | "A bright day" | "An evening out";

export const families: { name: Family; line: string; image: string }[] = [
  { name: "Fresh", line: "Air, green leaves and clean beginnings", image: fig },
  { name: "Citrus", line: "Bright edges, sunlit peel", image: hero },
  { name: "Woody", line: "A little grounding, a little wild", image: oud },
  { name: "Floral", line: "Petals, but never predictable", image: rose },
  { name: "Amber", line: "Warmth that stays after dark", image: noir },
  { name: "Gourmand", line: "Soft sweetness, beautifully layered", image: vanilla },
];

export type Product = {
  slug: string;
  name: string;
  house: string;
  tier: "Niche" | "Haute Parfumerie" | "Olféra Study";
  tags: string[];
  families: Family[];
  occasions: Occasion[];
  description: string;
  notes: string[];
  concentration: string;
  volume: string;
  price: number;
  images: string[];
  isNew?: boolean;
};

type Seed = Omit<Product, "images"> & { img: string };
const gallery = [noir, rose, oud, fig, iris, vanilla, hero, amber, bloom];
const withGallery = (s: Seed): Product => {
  const { img, ...rest } = s;
  return { ...rest, images: [img, ...gallery.filter((g) => g !== img).slice(0, 2)] };
};

const seeds: Seed[] = [
  { slug: "aurum-extrait", name: "Aurum Extrait", house: "Maison Elysian", tier: "Haute Parfumerie", tags: ["Amber", "Resinous", "Opulent"], families: ["Amber", "Woody"], occasions: ["An evening out"], description: "Liquid gold poured over black marble. Saffron-lit amber, smoked labdanum and a slow trail of ambergris that stays until morning.", notes: ["Saffron", "Labdanum", "Ambergris", "Benzoin"], concentration: "Extrait de Parfum", volume: "100 ml", price: 48500, img: noir },
  { slug: "alba-rose", name: "Alba", house: "Vélora Paris", tier: "Haute Parfumerie", tags: ["Floral", "Powdery", "Luminous"], families: ["Floral", "Musky"], occasions: ["A bright day", "Everyday"], description: "White roses wrapped in silk. A luminous rose de mai softened by cashmere musk — the quiet confidence of couture.", notes: ["Rose de Mai", "Lychee", "Cashmere musk"], concentration: "Eau de Parfum", volume: "75 ml", price: 32800, img: rose },
  { slug: "oud-saffron-royal", name: "Oud Safran Royal", house: "Atelier Qamar", tier: "Haute Parfumerie", tags: ["Woody", "Smoky", "Spiced"], families: ["Woody", "Amber"], occasions: ["An evening out"], description: "Aged Assam oud on a brass tray, saffron threads and curling incense. Dense, regal and unapologetically rare.", notes: ["Assam oud", "Saffron", "Frankincense", "Rose absolute"], concentration: "Extrait de Parfum", volume: "50 ml", price: 56000, img: oud },
  { slug: "figuier-marin", name: "Figuier Marin", house: "Côte Sauvage", tier: "Niche", tags: ["Fresh", "Green", "Milky"], families: ["Fresh", "Citrus"], occasions: ["A bright day", "Everyday", "Work"], description: "A fig tree leaning over the Mediterranean. Green leaf sap, bergamot and sea-salt air over warm limestone.", notes: ["Fig leaf", "Bergamot", "Sea salt", "Coconut milk"], concentration: "Eau de Parfum", volume: "100 ml", price: 21400, img: fig, isNew: true },
  { slug: "iris-poudre-imperial", name: "Iris Poudré Impérial", house: "Maison Orris", tier: "Haute Parfumerie", tags: ["Floral", "Powdery", "Cool"], families: ["Floral", "Musky"], occasions: ["Work", "An evening out"], description: "Orris butter aged for six years, a violet hush and velvet. Cool, buttery and quietly aristocratic.", notes: ["Orris butter", "Violet leaf", "Suede", "Ambrette"], concentration: "Extrait de Parfum", volume: "75 ml", price: 44200, img: iris, isNew: true },
  { slug: "tabac-vanille-noir", name: "Tabac Vanille Noir", house: "Atelier Qamar", tier: "Niche", tags: ["Gourmand", "Boozy", "Warm"], families: ["Gourmand", "Amber"], occasions: ["An evening out"], description: "A leather armchair by the fire: honeyed tobacco leaf, cognac, Madagascan vanilla and dark cacao.", notes: ["Tobacco leaf", "Cognac", "Vanilla", "Cacao"], concentration: "Eau de Parfum", volume: "100 ml", price: 29600, img: vanilla },
  { slug: "solstice-no-04", name: "Solstice No. 04", house: "Olféra", tier: "Olféra Study", tags: ["Citrus", "Warm", "Woody"], families: ["Citrus", "Woody"], occasions: ["A bright day", "Everyday"], description: "The longest light of the year: bright bergamot that slowly warms into dry, sun-baked woods.", notes: ["Bergamot", "Pink pepper", "Cedarwood"], concentration: "Eau de Parfum", volume: "100 ml", price: 19800, img: hero },
  { slug: "sunday-linen", name: "Sunday Linen", house: "Olféra", tier: "Olféra Study", tags: ["Fresh", "Clean", "Musky"], families: ["Fresh", "Musky"], occasions: ["Everyday", "Work"], description: "Sun-warmed linen, an open window and an unhurried morning. Soft, clean and close to skin.", notes: ["Pear", "Iris", "White musk"], concentration: "Eau de Toilette", volume: "100 ml", price: 12800, img: amber },
  { slug: "white-bloom", name: "White Bloom", house: "Olféra", tier: "Olféra Study", tags: ["Floral", "Creamy", "Airy"], families: ["Floral"], occasions: ["A bright day", "An evening out"], description: "Tuberose caught in late afternoon sun, softened with something creamy. A floral that stays light on its feet.", notes: ["Tuberose", "Jasmine sambac", "Sandalwood"], concentration: "Eau de Parfum", volume: "75 ml", price: 17200, img: bloom },
  { slug: "quiet-current", name: "Quiet Current", house: "Côte Sauvage", tier: "Niche", tags: ["Woody", "Musky", "Fresh"], families: ["Woody", "Musky", "Fresh"], occasions: ["Work", "An evening out"], description: "Cool water over smooth stone. A grounded, quietly confident woody musk for long days.", notes: ["Sea salt", "Vetiver", "Ambrette"], concentration: "Eau de Parfum", volume: "100 ml", price: 22500, img: fig },
  { slug: "citrus-study", name: "Citrus Study", house: "Olféra", tier: "Olféra Study", tags: ["Citrus", "Fresh", "Aromatic"], families: ["Citrus", "Fresh"], occasions: ["A bright day", "Everyday", "Work"], description: "A crisp sketch of peel and herbs: lime zest, crushed basil and a breath of neroli.", notes: ["Lime", "Basil", "Neroli"], concentration: "Eau de Toilette", volume: "50 ml", price: 9800, img: hero, isNew: true },
  { slug: "amber-library", name: "Amber Library", house: "Olféra", tier: "Olféra Study", tags: ["Amber", "Gourmand", "Warm"], families: ["Amber", "Gourmand"], occasions: ["An evening out"], description: "Old pages, a low lamp and something sweet by the window. Resinous amber with a soft vanilla glow.", notes: ["Labdanum", "Tonka bean", "Vanilla"], concentration: "Eau de Parfum", volume: "50 ml", price: 11500, img: amber },
  { slug: "nuit-de-jasmin", name: "Nuit de Jasmin", house: "Vélora Paris", tier: "Niche", tags: ["Floral", "Indolic", "Nocturnal"], families: ["Floral", "Amber"], occasions: ["An evening out"], description: "Night-blooming jasmine on a Jaipur terrace, warmed by tuberose and a whisper of black vanilla.", notes: ["Jasmine grandiflorum", "Tuberose", "Black vanilla"], concentration: "Extrait de Parfum", volume: "50 ml", price: 38900, img: bloom, isNew: true },
  { slug: "santal-blanc-mysore", name: "Santal Blanc Mysore", house: "Maison Orris", tier: "Niche", tags: ["Woody", "Creamy", "Serene"], families: ["Woody", "Musky"], occasions: ["Everyday", "Work"], description: "Rare Mysore sandalwood, creamy and meditative, lifted with cardamom and fig milk.", notes: ["Mysore sandalwood", "Cardamom", "Fig milk", "Papyrus"], concentration: "Eau de Parfum", volume: "100 ml", price: 34500, img: oud },
];

export const products: Product[] = seeds.map(withGallery);

export const houses = ["Maison Elysian", "Vélora Paris", "Atelier Qamar", "Maison Orris", "Côte Sauvage", "Olféra Studies"];
export const heroImages = { hero: noir, rose, oud, iris };

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

export function findMatches(family: Family | "", occasion: Occasion | "", budget: number) {
  return products.filter(
    (p) =>
      (!family || p.families.includes(family)) &&
      (!occasion || p.occasions.includes(occasion)) &&
      (!budget || p.price < budget),
  );
}
