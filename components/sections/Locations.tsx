import { branches, site } from "@/data/site";
import { formatPrice, telLink, whatsappLink } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function OpeningHours({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const dark = tone === "dark";
  return (
    <div className={`${dark ? "card-frame" : "border border-ink-900/10 bg-white/60"} p-6 sm:p-9 ${className}`}>
      <div className="mb-6 flex items-center gap-3">
        <Icon name="clock" className={`h-5 w-5 ${dark ? "text-copper-400" : "text-copper-700"}`} />
        <h3 className={`font-display text-2xl ${dark ? "text-cream-50" : "text-ink-900"}`}>Opening Hours</h3>
      </div>
      <dl className="space-y-0">
        {site.hours.map((h) => (
          <div key={h.day} className={`flex items-baseline gap-2 border-b py-3 last:border-0 xs:gap-3 ${dark ? "border-cream/[0.07]" : "border-ink-900/10"}`}>
            <dt className={`w-[4.6rem] shrink-0 text-[0.82rem] font-medium xs:w-24 xs:text-sm sm:w-28 ${dark ? "text-cream-100" : "text-ink-900"}`}>{h.day}</dt>
            <span aria-hidden="true" className={`h-px min-w-2 flex-1 border-b border-dotted ${dark ? "border-cream/15" : "border-ink-900/20"}`} />
            <dd className={`shrink-0 text-[0.82rem] tabular-nums xs:text-sm ${dark ? "text-cream-200/75" : "text-ink-600"}`}>
              {h.open} – {h.close}
            </dd>
          </div>
        ))}
      </dl>
      <p className={`mt-5 text-xs italic ${dark ? "text-cream-300/72" : "text-ink-600/70"}`}>{site.hoursNote}</p>
    </div>
  );
}

export function Locations() {
  const primary = branches[0];
  return (
    <section id="locations" aria-labelledby="locations-title" className="section bg-ink-900">
      <div className="container">
        <SectionHeading
          id="locations-title"
          eyebrow="Visit Us"
          title={
            <>
              Find Chamcha <em className="text-copper-300">Near You</em>
            </>
          }
          subtitle="Dine with us, collect your order or have it delivered from your nearest branch."
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Map */}
          <Reveal className="relative min-h-[360px] overflow-hidden border border-cream/[0.08] bg-ink-800 lg:col-span-7 lg:min-h-[560px]">
            {primary.mapEmbedUrl ? (
              <iframe
                title={`Map showing ${site.name} — ${primary.name}`}
                src={primary.mapEmbedUrl}
                className="absolute inset-0 h-full w-full grayscale-[0.4]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <StylisedMap />
            )}
          </Reveal>

          {/* Branches */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {branches.map((b, i) => (
              <Reveal key={b.id} delay={i * 100} as="article" className="card-frame p-7 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-400">Branch {String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1.5 font-display text-[1.75rem] text-cream-50">{b.name}</h3>
                  </div>
                  <ul className="flex flex-wrap justify-end gap-1.5" aria-label="Services">
                    {b.services.map((s) => (
                      <li key={s} className="border border-cream/15 px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-cream-200/70">{s}</li>
                    ))}
                  </ul>
                </div>
                <ul className="mt-6 space-y-3 text-[0.95rem] text-cream-200/80">
                  <li className="flex gap-3"><Icon name="pin" className="mt-0.5 h-5 w-5 shrink-0 text-copper-400" /><address className="not-italic">{b.address}</address></li>
                  <li className="flex gap-3"><Icon name="phone" className="mt-0.5 h-5 w-5 shrink-0 text-copper-400" /><a href={telLink(b.phoneDial)} className="hover:text-copper-300">{b.phoneDisplay}</a></li>
                  <li className="flex gap-3"><Icon name="clock" className="mt-0.5 h-5 w-5 shrink-0 text-copper-400" />{b.hoursSummary}</li>
                </ul>
                <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  <ButtonLink href={b.directionsUrl} variant="outline" size="sm" className="w-full">
                    <Icon name="directions" className="h-4 w-4" /> Directions
                  </ButtonLink>
                  <ButtonLink href={whatsappLink(`Hello ${site.name} (${b.name})! I'd like to place an order.`, b.whatsapp)} variant="whatsapp" size="sm" className="w-full">
                    <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp
                  </ButtonLink>
                  <ButtonLink href={site.ordering.orderUrl} size="sm" className="col-span-2 w-full sm:col-span-1">
                    Order
                  </ButtonLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <OpeningHours className="lg:col-span-7" />
          <Reveal className="card-frame flex flex-col justify-between p-7 sm:p-9 lg:col-span-5">
            <div>
              <Icon name="truck" className="h-8 w-8 text-copper-400" />
              <h3 className="mt-5 font-display text-2xl text-cream-50">Delivery Areas</h3>
              <p className="mt-2 text-sm text-cream-200/65">We currently deliver to the following areas. Fees are calculated at checkout.</p>
            </div>
            <ul className="mt-6 divide-y divide-cream/[0.07] border-y border-cream/[0.07]">
              {site.ordering.deliveryAreas.map((a) => (
                <li key={a.name} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-cream-100">{a.name}</span>
                  <span className="tabular-nums text-cream-300/70">{formatPrice(a.fee)}</span>
                </li>
              ))}
            </ul>
            {site.ordering.minimumDeliveryOrder > 0 && (
              <p className="mt-4 text-xs text-cream-300/72">Minimum order for delivery: {formatPrice(site.ordering.minimumDeliveryOrder)}. Not in our area? Choose pickup, or message us on WhatsApp.</p>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Elegant illustrated map shown until a Google Maps embed URL is configured. */
function StylisedMap() {
  return (
    <div className="absolute inset-0">
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="blocks" width="60" height="60" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
            <rect width="60" height="60" fill="#141110" />
            <rect x="4" y="4" width="52" height="52" fill="#1B1715" />
          </pattern>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C4884E" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C4884E" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="600" fill="url(#blocks)" />
        <path d="M-20 420 C 180 380, 300 470, 520 400 S 760 300, 840 330" stroke="#25201D" strokeWidth="46" fill="none" />
        <path d="M-20 420 C 180 380, 300 470, 520 400 S 760 300, 840 330" stroke="#3A332E" strokeWidth="2" strokeDasharray="10 12" fill="none" />
        <path d="M300 -20 L 380 640" stroke="#25201D" strokeWidth="22" />
        <path d="M-20 160 L 840 220" stroke="#25201D" strokeWidth="16" />
        <path d="M600 -20 L 540 640" stroke="#25201D" strokeWidth="12" />
        <circle cx="420" cy="290" r="150" fill="url(#glow)" />
      </svg>
      <div className="absolute left-1/2 top-[48%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <div className="mb-3 whitespace-nowrap border border-copper-500/40 bg-ink-900/90 px-4 py-2.5 text-center shadow-lift backdrop-blur">
          <p className="font-display text-lg text-cream-50">{site.name}</p>
          <p className="text-[0.7rem] uppercase tracking-[0.16em] text-copper-300">{branches[0].name}</p>
        </div>
        <span className="relative grid h-12 w-12 place-items-center rounded-full bg-copper-500 text-ink-900 shadow-glow">
          <span className="absolute inset-0 animate-ping rounded-full bg-copper-500/40 motion-reduce:hidden" />
          <Icon name="pin" className="relative h-6 w-6" />
        </span>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 border border-cream/10 bg-ink-900/90 p-4 backdrop-blur sm:inset-x-6 sm:bottom-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-cream-200/80">
          <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-copper-400">Main Branch</span>
          {branches[0].address}
        </p>
        <ButtonLink href={branches[0].directionsUrl} size="sm">
          <Icon name="directions" className="h-4 w-4" /> Get Directions
        </ButtonLink>
      </div>
    </div>
  );
}
