import Image from "next/image";
import { deals, savingsPercent } from "@/data/deals";
import { media } from "@/data/media";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { AddToCart } from "@/components/cart/AddToCart";

export function Deals() {
  const [featured, ...rest] = deals;
  return (
    <section id="deals" aria-labelledby="deals-title" className="section overflow-hidden bg-ink-900">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-ember-600/10 blur-[120px]" />
      <div className="container relative">
        <SectionHeading
          id="deals-title"
          eyebrow="Offers"
          title={
            <>
              Special <em className="text-copper-300">Deals</em>
            </>
          }
          subtitle="Complete meals, thoughtfully put together — more to share, better value for the table."
        />

        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Featured deal */}
          {featured && (
            <Reveal as="article" className="group card-frame relative grid overflow-hidden lg:col-span-7 lg:row-span-2">
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[640px]">
                <Image src={media[featured.image].src} alt={media[featured.image].alt} fill sizes="(min-width:1024px) 58vw, 100vw" className="img-zoom object-cover" />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/55 to-transparent lg:via-ink-900/35" />
              </div>
              <div className="relative -mt-40 p-6 sm:p-9 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:p-10">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <SavingsBadge percent={savingsPercent(featured)} />
                  {featured.serves && <span className="border border-cream/25 px-3 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cream-100">{featured.serves}</span>}
                </div>
                <h3 className="font-display text-4xl text-cream-50 sm:text-5xl">{featured.name}</h3>
                <p className="mt-2 text-lg italic text-cream-200/80">{featured.tagline}</p>
                <IncludedList items={featured.includes} columns />
                <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <PriceBlock original={featured.originalPrice} price={featured.price} large />
                  <AddToCart item={{ id: featured.id, name: featured.name, price: featured.price, image: media[featured.image].src }} label="Order Now" variant="compact" className="sm:w-56" />
                </div>
              </div>
            </Reveal>
          )}

          {rest.map((deal, i) => (
            <Reveal key={deal.id} delay={i * 120} as="article" className="group card-frame flex flex-col overflow-hidden sm:flex-row lg:col-span-5">
              <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:w-[42%] sm:shrink-0">
                <Image src={media[deal.image].src} alt={media[deal.image].alt} fill sizes="(min-width:1024px) 18vw, (min-width:640px) 40vw, 100vw" className="img-zoom object-cover" />
                <div className="absolute left-3 top-3">
                  <SavingsBadge percent={savingsPercent(deal)} />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                {deal.ribbon && <p className="mb-3 inline-flex w-fit bg-ember-500 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-eyebrow text-cream-50">{deal.ribbon}</p>}
                <h3 className="font-display text-[1.85rem] leading-tight text-cream-50">{deal.name}</h3>
                <p className="mt-1 text-[0.95rem] italic text-cream-200/70">{deal.tagline}</p>
                <IncludedList items={deal.includes} />
                <div className="mt-auto flex flex-col gap-4 pt-6">
                  <PriceBlock original={deal.originalPrice} price={deal.price} />
                  <AddToCart item={{ id: deal.id, name: deal.name, price: deal.price, image: media[deal.image].src }} label="Order Now" variant="compact" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-cream-300/72">Deals are subject to availability and may change without notice.</p>
      </div>
    </section>
  );
}

function SavingsBadge({ percent }: { percent: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-ember-500 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cream-50">
      <Icon name="sparkle" className="h-3 w-3" fill="currentColor" /> Save {percent}%
    </span>
  );
}

function IncludedList({ items, columns }: { items: string[]; columns?: boolean }) {
  return (
    <ul className={`mt-5 grid gap-x-6 gap-y-2 text-sm text-cream-200/80 ${columns ? "sm:grid-cols-2" : ""}`} aria-label="Included">
      {items.map((it) => (
        <li key={it} className="flex items-start gap-2.5">
          <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-copper-400" />
          {it}
        </li>
      ))}
    </ul>
  );
}

function PriceBlock({ original, price, large }: { original: number; price: number; large?: boolean }) {
  return (
    <div className="flex items-baseline gap-3">
      <p className={`font-display text-copper-300 ${large ? "text-4xl" : "text-3xl"}`}>
        <span className="sr-only">Deal price: </span>
        {formatPrice(price)}
      </p>
      <p className="text-sm text-cream-300/72 line-through">
        <span className="sr-only">Regular price: </span>
        {formatPrice(original)}
      </p>
    </div>
  );
}
