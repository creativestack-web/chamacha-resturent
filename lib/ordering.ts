/**
 * ============================================================================
 *  ORDERING / RESERVATION / ENQUIRY SERVICE LAYER
 * ============================================================================
 *  The UI never talks to a backend directly — it calls the functions below.
 *  To go live with a real ordering system, POS or payment gateway, implement
 *  the API call inside these functions (or set the NEXT_PUBLIC_*_API_URL env
 *  vars to an endpoint that accepts the JSON payloads defined here).
 *
 *  Until an endpoint is configured, requests are handed off to WhatsApp so the
 *  restaurant team receives and confirms them manually. Nothing is ever shown
 *  to the customer as "paid" or "confirmed" by the website itself.
 * ============================================================================
 */
import { integrations, site } from "@/data/site";
import { formatPrice, whatsappLink } from "./utils";

export type FulfilmentType = "delivery" | "pickup";

export type OrderLine = { id: string; name: string; unitPrice: number; quantity: number };

export type OrderPayload = {
  fulfilment: FulfilmentType;
  customer: { name: string; phone: string; address?: string; area?: string; notes?: string };
  branchId: string;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  createdAt: string;
};

export type ReservationPayload = {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  branchId: string;
  request?: string;
};

export type EnquiryPayload = { name: string; phone?: string; email: string; subject: string; message: string };

/**
 * Result of a submission:
 *  - "submitted": an API endpoint accepted the request (reference optional)
 *  - "handoff":   no backend configured; `url` opens WhatsApp with the details
 */
export type SubmitResult =
  | { status: "submitted"; reference?: string }
  | { status: "handoff"; channel: "whatsapp"; url: string };

async function postJson(url: string, body: unknown): Promise<{ reference?: string }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json().catch(() => ({}));
}

export function orderMessage(o: OrderPayload): string {
  const lines = o.lines.map((l) => `• ${l.quantity} × ${l.name} — ${formatPrice(l.unitPrice * l.quantity)}`).join("\n");
  return [
    `New ${o.fulfilment === "delivery" ? "DELIVERY" : "PICKUP"} order — ${site.name}`,
    "",
    lines,
    "",
    `Subtotal: ${formatPrice(o.subtotal)}`,
    o.fulfilment === "delivery" ? `Delivery: ${formatPrice(o.deliveryFee)}` : null,
    `Total: ${formatPrice(o.total)}`,
    "",
    `Name: ${o.customer.name}`,
    `Phone: ${o.customer.phone}`,
    o.fulfilment === "delivery" ? `Area: ${o.customer.area ?? "-"}` : null,
    o.fulfilment === "delivery" ? `Address: ${o.customer.address ?? "-"}` : null,
    o.customer.notes ? `Notes: ${o.customer.notes}` : null,
    "",
    "Please confirm my order. Thank you!",
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export async function submitOrder(order: OrderPayload): Promise<SubmitResult> {
  if (integrations.orderApiUrl) {
    const r = await postJson(integrations.orderApiUrl, order);
    return { status: "submitted", reference: r.reference };
  }
  return { status: "handoff", channel: "whatsapp", url: whatsappLink(orderMessage(order)) };
}

export async function submitReservation(r: ReservationPayload): Promise<SubmitResult> {
  if (integrations.reservationApiUrl) {
    const res = await postJson(integrations.reservationApiUrl, r);
    return { status: "submitted", reference: res.reference };
  }
  const msg = [
    `Table request — ${site.name}`,
    "",
    `Name: ${r.name}`,
    `Phone: ${r.phone}`,
    r.email ? `Email: ${r.email}` : null,
    `Date: ${r.date}`,
    `Time: ${r.time}`,
    `Guests: ${r.guests}`,
    r.request ? `Special request: ${r.request}` : null,
    "",
    "Please confirm availability. Thank you!",
  ]
    .filter(Boolean)
    .join("\n");
  return { status: "handoff", channel: "whatsapp", url: whatsappLink(msg) };
}

export async function submitEnquiry(e: EnquiryPayload): Promise<SubmitResult> {
  if (integrations.enquiryApiUrl) {
    const res = await postJson(integrations.enquiryApiUrl, e);
    return { status: "submitted", reference: res.reference };
  }
  const msg = [`Enquiry — ${e.subject}`, "", e.message, "", `From: ${e.name}`, `Email: ${e.email}`, e.phone ? `Phone: ${e.phone}` : null]
    .filter(Boolean)
    .join("\n");
  return { status: "handoff", channel: "whatsapp", url: whatsappLink(msg) };
}
