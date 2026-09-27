"use client";

import { useState, type FormEvent } from "react";
import { branches, site } from "@/data/site";
import { submitEnquiry } from "@/lib/ordering";
import { telLink, whatsappLink } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, type IconName } from "@/components/ui/Icon";

export function Contact() {
  const [state, setState] = useState<{ kind: "idle" | "sending" | "error" } | { kind: "handoff"; url: string } | { kind: "submitted" }>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState({ kind: "sending" });
    try {
      const res = await submitEnquiry({
        name: String(fd.get("name")).trim(),
        email: String(fd.get("email")).trim(),
        phone: String(fd.get("phone") || "").trim() || undefined,
        subject: String(fd.get("subject")),
        message: String(fd.get("message")).trim(),
      });
      setState(res.status === "handoff" ? { kind: "handoff", url: res.url } : { kind: "submitted" });
    } catch {
      setState({ kind: "error" });
    }
  }

  const details: { icon: IconName; label: string; value: string; href?: string }[] = [
    { icon: "phone", label: "Phone", value: site.contact.phoneDisplay, href: telLink() },
    { icon: "whatsapp", label: "WhatsApp", value: site.contact.whatsappDisplay, href: whatsappLink() },
    { icon: "mail", label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { icon: "pin", label: "Address", value: branches[0].address, href: branches[0].directionsUrl },
    { icon: "clock", label: "Hours", value: branches[0].hoursSummary },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="section bg-cream-100 text-ink-900">
      <div className="container">
        <SectionHeading
          id="contact-title"
          tone="light"
          eyebrow="Contact"
          title={
            <>
              We&rsquo;d Love to <em className="text-ember-500">Hear From You</em>
            </>
          }
          subtitle="Questions, catering, events or feedback — reach out and our team will get back to you."
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="min-w-0 lg:col-span-5">
            <ul className="min-w-0 divide-y divide-ink-900/10 border-y border-ink-900/10">
              {details.map((d) => (
                <li key={d.label} className="flex items-start gap-4 py-5 sm:gap-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-ink-900/15 text-copper-700">
                    <Icon name={d.icon} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-900/70">{d.label}</p>
                    {d.href ? (
                      <a
                        href={d.href}
                        {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="mt-1 block break-words text-[1rem] [overflow-wrap:anywhere] sm:text-[1.05rem] font-medium text-ink-900 underline-offset-4 hover:text-ember-500 hover:underline"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-[1.05rem] font-medium">{d.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink-900/70">Follow us</p>
              <div className="flex gap-3">
                {([
                  ["instagram", site.social.instagram, "Instagram"],
                  ["facebook", site.social.facebook, "Facebook"],
                  ["tiktok", site.social.tiktok, "TikTok"],
                ] as const).map(([icon, href, label]) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${site.name} on ${label}`} className="grid h-12 w-12 place-items-center border border-ink-900/15 text-ink-900 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-cream-50">
                    <Icon name={icon} />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="min-w-0 lg:col-span-7">
            {state.kind === "handoff" || state.kind === "submitted" ? (
              <div className="animate-rise border border-ink-900/10 bg-white/70 p-8 sm:p-12" role="status">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-ink-900 text-copper-300">
                  <Icon name={state.kind === "submitted" ? "check" : "whatsapp"} className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-3xl">{state.kind === "submitted" ? "Message received" : "Your message is ready"}</h3>
                <p className="mt-3 text-ink-600/80">
                  {state.kind === "submitted"
                    ? "Thank you for getting in touch — we'll reply as soon as possible."
                    : "Tap below to send your message to our team on WhatsApp, or email us directly."}
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {state.kind === "handoff" && (
                    <a href={state.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 bg-[#1E7048] px-6 text-[0.74rem] font-bold uppercase tracking-[0.14em] text-white hover:bg-[#23804F]">
                      <Icon name="whatsapp" className="h-4 w-4" /> Send on WhatsApp
                    </a>
                  )}
                  <button type="button" onClick={() => setState({ kind: "idle" })} className="inline-flex h-12 items-center justify-center border border-ink-900/25 px-6 text-[0.74rem] font-bold uppercase tracking-[0.14em] hover:border-ink-900">
                    New Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ct-name" className="label-light">Name</label>
                  <input id="ct-name" name="name" required autoComplete="name" className="field-light" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="ct-email" className="label-light">Email</label>
                  <input id="ct-email" name="email" type="email" required autoComplete="email" className="field-light" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="ct-phone" className="label-light">Phone <span className="normal-case tracking-normal text-ink-900/70">(optional)</span></label>
                  <input id="ct-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" minLength={7} className="field-light" placeholder="03XX XXXXXXX" />
                </div>
                <div>
                  <label htmlFor="ct-subject" className="label-light">Subject</label>
                  <select id="ct-subject" name="subject" className="field-light" defaultValue="General enquiry">
                    <option>General enquiry</option>
                    <option>Catering &amp; events</option>
                    <option>Bulk / office order</option>
                    <option>Feedback</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-message" className="label-light">Message</label>
                  <textarea id="ct-message" name="message" required rows={5} className="field-light resize-none" placeholder="How can we help?" />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={state.kind === "sending"}
                    className="inline-flex h-14 w-full items-center justify-center gap-2 bg-ink-900 px-8 text-[0.78rem] font-bold uppercase tracking-[0.14em] text-cream-50 transition-colors hover:bg-ink-600 disabled:opacity-60 sm:w-auto"
                  >
                    {state.kind === "sending" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream/30 border-t-cream" aria-hidden="true" /> Sending…
                      </>
                    ) : (
                      <>
                        Send Message <Icon name="arrow" className="h-4 w-4" />
                      </>
                    )}
                  </button>
                  {state.kind === "error" && <p role="alert" className="mt-3 text-sm text-ember-500">Something went wrong. Please try again or call us.</p>}
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
