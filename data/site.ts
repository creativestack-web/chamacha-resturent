/**
 * ============================================================================
 *  CHAMCHA RESTAURANT — CENTRAL BUSINESS CONFIGURATION
 * ============================================================================
 *  Edit this file to update the restaurant's real details before launch.
 *  Every phone number, address, hour, link and fee shown on the website is
 *  read from here (menu items live in data/menu.ts, deals in data/deals.ts,
 *  photography paths in data/media.ts, reviews in data/reviews.ts).
 *
 *  Values wrapped in [square brackets] are placeholders that MUST be replaced
 *  with the restaurant's confirmed information before going live.
 * ============================================================================
 */

export const site = {
  name: "Chamcha Restaurant",
  shortName: "Chamcha",
  tagline: "Authentic Pakistani Cuisine",
  description:
    "Discover authentic Pakistani flavors at Chamcha Restaurant. Explore our menu, special deals, dine-in, takeaway and online ordering.",

  /** Production domain — used for canonical URLs, sitemap and structured data. */
  url: "https://www.chamcharestaurant.com", // [Replace with the live domain]

  /** Currency used across the menu, cart and structured data. */
  currency: { code: "PKR", symbol: "Rs.", locale: "en-PK" },

  contact: {
    /** Human-readable phone shown on the site. */
    phoneDisplay: "+92 300 0000000", // [Restaurant phone]
    /** Dial string for tel: links (digits, optional leading +). */
    phoneDial: "+923000000000", // [Restaurant phone — dial format]
    /** WhatsApp number in international format, digits only, no + or spaces. */
    whatsapp: "923000000000", // [WhatsApp number]
    whatsappDisplay: "+92 300 0000000", // [WhatsApp number — display]
    email: "hello@chamcharestaurant.com", // [Restaurant email]
  },

  /** Default greeting pre-filled when a customer opens WhatsApp. */
  whatsappGreeting: "Assalam-o-Alaikum Chamcha Restaurant! I'd like to place an order.",

  social: {
    instagram: "https://www.instagram.com/", // [Instagram profile URL]
    instagramHandle: "@chamcharestaurant", // [Instagram handle]
    facebook: "https://www.facebook.com/", // [Facebook page URL]
    tiktok: "https://www.tiktok.com/", // [TikTok profile URL]
  },

  /** Link for the "See More Reviews" button (e.g. Google Business profile). */
  reviewsUrl: "https://www.google.com/maps", // [Google reviews URL]

  /** Opening hours — shown in the hours card, branch cards, footer and schema. */
  hours: [
    { day: "Monday", short: "Mo", open: "[12:00 PM]", close: "[12:00 AM]" },
    { day: "Tuesday", short: "Tu", open: "[12:00 PM]", close: "[12:00 AM]" },
    { day: "Wednesday", short: "We", open: "[12:00 PM]", close: "[12:00 AM]" },
    { day: "Thursday", short: "Th", open: "[12:00 PM]", close: "[12:00 AM]" },
    { day: "Friday", short: "Fr", open: "[2:00 PM]", close: "[1:00 AM]" },
    { day: "Saturday", short: "Sa", open: "[12:00 PM]", close: "[1:00 AM]" },
    { day: "Sunday", short: "Su", open: "[12:00 PM]", close: "[1:00 AM]" },
  ],
  hoursNote: "Hours may vary on public holidays.",

  /** Ordering & delivery settings. */
  ordering: {
    /** Where "Order Online" buttons point. Keep "#menu" until a hosted ordering system is connected. */
    orderUrl: "/#menu",
    /** Delivery zones with their fees (in currency units). */
    deliveryAreas: [
      { name: "[Delivery Area 1]", fee: 150 },
      { name: "[Delivery Area 2]", fee: 200 },
      { name: "[Delivery Area 3]", fee: 250 },
    ],
    /** Fee shown in the cart before an area is chosen. */
    defaultDeliveryFee: 150,
    /** Minimum order for delivery (0 to disable). */
    minimumDeliveryOrder: 1500,
    /** Short summary used in the ordering section. */
    deliveryAreasSummary: "[Delivery Areas]",
    /** Honest payment note shown at checkout (no payment is processed online yet). */
    paymentNote: "Payment is settled on delivery or at pickup. Our team confirms every order before it is prepared.",
    estimatedDelivery: "[35–50 min]",
    estimatedPickup: "[20–25 min]",
  },

  /** Reservation settings. */
  reservations: {
    maxGuests: 20,
    /** Time slots offered in the booking form. */
    timeSlots: ["12:30", "13:00", "13:30", "14:00", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"],
    largePartyNote: "For parties larger than 20 or private events, please call us directly.",
  },
} as const;

/**
 * Branches — duplicate an object to add another location.
 * Set `mapEmbedUrl` to the Google Maps "Embed a map" src to show a live map.
 */
export const branches = [
  {
    id: "main",
    name: "Main Branch",
    address: "[Full Address, Area, City]",
    phoneDisplay: site.contact.phoneDisplay,
    phoneDial: site.contact.phoneDial,
    whatsapp: site.contact.whatsapp,
    hoursSummary: "Daily · [12:00 PM – 12:00 AM]",
    services: ["Dine-In", "Takeaway", "Delivery"],
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=Chamcha+Restaurant", // [Google Maps link]
    mapEmbedUrl: "", // [Google Maps embed src]
    geo: { lat: null as number | null, lng: null as number | null }, // [Coordinates]
  },
  {
    id: "second",
    name: "[Second Branch]",
    address: "[Full Address, Area, City]",
    phoneDisplay: "[Branch phone]",
    phoneDial: site.contact.phoneDial,
    whatsapp: site.contact.whatsapp,
    hoursSummary: "Daily · [Opening Hours]",
    services: ["Dine-In", "Takeaway", "Delivery"],
    directionsUrl: "https://www.google.com/maps",
    mapEmbedUrl: "",
    geo: { lat: null as number | null, lng: null as number | null },
  },
] as const;

export type Branch = (typeof branches)[number];

/** Primary navigation. Hash links resolve to sections on the home page. */
export const navigation = [
  { label: "Home", href: "/#top" },
  { label: "Menu", href: "/#menu" },
  { label: "About", href: "/#about" },
  { label: "Our Specialties", href: "/#specialties" },
  { label: "Deals", href: "/#deals" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Locations", href: "/#locations" },
  { label: "Contact", href: "/#contact" },
] as const;

/**
 * Optional backend endpoints. When empty, orders / reservations / enquiries
 * are handed off to WhatsApp (never silently "submitted").
 * Set them via environment variables — see .env.example.
 */
export const integrations = {
  orderApiUrl: process.env.NEXT_PUBLIC_ORDER_API_URL ?? "",
  reservationApiUrl: process.env.NEXT_PUBLIC_RESERVATION_API_URL ?? "",
  enquiryApiUrl: process.env.NEXT_PUBLIC_ENQUIRY_API_URL ?? "",
  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
};
