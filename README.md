# Chamcha Restaurant — Website

A production-ready restaurant website built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS**.
It includes a full online menu, cart and checkout flow, deals, reservations, contact forms, gallery,
reviews, branch information and complete SEO.

---

## 1. Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

> `npm run build` must be run with a Node.js 18+ runtime.

---

## 2. What to replace before launch (one file, mostly)

All business information lives in the `data/` folder. You should not need to touch any component.

| What | File | Notes |
| --- | --- | --- |
| Restaurant name, tagline, description | `data/site.ts` | `site.name`, `site.description` |
| **Domain** | `data/site.ts` | `site.url` — used for canonical URLs, sitemap, structured data |
| Phone, WhatsApp, email | `data/site.ts` | `site.contact.*` — see section 4 below |
| Opening hours | `data/site.ts` | `site.hours` — array of `{ day, short, open, close }` |
| Branches | `data/site.ts` | `branches[]` — duplicate an object to add a branch |
| Delivery zones **and fees** | `data/site.ts` | `site.ordering.deliveryAreas[]`, `minimumDeliveryOrder` |
| Delivery / pickup estimates | `data/site.ts` | `site.ordering.estimatedDelivery`, `estimatedPickup` |
| Reservation settings | `data/site.ts` | `site.reservations` — time slots, max guests |
| Social links | `data/site.ts` | `site.social.*` |
| Google reviews link | `data/site.ts` | `site.reviewsUrl` (used by "See More Reviews") |
| Currency | `data/site.ts` | `site.currency` |
| Menu items and prices | `data/menu.ts` | See section 3 |
| Deals | `data/deals.ts` | Included items, original and discounted price |
| Reviews | `data/reviews.ts` | See section 5 — replace with real reviews |
| Photos | `data/media.ts` + `/public/images` | See section 6 |
| Editorial copy (about, why-us, experience) | `data/content.ts` | Story text, benefit copy, gallery captions |

Values written as `[bracketed placeholders]` are deliberately obvious: they are the fields that still need
real information. Anything still bracketed is automatically **excluded from the structured data** sent to
Google, so no invented facts are published.

### Menu items

```ts
{
  id: "chicken-karahi",          // unique + stable — the cart and any future POS/API use this
  name: "Chicken Karahi",
  description: "Fresh chicken cooked in a sizzling karahi with tomatoes, green chillies…",
  price: 1850,                   // in site.currency
  category: "karahi",            // must match a category in menuCategories
  image: "chickenKarahi",        // a key from data/media.ts
  serving: "Half / Full",        // optional
  popular: true,                 // optional — adds the "Popular" badge and the Popular tab
  chefsChoice: true,             // optional — adds the "Chef's Choice" badge
  vegetarian: true,              // optional — adds the vegetarian marker
  spicy: 2,                      // optional — 0-3 chilli indicator
  available: false,              // optional — hides the Add button (e.g. sold out)
}
```

Menu categories are declared in `menuCategories` in the same file; add or rename them freely.

---

## 3. How ordering works today

The site collects the order in the cart drawer (items, quantities, delivery or pickup, delivery zone,
delivery fee, total) and then hands it to the restaurant through **WhatsApp** as a formatted message.
The customer taps Send; the team replies to confirm.

**Nothing on the site ever claims an order is paid or confirmed** unless a real backend confirms it —
this avoids orders being lost or misrepresented.

To connect a real ordering system, POS or payment gateway, you change exactly one file:
`lib/ordering.ts`. Either

1. implement the API call inside `submitOrder()`, or
2. set an endpoint in `.env.local` (copy `.env.example`):

```bash
NEXT_PUBLIC_ORDER_API_URL=https://api.yourpos.com/orders
NEXT_PUBLIC_RESERVATION_API_URL=https://api.yourpos.com/reservations
NEXT_PUBLIC_ENQUIRY_API_URL=https://api.yourpos.com/enquiries
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX     # optional analytics
```

The exact JSON payloads are typed at the top of `lib/ordering.ts` (`OrderPayload`, `ReservationPayload`,
`EnquiryPayload`) so a developer can wire them up without reading the UI code. As soon as a URL is set,
the form posts JSON to it and stops using the WhatsApp handoff.

Cart contents are saved in the browser (`localStorage`) so a customer who leaves and returns keeps their order.

---

## 4. Phone and WhatsApp numbers

In `data/site.ts`:

```ts
contact: {
  phoneDisplay: "+92 300 0000000",   // what visitors see
  phoneDial:    "+923000000000",     // used by every "Call Restaurant" button
  whatsapp:     "923000000000",      // digits only, no + or spaces
  whatsappDisplay: "+92 300 0000000",
  email: "hello@chamcharestaurant.com",
}
```

