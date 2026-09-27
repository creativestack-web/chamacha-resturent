import type { ReactNode } from "react";
import Link from "next/link";
import { branches, site } from "@/data/site";
import { telLink, whatsappLink } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "./Logo";

const explore = [
  { label: "Home", href: "/#top" },
  { label: "Menu", href: "/#menu" },
  { label: "About", href: "/#about" },
  { label: "Deals", href: "/#deals" },
  { label: "Gallery", href: "/#gallery" },
];

const customer = [
  { label: "Order Online", href: site.ordering.orderUrl },
  { label: "Delivery", href: "/#ordering" },
  { label: "Pickup", href: "/#ordering" },
  { label: "Reservations", href: "/#reservations" },
  { label: "Contact", href: "/#contact" },
];

function Col({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-6 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-400">{title}</h3>
      {children}
    </div>
  );
}

const linkCls = "text-[0.95rem] text-cream-200/70 transition-colors hover:text-cream-50";

export function Footer() {
  const b = branches[0];
  return (
    <footer className="relative border-t border-cream/[0.07] bg-ink-900 pb-28 md:pb-0">
      {/* CTA band */}
      <div className="border-b border-cream/[0.07]">
        <div className="container flex flex-col items-start justify-between gap-8 py-14 md:flex-row md:items-center">
          <p className="max-w-2xl font-display text-[2rem] leading-tight text-cream-50 sm:text-[2.6rem]">
            Ready when you are. <em className="text-copper-300">Order your favorites today.</em>
          </p>
          <div className="flex w-full flex-col gap-3 xs:w-auto xs:flex-row">
            <ButtonLink href={site.ordering.orderUrl} size="lg">Order Online <Icon name="arrow" className="h-4 w-4" /></ButtonLink>
            <ButtonLink href={whatsappLink()} variant="whatsapp" size="lg"><Icon name="whatsapp" className="h-4 w-4" /> WhatsApp</ButtonLink>
          </div>
        </div>
      </div>

      <div className="container grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="sm:col-span-2 lg:col-span-4 lg:pr-10">
          <Logo />
          <p className="mt-6 max-w-sm leading-relaxed text-cream-200/65">
            Authentic Pakistani flavors — karahi, pulao, BBQ and kebabs — freshly prepared and served with warm hospitality. Dine-in, takeaway and delivery.
          </p>
        </div>

        <div className="lg:col-span-2">
          <Col title="Explore">
            <ul className="space-y-3">
              {explore.map((l) => <li key={l.label}><Link href={l.href} className={linkCls}>{l.label}</Link></li>)}
            </ul>
          </Col>
        </div>

        <div className="lg:col-span-2">
          <Col title="Customer">
            <ul className="space-y-3">
              {customer.map((l) => <li key={l.label}><Link href={l.href} className={linkCls}>{l.label}</Link></li>)}
            </ul>
          </Col>
        </div>

        <div className="lg:col-span-2">
          <Col title="Visit">
            <ul className="space-y-3 text-[0.95rem] text-cream-200/70">
              <li><a href={b.directionsUrl} target="_blank" rel="noopener noreferrer" className={linkCls}>{b.address}</a></li>
              <li><a href={telLink()} className={linkCls}>{site.contact.phoneDisplay}</a></li>
              <li>{b.hoursSummary}</li>
              <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkCls}>WhatsApp {site.contact.whatsappDisplay}</a></li>
            </ul>
          </Col>
        </div>

        <div className="lg:col-span-2">
          <Col title="Follow">
            <ul className="space-y-3">
              {([
                ["instagram", "Instagram", site.social.instagram],
                ["facebook", "Facebook", site.social.facebook],
                ["tiktok", "TikTok", site.social.tiktok],
              ] as const).map(([icon, label, href]) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center gap-2.5`}>
                    <Icon name={icon} className="h-4 w-4 text-copper-400" /> {label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </div>
      </div>

      <div className="border-t border-cream/[0.07]">
        <div className="container flex flex-col gap-3 py-7 text-xs text-cream-300/72 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Chamcha Restaurant. All rights reserved.</p>
          <p>Menu items, prices and deals are subject to change.</p>
        </div>
      </div>
    </footer>
  );
}
