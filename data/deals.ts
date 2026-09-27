/**
 * DEALS — edit, add or remove deals here. Each deal is also listed under the
 * "Deals" tab of the online menu and can be added to the cart directly.
 * Prices are placeholders (in site.currency).
 */
import type { MediaKey } from "./media";
import type { MenuItem } from "./menu";

export type Deal = {
  id: string;
  name: string;
  tagline: string;
  includes: string[];
  originalPrice: number;
  price: number;
  image: MediaKey;
  serves?: string;
  /** Optional ribbon, e.g. "Weekends only". */
  ribbon?: string;
  featured?: boolean;
};

export const deals: Deal[] = [
  {
    id: "deal-family-feast",
    name: "Family Feast",
    tagline: "Perfect for family gatherings.",
    includes: ["Chicken Karahi (Full)", "Signature Pulao (Family)", "4 Seekh Kebabs", "6 Naan", "Raita & Salad", "1.5L Soft Drink"],
    originalPrice: 7800,
    price: 6500,
    image: "familyPlatter",
    serves: "Serves 4–5",
    featured: true,
  },
  {
    id: "deal-bbq-combo",
    name: "BBQ Combo",
    tagline: "A selection of grilled favorites.",
    includes: ["2 Chicken Tikka", "4 Seekh Kebabs", "Malai Boti (6 pcs)", "4 Garlic Naan", "Mint Chutney & Salad"],
    originalPrice: 4600,
    price: 3950,
    image: "bbq",
    serves: "Serves 2–3",
  },
  {
    id: "deal-weekend-special",
    name: "Weekend Special",
    tagline: "Limited-time restaurant offer.",
    includes: ["Mutton Karahi (Half)", "2 Chapli Kebabs", "4 Naan", "2 Mango Lassi", "2 Kheer"],
    originalPrice: 5200,
    price: 4450,
    image: "muttonKarahi",
    serves: "Serves 2–3",
    ribbon: "Weekends only",
  },
];

/** Deals expressed as menu items so they work in the menu grid and cart. */
export const dealMenuItems: MenuItem[] = deals.map((d) => ({
  id: d.id,
  name: d.name,
  description: d.includes.join(" · "),
  price: d.price,
  category: "deals",
  image: d.image,
  serving: d.serves,
}));

export const savingsPercent = (d: Deal) => Math.round(((d.originalPrice - d.price) / d.originalPrice) * 100);