The WhatsApp number appears on the header button, mobile sticky bar, ordering bar, locations, the WhatsApp
section, the contact section and the footer — all read from this one place.

---

## 5. Reviews

`data/reviews.ts` ships with written placeholder testimonials marked `verified: false` and a
`[Guest Name]` name. They are **not** presented as real reviews. Before launch:

1. replace each quote with a genuine review (e.g. copied from your Google Business profile),
2. set the real first name or initials,
3. set `verified: true`.

Point `site.reviewsUrl` at your Google reviews page so "See More Reviews" opens the real source.

---

## 6. Photography

All 16 images live in `public/images` as optimised WebP files and are referenced through `data/media.ts`:

```ts
pulao: img("signature-pulao", "Signature pulao on a hammered brass platter with raita", 1400, 1050),
```

To use your own photos:

1. drop the new file into `public/images` (keep the same name to avoid edits), or
2. change the file name and dimensions in `data/media.ts`, and update the `alt` text to describe the dish —
   this text is what screen readers and Google read.

Recommended: 1400–2400 px on the long edge, JPEG or WebP. Keeping the same aspect ratio is simplest;
the current ratios are noted by the `width`/`height` values in `data/media.ts`.

If photos are hosted on your own CDN instead of `public/`, add the host to `images.remotePatterns`
in `next.config.ts` and use the full URL in `data/media.ts`.

---

## 7. SEO checklist

Already implemented:

- Title and meta description (exact wording requested), canonical URL
- Open Graph + Twitter/X card metadata with a 1200×675 share image (`public/images/og-image.jpg`)
- `robots.txt` (`app/robots.ts`), `sitemap.xml` (`app/sitemap.ts`), web app manifest, favicon + Apple icon
- Restaurant, Menu and WebSite structured data (JSON-LD), generated from `data/site.ts` and `data/menu.ts`
- One `<h1>`, logical heading order, descriptive alt text

Still to do:

1. set the real domain in `site.url` (`data/site.ts`) so canonical URLs and the sitemap are correct,
2. replace the bracketed address / phone / hours — they then flow into the structured data automatically,
3. submit the sitemap in Google Search Console after deployment.

---

## 8. Google Maps

Branch cards work without any configuration (they open directions in Google Maps).
To embed a live map:

1. open Google Maps → search the restaurant → **Share → Embed a map** → copy the `src` URL,
2. paste it into `mapEmbedUrl` for that branch in `data/site.ts`.

Until then an elegant illustrated map is shown, and no invented coordinates are published.

---

## 9. Quality checks

Helper scripts (they require the site to be running on port 3100):

```bash
npm start -- -p 3100
node qa/check.cjs      # no horizontal overflow / no sub-11px text at 320-1920px
node qa/interact.cjs   # cart, checkout, search, filters, lightbox, forms, mobile menu
node qa/a11y.cjs       # headings, labels, alt text, landmarks, contrast, focus
```

Current status: 0 overflow issues at 320 / 375 / 390 / 414 / 768 / 1024 / 1440 / 1920 px,
18/18 functional checks passing, 0 low-contrast text nodes, no console errors.

These scripts are development tools only — they are not part of the published website and can be deleted.

---

## 10. Deploying

Any Node host works (Vercel, Netlify, Cloudflare, or your own server):

1. push the project to a Git repository,
2. set the build command `npm run build` and start command `npm start`,
3. add the environment variables from section 3 if you are using them,
4. point the domain at the host and update `site.url` to match.

---

## 11. Project structure

```
app/            layout (fonts, SEO, JSON-LD, providers), page, robots, sitemap, manifest, 404
components/
  layout/       header, mobile navigation, logo, footer, sticky mobile order bar
  sections/     hero, quick order, signatures, deals, family, why-us, about, experience,
                reviews, gallery, ordering info, locations, reservation, whatsapp, contact, social
  menu/         full menu with category filter, search, badges, quantity + add to cart
  cart/         cart drawer (delivery/pickup, fees, checkout) and add-to-cart controls
  ui/           buttons, section headings, icons, scroll reveal, toasts
data/           site.ts (all business info), menu.ts, deals.ts, reviews.ts, content.ts, media.ts
lib/            cart state + toasts, ordering service layer, SEO/JSON-LD builders, helpers
public/images/  optimised photography, favicon, share image
qa/             local QA scripts (development only)
```

Adding a new section? Create it in `components/sections/`, import it into `app/page.tsx`, and add its
link (with a matching `id`) to `navigation` in `data/site.ts`.
