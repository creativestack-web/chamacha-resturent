import { site } from "@/data/site";

const formatter = new Intl.NumberFormat(site.currency.locale, {
  maximumFractionDigits: 0,
});

/** Formats a number as a price string, e.g. "Rs. 1,450". */
export function formatPrice(value: number): string {
  return `${site.currency.symbol} ${formatter.format(value)}`;
}

/** Builds a wa.me deep link with an optional pre-filled message. */
export function whatsappLink(message: string = site.whatsappGreeting, number: string = site.contact.whatsapp): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function telLink(dial: string = site.contact.phoneDial): string {
  return `tel:${dial.replace(/[^+\d]/g, "")}`;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Lightweight analytics hook — forwards to GA4/GTM if present, otherwise no-op. */
export function track(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] };
  if (typeof w.gtag === "function") w.gtag("event", event, params);
  else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event, ...params });
}
