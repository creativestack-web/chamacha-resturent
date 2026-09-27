/**
 * ============================================================================
 *  MENU — single source of truth for every dish on the website.
 * ============================================================================
 *  • Prices are indicative placeholders (in site.currency) — replace with the
 *    restaurant's confirmed prices before launch.
 *  • `id` must stay unique and stable: it is what the cart and any future
 *    ordering / POS API use to identify an item.
 *  • `image` refers to a key in data/media.ts.
 *  • Flags: popular, chefsChoice, vegetarian, spicy (0 = none … 3 = hot).
 *  • `available: false` hides the "Add" button (e.g. sold out) without
 *    removing the dish from the menu.
 * ============================================================================
 */
import type { MediaKey } from "./media";

export type CategoryId =
  | "pakistani"
  | "pulao"
  | "karahi"
  | "bbq"
  | "kebabs"
  | "platters"
  | "breads"
  | "beverages"
  | "desserts"
  | "deals";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image: MediaKey;
  /** Optional serving note, e.g. "Half / Full" or "Serves 4–5". */
  serving?: string;
  popular?: boolean;
  chefsChoice?: boolean;
  vegetarian?: boolean;
  spicy?: 0 | 1 | 2 | 3;
  available?: boolean;
};

/** Order of filter tabs. "popular" is a virtual filter built from the `popular` flag. */
export const menuCategories: { id: CategoryId | "popular"; label: string }[] = [
  { id: "popular", label: "Popular" },
  { id: "pakistani", label: "Pakistani Favorites" },
  { id: "pulao", label: "Pulao & Rice" },
  { id: "karahi", label: "Karahi & Handi" },
  { id: "bbq", label: "BBQ & Grill" },
  { id: "kebabs", label: "Kebabs" },
  { id: "platters", label: "Family Platters" },
  { id: "breads", label: "Breads & Sides" },
  { id: "beverages", label: "Beverages" },
  { id: "desserts", label: "Desserts" },
  { id: "deals", label: "Deals" },
];

