/**
 * REVIEWS
 * ----------------------------------------------------------------------------
 * These are PLACEHOLDER testimonials written to show the layout. They are NOT
 * real customer reviews. Replace them with genuine, permission-granted guest
 * reviews (e.g. copied from the restaurant's Google Business profile) before
 * launch, and set `verified: true` only for real reviews.
 * While `verified` is false the card shows the bracketed [Guest Name]
 * placeholder and no "verified" mark, so nothing is presented as a real review.
 */
export type Review = {
  id: string;
  quote: string;
  name: string;
  context?: string;
  date?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  verified: boolean;
};

export const reviews: Review[] = [
  {
    id: "r1",
    quote:
      "The chicken karahi arrived sizzling and full of flavour, and the naan was soft and fresh from the tandoor. The kind of meal you start planning to repeat before you've finished it.",
    name: "[Guest Name]",
    context: "Dine-in",
    date: "[Month Year]",
    rating: 5,
    verified: false,
  },
  {
    id: "r2",
    quote:
      "We ordered the family platter for a get-together and there was plenty for everyone. The pulao was fragrant and the kebabs were perfectly grilled.",
    name: "[Guest Name]",
    context: "Delivery",
    date: "[Month Year]",
    rating: 5,
    verified: false,
  },
  {
    id: "r3",
    quote:
      "Warm welcome, relaxed atmosphere and generous portions. The chapli kebab is a must — crisp outside, juicy inside.",
    name: "[Guest Name]",
    context: "Family dinner",
    date: "[Month Year]",
    rating: 5,
    verified: false,
  },
  {
    id: "r4",
    quote:
      "Ordering on WhatsApp was quick and easy, and our food was ready right on time for pickup. Everything was hot and well packed.",
    name: "[Guest Name]",
    context: "Pickup",
    date: "[Month Year]",
    rating: 5,
    verified: false,
  },
];
