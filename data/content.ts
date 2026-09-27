/**
 * Editorial copy & section content. All text here is original placeholder copy
 * that the restaurant can refine. It deliberately avoids unverifiable claims
 * (awards, rankings, customer counts, founding years).
 */
import type { MediaKey } from "./media";

/** Menu item ids shown in "Our Signature Favorites" (order matters). */
export const signatureItemIds = [
  "signature-pulao",
  "chapli-kebab",
  "chicken-karahi",
  "bbq-platter",
  "mutton-karahi",
  "family-platter",
];

export const hero = {
  eyebrow: "Authentic Pakistani Cuisine",
  headline: ["Authentic Flavor.", "Made to Be Remembered."],
  text: "Traditional Pakistani flavors, freshly prepared with passion and served with the warmth of Chamcha Restaurant.",
  utilities: ["Freshly Prepared", "Dine-In", "Takeaway", "Delivery"],
};

export const whyChamcha = [
  { icon: "flame", title: "Freshly Prepared", text: "Karahis finished to order, kebabs grilled over charcoal and naan baked in the tandoor as you order." },
  { icon: "spice", title: "Authentic Flavors", text: "Traditional recipes and whole spices, cooked the way Pakistani food is meant to taste." },
  { icon: "leaf", title: "Quality Ingredients", text: "Fresh meat, seasonal produce and herbs chosen with care and prepared in-house every day." },
  { icon: "platter", title: "Generous Portions", text: "Dishes made for sharing — because a good meal should leave the whole table satisfied." },
  { icon: "clock", title: "Fast Service", text: "Efficient kitchen, clear ordering and a team focused on getting your food to you hot." },
  { icon: "family", title: "Family Friendly", text: "A welcoming space for families, friends and colleagues, with menus for every size of group." },
] as const;

export const about = {
  eyebrow: "Our Story",
  headline: "A Taste Worth Coming Back For",
  lead: "Chamcha Restaurant was created around a simple idea: honest Pakistani food, cooked with care and served with genuine hospitality.",
  paragraphs: [
    "From the first sizzle of the karahi to the last piece of warm naan, every dish on our table is prepared to bring people together. We cook with traditional methods, fresh ingredients and the patience that real flavor deserves.",
    "Whether you are joining us for a family dinner, collecting a quick takeaway or ordering a feast for the office, we want every visit to feel welcoming, generous and memorable.",
  ],
  pillars: [
    { title: "Food Philosophy", text: "Classic recipes, cooked slowly where it matters and finished fresh to order." },
    { title: "Quality Focus", text: "Carefully sourced meat, fresh produce and spices prepared in our own kitchen." },
    { title: "Hospitality", text: "Warm service that treats every guest like family at our table." },
  ],
  image: "interior" as MediaKey,
  secondaryImage: "tandoor" as MediaKey,
};

export const experience: { image: MediaKey; kicker: string; title: string; caption: string }[] = [
  { image: "ingredients", kicker: "01 — Fresh Ingredients", title: "It starts at the market", caption: "Ripe tomatoes, green chillies, fresh herbs and whole spices — the foundation of every dish." },
  { image: "grill", kicker: "02 — Over the Coals", title: "Fire, smoke and patience", caption: "Kebabs and tikka are turned by hand over glowing charcoal for that unmistakable char." },
  { image: "tandoor", kicker: "03 — From the Tandoor", title: "Bread, baked to order", caption: "Naan is slapped onto the tandoor walls and served blistered and warm." },
  { image: "chickenKarahi", kicker: "04 — On the Table", title: "Served sizzling", caption: "Karahis leave the flame and reach your table still bubbling." },
  { image: "interior", kicker: "05 — The Atmosphere", title: "A room made for gathering", caption: "Warm light, brass and carved wood — a setting for long, unhurried meals." },
];

export const familySection = {
  eyebrow: "Family & Group Dining",
  headline: "Good Food Is Better Together.",
  text: "From Sunday family lunches to office orders and celebrations, we prepare generous spreads designed for sharing — ready for dine-in, pickup or delivery.",
  items: [
    { title: "Family Meals", text: "Complete meals for 4–5 with karahi, pulao, kebabs and naan." },
    { title: "Group Platters", text: "Sharing platters sized for tables of four to ten." },
    { title: "Office Lunches", text: "Bulk orders for teams, delivered together and on time." },
    { title: "Gatherings", text: "Home dawats and get-togethers, prepared the way guests expect." },
    { title: "Events", text: "Menus for celebrations and private events — speak to our team." },
  ],
  image: "familyDining" as MediaKey,
};

export type GalleryCategory = "Food" | "BBQ" | "Restaurant" | "Family Dining" | "Behind the Scenes";

export const gallery: { image: MediaKey; category: GalleryCategory; caption: string; tall?: boolean }[] = [
  { image: "familyPlatter", category: "Food", caption: "Special Family Platter" },
  { image: "grill", category: "Behind the Scenes", caption: "Seekh kebabs on the coals", tall: true },
  { image: "interior", category: "Restaurant", caption: "The dining room" },
  { image: "chapli", category: "Food", caption: "Chapli Kebab" },
  { image: "bbq", category: "BBQ", caption: "Mixed BBQ platter" },
  { image: "familyDining", category: "Family Dining", caption: "Sharing a family meal" },
  { image: "tandoor", category: "Behind the Scenes", caption: "Fresh from the tandoor", tall: true },
  { image: "chickenKarahi", category: "Food", caption: "Chicken Karahi" },
  { image: "muttonKarahi", category: "Food", caption: "Mutton Karahi" },
  { image: "ingredients", category: "Behind the Scenes", caption: "Fresh ingredients", tall: true },
  { image: "pulao", category: "Food", caption: "Signature Pulao" },
  { image: "desserts", category: "Food", caption: "Kheer, gulab jamun & kulfi" },
];

/** Tiles shown in the social section (swap for a live Instagram feed later). */
export const socialTiles: MediaKey[] = ["chickenKarahi", "bbq", "pulao", "chapli", "desserts", "beverages"];
