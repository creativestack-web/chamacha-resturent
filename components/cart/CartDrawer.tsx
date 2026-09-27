"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { branches, site } from "@/data/site";
import { useCart } from "@/lib/cart";
import { submitOrder, type OrderPayload } from "@/lib/ordering";
import { cn, formatPrice, track } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";

type Step = "cart" | "details" | "done";

export function CartDrawer() {
  const cart = useCart();
  const { isOpen, close, lines, subtotal, deliveryFee, total, count, fulfilment, setFulfilment, areaIndex, setArea, setQty, remove } = cart;
  const [step, setStep] = useState<Step>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ kind: "submitted" | "handoff"; url?: string; reference?: string } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const min = site.ordering.minimumDeliveryOrder;
  const belowMinimum = fulfilment === "delivery" && min > 0 && subtotal < min;

  // Scroll lock, escape key, focus management
  useEffect(() => {
    if (!isOpen) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [isOpen, close]);

  // Reset to the cart view after closing a completed order
  useEffect(() => {
    if (!isOpen && step === "done") {
      const t = setTimeout(() => {
        setStep("cart");
        setResult(null);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [isOpen, step]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload: OrderPayload = {
      fulfilment,
      branchId: String(fd.get("branch") || branches[0].id),
      customer: {
        name: String(fd.get("name") || "").trim(),
        phone: String(fd.get("phone") || "").trim(),
        address: fulfilment === "delivery" ? String(fd.get("address") || "").trim() : undefined,
        area: fulfilment === "delivery" && areaIndex !== null ? site.ordering.deliveryAreas[areaIndex]?.name : undefined,
        notes: String(fd.get("notes") || "").trim() || undefined,
      },
      lines: lines.map((l) => ({ id: l.id, name: l.name, unitPrice: l.price, quantity: l.quantity })),
      subtotal,
      deliveryFee,
      total,
      currency: site.currency.code,
      createdAt: new Date().toISOString(),
    };
    setSubmitting(true);
    try {
      const res = await submitOrder(payload);
      track("begin_checkout", { value: total, currency: site.currency.code, fulfilment });
      if (res.status === "handoff") {
        window.open(res.url, "_blank", "noopener,noreferrer");
        setResult({ kind: "handoff", url: res.url });
      } else {
        setResult({ kind: "submitted", reference: res.reference });
        cart.clear();
      }
      setStep("done");
    } catch {
      setError("We couldn't send your order just now. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={cn("fixed inset-0 z-[80]", isOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!isOpen}>
      <div className={cn("absolute inset-0 bg-black/65 backdrop-blur-[3px] transition-opacity duration-500", isOpen ? "opacity-100" : "opacity-0")} onClick={close} />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        inert={!isOpen}
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-ink-800 shadow-lift transition-transform duration-500 ease-luxe",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream/[0.08] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            {step === "details" && (
              <button type="button" onClick={() => setStep("cart")} className="grid h-9 w-9 place-items-center text-cream-200 hover:text-copper-300" aria-label="Back to your order">
                <Icon name="chevronLeft" />
              </button>
            )}
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-400">
                {step === "cart" ? "Your Order" : step === "details" ? "Checkout" : "Almost there"}
              </p>
              <h2 id="cart-title" className="font-display text-2xl text-cream-50">
                {step === "cart" ? (count ? `${count} item${count > 1 ? "s" : ""}` : "Your basket") : step === "details" ? "Your details" : "Order ready to send"}
              </h2>
            </div>
          </div>
          <button ref={closeRef} type="button" onClick={close} className="grid h-11 w-11 place-items-center border border-cream/15 text-cream-50 hover:border-copper-400" aria-label="Close order panel">
            <Icon name="close" />
          </button>
        </div>

        {/* Fulfilment toggle */}
        {step !== "done" && lines.length > 0 && (
          <div className="px-5 pt-5 sm:px-7">
            <div className="grid grid-cols-2 border border-cream/10 p-1" role="radiogroup" aria-label="Order type">
              {(["delivery", "pickup"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={fulfilment === f}
                  onClick={() => setFulfilment(f)}
                  className={cn(
                    "flex h-11 items-center justify-center gap-2 text-[0.72rem] font-bold uppercase tracking-[0.14em] transition-colors duration-300",
                    fulfilment === f ? "bg-copper-500 text-ink-900" : "text-cream-200/75 hover:text-cream-50"
                  )}
                >
                  <Icon name={f === "delivery" ? "truck" : "bag"} className="h-4 w-4" />
                  {f === "delivery" ? "Delivery" : "Pickup"}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-cream-300/72">
              {fulfilment === "delivery" ? `Estimated delivery ${site.ordering.estimatedDelivery}` : `Usually ready in ${site.ordering.estimatedPickup}`}
            </p>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          {step === "cart" &&
            (lines.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <span className="mb-6 grid h-20 w-20 place-items-center rounded-full border border-copper-500/30 text-copper-400">
                  <Icon name="bag" className="h-8 w-8" />
                </span>
                <p className="font-display text-2xl text-cream-50">Your basket is empty</p>
                <p className="mt-2 max-w-xs text-sm text-cream-300/72">Browse the menu and add your favourites — they&apos;ll appear here.</p>
                <a href="#menu" onClick={close} className="mt-7 inline-flex h-12 items-center gap-2 bg-copper-500 px-6 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-ink-900 hover:bg-copper-300">
                  Browse the Menu <Icon name="arrow" className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <ul className="divide-y divide-cream/[0.07]">
                {lines.map((l) => (
                  <li key={l.id} className="flex gap-4 py-4 first:pt-0">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-ink-700">
                      <Image src={l.image} alt="" fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium leading-snug text-cream-50">{l.name}</p>
                        <button type="button" onClick={() => remove(l.id)} className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center text-cream-300/72 hover:text-ember-400" aria-label={`Remove ${l.name}`}>
                          <Icon name="trash" className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex h-9 items-center border border-cream/15" role="group" aria-label={`Quantity of ${l.name}`}>
                          <button type="button" onClick={() => setQty(l.id, l.quantity - 1)} className="grid h-full w-9 place-items-center text-cream-200 hover:text-copper-300" aria-label="Decrease quantity">
                            <Icon name="minus" className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-semibold tabular-nums">{l.quantity}</span>
                          <button type="button" onClick={() => setQty(l.id, l.quantity + 1)} className="grid h-full w-9 place-items-center text-cream-200 hover:text-copper-300" aria-label="Increase quantity">
                            <Icon name="plus" className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-semibold tabular-nums text-cream-50">{formatPrice(l.price * l.quantity)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ))}

          {step === "details" && (
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
              <div>
                <label htmlFor="co-name" className="label">Full name</label>
                <input id="co-name" name="name" required autoComplete="name" className="field" placeholder="Your name" />
              </div>
              <div>
                <label htmlFor="co-phone" className="label">Phone</label>
                <input id="co-phone" name="phone" type="tel" required autoComplete="tel" inputMode="tel" minLength={7} className="field" placeholder="03XX XXXXXXX" />
              </div>
              {fulfilment === "delivery" ? (
                <>
                  <div>
                    <label htmlFor="co-area" className="label">Delivery area</label>
                    <select
                      id="co-area"
                      required
                      className="field"
                      value={areaIndex ?? ""}
                      onChange={(e) => setArea(e.target.value === "" ? null : Number(e.target.value))}
                    >
                      <option value="" disabled>Select your area</option>
                      {site.ordering.deliveryAreas.map((a, i) => (
                        <option key={a.name} value={i}>
                          {a.name} — {formatPrice(a.fee)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="co-address" className="label">Delivery address</label>
                    <textarea id="co-address" name="address" required rows={2} autoComplete="street-address" className="field resize-none" placeholder="House, street, landmark" />
                  </div>
                </>
              ) : (
                <div>
                  <label htmlFor="co-branch" className="label">Pickup branch</label>
                  <select id="co-branch" name="branch" className="field" defaultValue={branches[0].id}>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label htmlFor="co-notes" className="label">Order notes <span className="normal-case tracking-normal text-cream-300/72">(optional)</span></label>
                <textarea id="co-notes" name="notes" rows={2} className="field resize-none" placeholder="Spice level, allergies, delivery instructions" />
              </div>
              <p className="flex gap-2.5 border-l-2 border-copper-500/60 bg-copper-500/[0.06] px-3.5 py-3 text-xs leading-relaxed text-cream-200/80">
                <Icon name="sparkle" className="mt-0.5 h-4 w-4 shrink-0 text-copper-400" />
                {site.ordering.paymentNote}
              </p>
              {error && <p role="alert" className="text-sm text-ember-400">{error}</p>}
            </form>
          )}

          {step === "done" && result && (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="mb-6 grid h-20 w-20 animate-rise place-items-center rounded-full bg-copper-500 text-ink-900">
                <Icon name={result.kind === "submitted" ? "check" : "whatsapp"} className="h-9 w-9" />
              </span>
              {result.kind === "handoff" ? (
                <>
                  <p className="font-display text-3xl text-cream-50">Send it on WhatsApp</p>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream-300/75">
                    We&apos;ve prepared your order as a WhatsApp message. Tap <strong className="text-cream-50">Send</strong> in WhatsApp and our team will reply to confirm your order and timing.
                  </p>
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex h-12 items-center gap-2 bg-[#1E7048] px-6 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#23804F]">
                    <Icon name="whatsapp" className="h-4 w-4" /> Open WhatsApp
                  </a>
                  <p className="mt-5 text-xs text-cream-300/72">Your basket is saved until the order is confirmed.</p>
                </>
              ) : (
                <>
                  <p className="font-display text-3xl text-cream-50">Order received</p>
                  <p className="mt-3 max-w-sm text-sm text-cream-300/75">
                    Thank you! {result.reference ? `Reference: ${result.reference}. ` : ""}We&apos;ll contact you shortly to confirm.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Summary + actions */}
        {step !== "done" && lines.length > 0 && (
          <div className="border-t border-cream/[0.08] bg-ink-900/50 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5 sm:px-7">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between text-cream-200/80">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-cream-200/80">
                <dt>{fulfilment === "delivery" ? (areaIndex === null ? "Delivery fee (from)" : "Delivery fee") : "Pickup"}</dt>
                <dd className="tabular-nums">{fulfilment === "delivery" ? formatPrice(deliveryFee) : "Free"}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-cream/[0.08] pt-3">
                <dt className="font-display text-xl text-cream-50">Total</dt>
                <dd className="font-display text-2xl tabular-nums text-copper-300">{formatPrice(total)}</dd>
              </div>
            </dl>
            {belowMinimum && (
              <p className="mt-3 text-xs text-copper-300">
                Add {formatPrice(min - subtotal)} more to reach the {formatPrice(min)} delivery minimum — or switch to pickup.
              </p>
            )}
            {step === "cart" ? (
              <button
                type="button"
                disabled={belowMinimum}
                onClick={() => setStep("details")}
                className="mt-4 flex h-14 w-full items-center justify-center gap-2 bg-copper-500 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-ink-900 transition-all hover:bg-copper-300 disabled:cursor-not-allowed disabled:opacity-45"
              >
                Proceed to Checkout <Icon name="arrow" className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                disabled={submitting || belowMinimum}
                className="mt-4 flex h-14 w-full items-center justify-center gap-2 bg-copper-500 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-ink-900 transition-all hover:bg-copper-300 disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900/30 border-t-ink-900" aria-hidden="true" /> Preparing order…
                  </>
                ) : (
                  <>
                    Confirm Order <Icon name="arrow" className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
