import { site } from "@/data/site";
import { telLink, whatsappLink } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function QuickOrder() {
  return (
    <section id="order-now" aria-labelledby="quick-order-title" className="relative z-10 -mt-px bg-ink-900">
      <div className="container">
        <div className="relative -translate-y-0 overflow-hidden border border-copper-500/25 bg-ink-800 shadow-lift md:-mt-14">
          <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-copper-500" />
          <div className="flex flex-col gap-7 px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-9">
            <div className="max-w-xl">
              <p className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-400">
                <Icon name="clock" className="h-4 w-4" /> Fast &amp; Convenient Ordering
              </p>
              <h2 id="quick-order-title" className="font-display text-[1.75rem] leading-tight text-cream-50 sm:text-[2.1rem]">
                Hungry? Your favorites are just a few clicks away.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:flex lg:shrink-0">
              <ButtonLink href={site.ordering.orderUrl} size="lg" className="w-full lg:w-auto">
                <Icon name="bag" className="h-4 w-4" /> Order Online
              </ButtonLink>
              <ButtonLink href={whatsappLink()} variant="whatsapp" size="lg" className="w-full lg:w-auto">
                <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp Order
              </ButtonLink>
              <ButtonLink href={telLink()} variant="outline" size="lg" className="w-full lg:w-auto">
                <Icon name="phone" className="h-4 w-4" /> Call Restaurant
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
