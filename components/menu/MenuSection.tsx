"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useRef, useState } from "react";
import { dealMenuItems } from "@/data/deals";
import { media } from "@/data/media";
import { menuCategories, menuItems, type MenuItem } from "@/data/menu";
import { cn, formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { AddToCart } from "@/components/cart/AddToCart";

const allItems: MenuItem[] = [...menuItems, ...dealMenuItems];

function SpiceLevel({ level }: { level: number }) {
  if (!level) return null;
  const label = level === 1 ? "Mild" : level === 2 ? "Medium spicy" : "Hot";
  return (
    <span className="inline-flex items-center gap-0.5 text-ember-400" title={label}>
      <span className="sr-only">{label}</span>
      {Array.from({ length: level }).map((_, i) => (
        <Icon key={i} name="chili" className="h-3.5 w-3.5" fill="currentColor" strokeWidth={1} />
      ))}
    </span>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  const m = media[item.image];
  return (
    <article className="group flex min-w-0 gap-4 border-b border-cream/[0.07] py-6 sm:gap-6">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden bg-ink-700 xs:h-24 xs:w-24 sm:h-32 sm:w-32">
        <Image src={m.src} alt={m.alt} fill sizes="128px" className="img-zoom object-cover" loading="lazy" />
        {item.popular && (
          <span className="absolute left-0 top-0 bg-copper-500 px-2 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink-900">Popular</span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 font-display text-[1.25rem] leading-tight text-cream-50 sm:text-[1.45rem]">{item.name}</h3>
          <span aria-hidden="true" className="mt-4 hidden h-px flex-1 border-b border-dotted border-cream/20 sm:block" />
          <p className="shrink-0 whitespace-nowrap font-display text-lg text-copper-300 sm:text-xl">
            <span className="sr-only">Price: </span>
            {formatPrice(item.price)}
          </p>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {item.serving && <span className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream-300/72">{item.serving}</span>}
          {item.vegetarian && (
            <span className="inline-flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[#7FB685]">
              <Icon name="veg" className="h-3.5 w-3.5" /> Vegetarian
            </span>
          )}
          <SpiceLevel level={item.spicy ?? 0} />
          {item.chefsChoice && <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-copper-400">Chef&rsquo;s Choice</span>}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-cream-200/65 sm:text-[0.93rem]">{item.description}</p>
        <AddToCart
          item={{ id: item.id, name: item.name, price: item.price, image: m.src }}
          label="Add"
          className="mt-4 max-w-[260px]"
          compact
          disabled={item.available === false}
        />
      </div>
    </article>
  );
}

export function MenuSection() {
  const [active, setActive] = useState<string>("popular");
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const tabsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    if (q) {
      return allItems.filter((i) => `${i.name} ${i.description}`.toLowerCase().includes(q));
    }
    if (active === "popular") return allItems.filter((i) => i.popular);
    return allItems.filter((i) => i.category === active);
  }, [active, deferred]);

  const activeLabel = deferred.trim() ? `Results for “${deferred.trim()}”` : menuCategories.find((c) => c.id === active)?.label;

  const selectCategory = (id: string, el?: HTMLButtonElement | null) => {
    setActive(id);
    setQuery("");
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="section grain bg-ink-800">
      <div className="container">
        <SectionHeading
          id="menu-title"
          eyebrow="Order Online"
          title={
            <>
              The <em className="text-copper-300">Menu</em>
            </>
          }
          subtitle="Browse by category or search for a favourite. Add dishes to your order and choose delivery or pickup at checkout."
          align="center"
        />

        {/* Controls */}
        <div className="sticky top-[64px] z-30 mb-8 border border-cream/[0.07] bg-ink-800/95 p-2.5 shadow-lift backdrop-blur-xl sm:p-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative lg:w-72 lg:shrink-0">
              <label htmlFor="menu-search" className="sr-only">Search the menu</label>
              <Icon name="search" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-300/72" />
              <input
                id="menu-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes…"
                className="field h-11 py-0 pl-10 pr-10"
                autoComplete="off"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} className="absolute right-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-cream-300/72 hover:text-cream-50" aria-label="Clear search">
                  <Icon name="close" className="h-4 w-4" />
                </button>
              )}
            </div>
            <div ref={tabsRef} className="no-scrollbar flex min-w-0 gap-1.5 overflow-x-auto [mask-image:linear-gradient(to_right,black_85%,transparent)] lg:flex-1 lg:[mask-image:none]" role="tablist" aria-label="Menu categories">
              {menuCategories.map((c) => {
                const selected = !deferred.trim() && active === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="menu-results"
                    onClick={(e) => selectCategory(c.id, e.currentTarget)}
                    className={cn(
                      "h-11 shrink-0 whitespace-nowrap px-4 text-[0.72rem] font-semibold uppercase tracking-[0.12em] transition-all duration-300",
                      selected ? "bg-copper-500 text-ink-900" : "text-cream-200/70 hover:bg-cream/[0.05] hover:text-cream-50"
                    )}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div id="menu-results" role="tabpanel" aria-live="polite" aria-label={activeLabel}>
          <div className="mb-2 flex items-baseline justify-between">
            <h3 className="font-display text-2xl italic text-cream-100">{activeLabel}</h3>
            <p className="text-xs uppercase tracking-[0.16em] text-cream-300/72">
              {results.length} {results.length === 1 ? "dish" : "dishes"}
            </p>
          </div>
          {results.length ? (
            <div key={`${active}-${deferred}`} className="grid animate-fade grid-cols-1 gap-x-14 md:grid-cols-2">
              {results.map((item) => (
                <MenuRow key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-display text-2xl text-cream-50">No dishes match “{deferred}”.</p>
              <p className="mt-2 text-sm text-cream-300/72">Try another search, or browse a category above.</p>
              <button type="button" onClick={() => setQuery("")} className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-copper-300 underline-offset-4 hover:underline">
                Clear search
              </button>
            </div>
          )}
        </div>

        <p className="mt-10 text-center text-xs text-cream-300/72">
          <SpiceIndicatorLegend /> Please tell us about any allergies when ordering.
        </p>
      </div>
    </section>
  );
}

function SpiceIndicatorLegend() {
  return (
    <span className="mr-3 inline-flex flex-wrap items-center justify-center gap-4">
      <span className="inline-flex items-center gap-1.5">
        <Icon name="chili" className="h-3.5 w-3.5 text-ember-400" fill="currentColor" strokeWidth={1} /> Spice level
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Icon name="veg" className="h-3.5 w-3.5 text-[#7FB685]" /> Vegetarian
      </span>
    </span>
  );
}
