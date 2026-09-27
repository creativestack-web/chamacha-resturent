/**
 * Structured data (JSON-LD) builders — generated entirely from data/site.ts
 * and data/menu.ts so real business facts only need to be entered once.
 * Placeholder values (in [brackets]) are omitted from the output so search
 * engines never receive invented information.
 */
import { branches, site } from "@/data/site";
import { menuCategories, menuItems } from "@/data/menu";
import { deals } from "@/data/deals";
import { ogImage } from "@/data/media";

const isReal = (v: unknown): v is string => typeof v === "string" && v.length > 0 && !/\[.*\]/.test(v);

function to24h(v: string): string | null {
  const m = v.replace(/[[\]]/g, "").trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

export function restaurantJsonLd() {
  const hoursAreReal = site.hours.every((h) => isReal(h.open) && isReal(h.close));
  const b = branches[0];

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    url: site.url,
    description: site.description,
    image: `${site.url}${ogImage.src}`,
    servesCuisine: ["Pakistani", "BBQ", "Desi"],
    menu: `${site.url}/#menu`,
    hasMenu: { "@id": `${site.url}/#menu-schema` },
    acceptsReservations: true,
    sameAs: [site.social.instagram, site.social.facebook, site.social.tiktok].filter((u) => isReal(u) && !/^https:\/\/www\.(instagram|facebook|tiktok)\.com\/$/.test(u)),
  };

  if (isReal(site.contact.phoneDisplay) && !/0000000/.test(site.contact.phoneDial)) data.telephone = site.contact.phoneDial;
  if (isReal(b.address)) data.address = { "@type": "PostalAddress", streetAddress: b.address };
  if (b.geo.lat !== null && b.geo.lng !== null) data.geo = { "@type": "GeoCoordinates", latitude: b.geo.lat, longitude: b.geo.lng };
  if (hoursAreReal) {
    data.openingHoursSpecification = site.hours
      .map((h) => {
        const opens = to24h(h.open);
        const closes = to24h(h.close);
        return opens && closes ? { "@type": "OpeningHoursSpecification", dayOfWeek: `https://schema.org/${h.day}`, opens, closes } : null;
      })
      .filter(Boolean);
  }
  return data;
}

export function menuJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    "@id": `${site.url}/#menu-schema`,
    name: `${site.name} Menu`,
    inLanguage: "en",
    hasMenuSection: [
      ...menuCategories
        .filter((c) => c.id !== "popular" && c.id !== "deals")
        .map((c) => ({
          "@type": "MenuSection",
          name: c.label,
          hasMenuItem: menuItems
            .filter((i) => i.category === c.id)
            .map((i) => ({
              "@type": "MenuItem",
              name: i.name,
              description: i.description,
              ...(i.vegetarian ? { suitableForDiet: "https://schema.org/VegetarianDiet" } : {}),
              offers: { "@type": "Offer", price: i.price, priceCurrency: site.currency.code },
            })),
        })),
      {
        "@type": "MenuSection",
        name: "Deals",
        hasMenuItem: deals.map((d) => ({
          "@type": "MenuItem",
          name: d.name,
          description: d.includes.join(", "),
          offers: { "@type": "Offer", price: d.price, priceCurrency: site.currency.code },
        })),
      },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: site.url,
    name: site.name,
    publisher: { "@id": `${site.url}/#restaurant` },
  };
}