export const menuItems: MenuItem[] = [
  // ── Pakistani Favorites ───────────────────────────────────────────────
  { id: "chicken-qorma", name: "Chicken Qorma", description: "Slow-cooked chicken in a fragrant yoghurt and fried-onion gravy with warm whole spices.", price: 1450, category: "pakistani", image: "chickenKarahi", spicy: 1 },
  { id: "nihari", name: "Beef Nihari", description: "Overnight-simmered beef shank, finished with ginger, green chilli, lemon and fresh coriander.", price: 1650, category: "pakistani", image: "muttonKarahi", spicy: 2, popular: true },
  { id: "haleem", name: "Haleem", description: "Wheat, lentils and shredded meat cooked low and slow, topped with crisp onions and lemon.", price: 1250, category: "pakistani", image: "muttonKarahi", spicy: 1 },
  { id: "daal-makhani", name: "Daal Makhani", description: "Black lentils simmered overnight with butter and cream for a rich, velvety finish.", price: 850, category: "pakistani", image: "breads", vegetarian: true },
  { id: "aloo-palak", name: "Aloo Palak", description: "Tender potatoes folded through garlicky spiced spinach.", price: 750, category: "pakistani", image: "handi", vegetarian: true, spicy: 1 },

  // ── Pulao & Rice ──────────────────────────────────────────────────────
  { id: "signature-pulao", name: "Signature Pulao", description: "Aromatic long-grain rice cooked in rich yakhni with tender meat, whole spices and golden onions.", price: 1350, category: "pulao", image: "pulao", serving: "Single / Family", popular: true, chefsChoice: true },
  { id: "kabuli-pulao", name: "Kabuli Pulao", description: "Fragrant rice with tender meat, sweet carrots and raisins, finished with toasted almonds.", price: 1450, category: "pulao", image: "pulao" },
  { id: "chicken-biryani", name: "Chicken Biryani", description: "Layered basmati, spiced chicken, saffron and mint — sealed and slow-cooked on dum.", price: 1150, category: "pulao", image: "pulao", spicy: 2, popular: true },
  { id: "matar-pulao", name: "Matar Pulao", description: "Light, buttery rice with green peas, cumin and whole spices.", price: 650, category: "pulao", image: "pulao", vegetarian: true },

  // ── Karahi & Handi ────────────────────────────────────────────────────
  { id: "chicken-karahi", name: "Chicken Karahi", description: "Fresh chicken cooked in a sizzling karahi with tomatoes, green chillies, ginger and coriander.", price: 1850, category: "karahi", image: "chickenKarahi", serving: "Half / Full", spicy: 2, popular: true },
  { id: "mutton-karahi", name: "Mutton Karahi", description: "Tender mutton finished in the wok with cracked black pepper, tomatoes and fresh ginger.", price: 3200, category: "karahi", image: "muttonKarahi", serving: "Half / Full", spicy: 2, popular: true, chefsChoice: true },
  { id: "white-karahi", name: "Chicken White Karahi", description: "A creamy, milder karahi with yoghurt, black pepper and fresh cream.", price: 1950, category: "karahi", image: "chickenKarahi", spicy: 1 },
  { id: "makhni-handi", name: "Chicken Makhni Handi", description: "Boneless chicken in a smooth, buttery tomato gravy, slow-cooked in a clay handi.", price: 1750, category: "karahi", image: "handi", spicy: 1 },
  { id: "paneer-handi", name: "Paneer Handi", description: "Soft paneer in a creamy tomato and fenugreek gravy.", price: 1450, category: "karahi", image: "handi", vegetarian: true, spicy: 1 },

  // ── BBQ & Grill ───────────────────────────────────────────────────────
  { id: "bbq-platter", name: "BBQ Platter", description: "A charcoal-grilled selection of seekh kebab, chicken tikka, malai boti and reshmi kebab.", price: 2950, category: "bbq", image: "bbq", serving: "Serves 2–3", popular: true, chefsChoice: true, spicy: 1 },
  { id: "chicken-tikka", name: "Chicken Tikka", description: "Bone-in chicken marinated overnight in yoghurt and spices, charred over coals.", price: 750, category: "bbq", image: "bbq", serving: "Leg / Breast", spicy: 2 },
  { id: "malai-boti", name: "Malai Boti", description: "Silky boneless chicken in a cream, cheese and white-pepper marinade.", price: 1150, category: "bbq", image: "bbq", spicy: 0 },
  { id: "behari-boti", name: "Behari Boti", description: "Tenderised beef in a smoky mustard-oil and spice marinade, grilled on skewers.", price: 1350, category: "bbq", image: "bbq", spicy: 2 },
  { id: "grilled-fish", name: "Grilled Fish Tikka", description: "Boneless fish in a tangy ajwain and lemon marinade, cooked over charcoal.", price: 1650, category: "bbq", image: "grill", spicy: 1 },

  // ── Kebabs ────────────────────────────────────────────────────────────
  { id: "chapli-kebab", name: "Chapli Kebab", description: "Peshawari-style minced beef patties with pomegranate seeds, tomato and coriander, crisp at the edges.", price: 550, category: "kebabs", image: "chapli", serving: "Per piece", spicy: 2, popular: true },
  { id: "seekh-kebab", name: "Beef Seekh Kebab", description: "Hand-pressed minced beef with fresh herbs and green chilli, grilled on skewers.", price: 950, category: "kebabs", image: "grill", serving: "4 pieces", spicy: 2 },
  { id: "chicken-seekh", name: "Chicken Seekh Kebab", description: "Juicy minced chicken skewers with ginger, garlic and coriander.", price: 850, category: "kebabs", image: "grill", serving: "4 pieces", spicy: 1 },
  { id: "reshmi-kebab", name: "Reshmi Kebab", description: "Soft, silky minced-chicken kebabs with cream and mild spices.", price: 950, category: "kebabs", image: "bbq", serving: "4 pieces", spicy: 0 },

  // ── Family Platters ───────────────────────────────────────────────────
  { id: "family-platter", name: "Special Family Platter", description: "Signature pulao crowned with chicken tikka, seekh kebab, chapli kebab and chicken karahi, with naan, raita and salad.", price: 6950, category: "platters", image: "familyPlatter", serving: "Serves 4–5", popular: true, chefsChoice: true, spicy: 1 },
  { id: "grand-platter", name: "Grand Gathering Platter", description: "A generous spread of mutton karahi, mixed BBQ, pulao, naan basket and chutneys.", price: 11500, category: "platters", image: "familyPlatter", serving: "Serves 8–10", spicy: 1 },
  { id: "kebab-platter", name: "Kebab Lovers' Platter", description: "Seekh, chapli, reshmi and behari kebabs with naan, chutneys and salad.", price: 4950, category: "platters", image: "bbq", serving: "Serves 3–4", spicy: 2 },

  // ── Breads & Sides ────────────────────────────────────────────────────
  { id: "plain-naan", name: "Plain Naan", description: "Soft, blistered naan baked fresh in the tandoor.", price: 90, category: "breads", image: "tandoor", vegetarian: true },
  { id: "garlic-naan", name: "Garlic Naan", description: "Tandoori naan brushed with garlic butter and coriander.", price: 180, category: "breads", image: "breads", vegetarian: true, popular: true },
  { id: "roghni-naan", name: "Roghni Naan", description: "Rich, milk-glazed naan finished with sesame seeds.", price: 150, category: "breads", image: "breads", vegetarian: true },
  { id: "raita", name: "Mint Raita", description: "Cool yoghurt with fresh mint, cucumber and roasted cumin.", price: 150, category: "breads", image: "breads", vegetarian: true },
  { id: "kachumber", name: "Kachumber Salad", description: "Diced cucumber, tomato and onion with lemon and chaat masala.", price: 200, category: "breads", image: "ingredients", vegetarian: true },

  // ── Beverages ─────────────────────────────────────────────────────────
  { id: "mango-lassi", name: "Mango Lassi", description: "Thick, chilled yoghurt blended with ripe mango.", price: 450, category: "beverages", image: "beverages", vegetarian: true, popular: true },
  { id: "sweet-lassi", name: "Sweet / Salted Lassi", description: "Traditional churned lassi, served ice-cold.", price: 350, category: "beverages", image: "beverages", vegetarian: true },
  { id: "doodh-patti", name: "Doodh Patti Chai", description: "Strong milk tea brewed the traditional way with cardamom.", price: 200, category: "beverages", image: "beverages", vegetarian: true },
  { id: "mint-margarita", name: "Mint Margarita", description: "Fresh mint, lime and crushed ice.", price: 400, category: "beverages", image: "beverages", vegetarian: true },
  { id: "soft-drink", name: "Soft Drink", description: "Chilled soft drink.", price: 150, category: "beverages", image: "beverages", vegetarian: true, serving: "Regular" },

  // ── Desserts ──────────────────────────────────────────────────────────
  { id: "kheer", name: "Kheer", description: "Slow-cooked rice pudding with cardamom, pistachio and rose.", price: 400, category: "desserts", image: "desserts", vegetarian: true, popular: true },
  { id: "gulab-jamun", name: "Gulab Jamun", description: "Warm milk dumplings soaked in fragrant sugar syrup.", price: 350, category: "desserts", image: "desserts", vegetarian: true, serving: "3 pieces" },
  { id: "kulfi", name: "Pistachio Kulfi", description: "Dense, traditional frozen dessert with crushed pistachio.", price: 300, category: "desserts", image: "desserts", vegetarian: true },
  { id: "gajar-halwa", name: "Gajar Halwa", description: "Slow-cooked carrot halwa with khoya and nuts (seasonal).", price: 450, category: "desserts", image: "desserts", vegetarian: true },
];
