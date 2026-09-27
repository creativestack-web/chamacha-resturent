/**
 * Central photography registry.
 * Replace any `src` with the restaurant's own photography (same aspect ratio
 * recommended). Local files live in /public/images; remote URLs also work once
 * their host is added to `images.remotePatterns` in next.config.ts.
 */
export type Media = { src: string; alt: string; width: number; height: number };

const img = (file: string, alt: string, width: number, height: number): Media => ({
  src: `/images/${file}.webp`,
  alt,
  width,
  height,
});

export const media = {
  hero: img("hero-feast", "A spread of chicken karahi, seekh kebabs, chicken tikka, pulao, naan and raita on a dark stone table", 2400, 1350),
  pulao: img("signature-pulao", "Signature pulao on a hammered brass platter with raita", 1400, 1050),
  chapli: img("chapli-kebab", "Chapli kebabs topped with tomato, served with naan, onions and green chutney", 1400, 1050),
  chickenKarahi: img("chicken-karahi", "Chicken karahi in a black iron karahi garnished with ginger and green chillies", 1400, 1050),
  muttonKarahi: img("mutton-karahi", "Mutton karahi in rich, peppery gravy", 1400, 1050),
  bbq: img("bbq-platter", "Mixed BBQ platter with seekh kebab, chicken tikka and malai boti on a sizzler", 1400, 1050),
  familyPlatter: img("family-platter", "Family platter with pulao, tikka, seekh kebab, chapli kebab, karahi and naan", 1400, 1050),
  interior: img("restaurant-interior", "Warmly lit dining room with brass pendant lights, leather banquettes and carved wooden screens", 1400, 933),
  grill: img("charcoal-grill", "Seekh kebab skewers being turned over glowing charcoal", 1400, 1867),
  ingredients: img("fresh-ingredients", "Fresh tomatoes, chillies, herbs, ginger, garlic and whole spices", 1400, 1867),
  tandoor: img("tandoor-naan", "Fresh naan being pulled from a glowing clay tandoor", 1400, 1867),
  familyDining: img("family-dining", "A family sharing karahi, pulao, kebabs and naan around a table", 1400, 933),
  desserts: img("desserts", "Kheer with pistachio, gulab jamun and kulfi", 1400, 1050),
  beverages: img("beverages", "Mango lassi, rose drink and doodh patti chai", 1400, 1050),
  breads: img("breads-sides", "Assorted naan with daal, raita and salad", 1400, 1050),
  handi: img("paneer-handi", "Paneer handi in creamy tomato gravy with daal tarka", 1400, 1050),
} satisfies Record<string, Media>;

export type MediaKey = keyof typeof media;

/** Default social-share image (1200×630-ish JPG for maximum compatibility). */
export const ogImage = { src: "/images/og-image.jpg", width: 1200, height: 675 };
