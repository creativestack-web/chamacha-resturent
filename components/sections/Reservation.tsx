"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { media } from "@/data/media";
import { branches, site } from "@/data/site";
import { submitReservation, type ReservationPayload } from "@/lib/ordering";
import { track } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "handoff"; url: string; data: ReservationPayload } | { kind: "submitted"; data: ReservationPayload } | { kind: "error" };

export function Reservation() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const today = useMemo(() => {
    const d = new Date();
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: ReservationPayload = {
      name: String(fd.get("name")).trim(),
      phone: String(fd.get("phone")).trim(),
      email: String(fd.get("email") || "").trim() || undefined,
      date: String(fd.get("date")),
      time: String(fd.get("time")),
      guests: Number(fd.get("guests")),
      branchId: String(fd.get("branch") || branches[0].id),
      request: String(fd.get("request") || "").trim() || undefined,
    };
    setStatus({ kind: "sending" });
    try {
      const res = await submitReservation(data);
      track("reservation_request", { guests: data.guests });
      setStatus(res.status === "handoff" ? { kind: "handoff", url: res.url, data } : { kind: "submitted", data });
    } catch {
      setStatus({ kind: "error" });
    }
  }

  const prettyDate = (iso: string) => {
    try {
      return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    } catch {
      return iso;
    }
  };

  return (
    <section id="reservations" aria-labelledby="reservation-title" className="relative isolate overflow-hidden bg-ink-800">
      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[320px] lg:col-span-5 lg:min-h-full">
          <Image src={media.interior.src} alt={media.interior.alt} fill sizes="(min-width:1024px) 42vw, 100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-900/40 to-ink-900/30 lg:bg-gradient-to-r lg:from-transparent lg:via-ink-900/20 lg:to-ink-800" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:hidden">
            <Eyebrow>Reservations</Eyebrow>
          </div>
        </div>

        <div className="px-5 py-16 sm:px-10 md:py-24 lg:col-span-7 lg:px-16 xl:px-24">
          <Reveal>
            <Eyebrow className="mb-6 hidden lg:inline-flex">Reservations</Eyebrow>
            <h2 id="reservation-title" className="font-display text-[2.4rem] leading-[1.04] text-cream-50 sm:text-5xl lg:text-[3.4rem]">
              Reserve Your <em className="text-copper-300">Table</em>
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-cream-200/70">
              Planning a family dinner or a special occasion? Send us your preferred date and time and our team will confirm availability with you directly.
            </p>

            {status.kind === "handoff" || status.kind === "submitted" ? (
              <div className="mt-10 animate-rise border border-copper-500/30 bg-ink-900/50 p-8 sm:p-10" role="status">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-copper-500 text-ink-900">
                  <Icon name={status.kind === "submitted" ? "check" : "calendar"} className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-3xl text-cream-50">
                  {status.kind === "submitted" ? "Request received" : "Your request is ready"}
                </h3>
                <p className="mt-3 max-w-lg text-cream-200/75">
                  {status.kind === "submitted"
                    ? "Thank you — your table is not confirmed yet. Our team will contact you shortly to confirm availability."
                    : "Send your request to our team on WhatsApp. Your table is confirmed once our team replies."}
                </p>
                <dl className="mt-6 grid gap-4 border-y border-cream/[0.08] py-5 text-sm sm:grid-cols-3">
                  <div><dt className="text-[0.7rem] uppercase tracking-[0.16em] text-cream-300/72">Date</dt><dd className="mt-1 text-cream-50">{prettyDate(status.data.date)}</dd></div>
                  <div><dt className="text-[0.7rem] uppercase tracking-[0.16em] text-cream-300/72">Time</dt><dd className="mt-1 text-cream-50">{status.data.time}</dd></div>
                  <div><dt className="text-[0.7rem] uppercase tracking-[0.16em] text-cream-300/72">Guests</dt><dd className="mt-1 text-cream-50">{status.data.guests}</dd></div>
                </dl>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {status.kind === "handoff" && (
                    <a href={status.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 bg-[#1E7048] px-6 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#23804F]">
                      <Icon name="whatsapp" className="h-4 w-4" /> Send Request on WhatsApp
                    </a>
                  )}
                  <button type="button" onClick={() => setStatus({ kind: "idle" })} className="inline-flex h-12 items-center justify-center border border-cream/25 px-6 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-cream-100 hover:border-copper-400">
                    Edit Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="rs-name" className="label">Name</label>
                  <input id="rs-name" name="name" required autoComplete="name" className="field" placeholder="Your full name" />
                </div>
                <div>
                  <label htmlFor="rs-phone" className="label">Phone</label>
                  <input id="rs-phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" minLength={7} className="field" placeholder="03XX XXXXXXX" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="rs-email" className="label">Email <span className="normal-case tracking-normal text-cream-300/72">(optional)</span></label>
                  <input id="rs-email" name="email" type="email" autoComplete="email" className="field" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="rs-date" className="label">Date</label>
                  <input id="rs-date" name="date" type="date" required min={today} className="field" />
                </div>
                <div>
                  <label htmlFor="rs-time" className="label">Time</label>
                  <select id="rs-time" name="time" required className="field" defaultValue="">
                    <option value="" disabled>Select a time</option>
                    {site.reservations.timeSlots.map((t) => {
                      const [h, m] = t.split(":").map(Number);
                      const label = `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
                      return <option key={t} value={label}>{label}</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label htmlFor="rs-guests" className="label">Number of guests</label>
                  <select id="rs-guests" name="guests" required className="field" defaultValue="2">
                    {Array.from({ length: site.reservations.maxGuests }).map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1} {i === 0 ? "guest" : "guests"}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="rs-branch" className="label">Branch</label>
                  <select id="rs-branch" name="branch" className="field" defaultValue={branches[0].id}>
                    {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="rs-request" className="label">Special request <span className="normal-case tracking-normal text-cream-300/72">(optional)</span></label>
                  <textarea id="rs-request" name="request" rows={3} className="field resize-none" placeholder="Birthday, high chair, seating preference…" />
                </div>
                <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-cream-300/72">{site.reservations.largePartyNote}</p>
                  <button
                    type="submit"
                    disabled={status.kind === "sending"}
                    className="inline-flex h-14 shrink-0 items-center justify-center gap-2 bg-copper-500 px-8 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-ink-900 transition-all hover:bg-copper-300 hover:shadow-glow disabled:opacity-60"
                  >
                    {status.kind === "sending" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-900/30 border-t-ink-900" aria-hidden="true" /> Sending…
                      </>
                    ) : (
                      <>
                        Request a Table <Icon name="arrow" className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
                {status.kind === "error" && <p role="alert" className="text-sm text-ember-400 sm:col-span-2">Something went wrong. Please try again or call us.</p>}
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
