"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gallery, type GalleryCategory } from "@/data/content";
import { media } from "@/data/media";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";

const filters: ("All" | GalleryCategory)[] = ["All", "Food", "BBQ", "Restaurant", "Family Dining", "Behind the Scenes"];

export function Gallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const items = useMemo(() => (filter === "All" ? gallery : gallery.filter((g) => g.category === filter)), [filter]);

  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") {
        e.preventDefault(); // keep focus inside the lightbox controls
        closeRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      triggerRef.current?.focus();
    };
  }, [open, step]);

  const current = open !== null ? items[open] : null;

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="section bg-ink-800 grain">
      <div className="container">
        <SectionHeading
          id="gallery-title"
          eyebrow="Gallery"
          title={
            <>
              A Feast for the <em className="text-copper-300">Eyes</em>
            </>
          }
          subtitle="Dishes, flames and moments from the Chamcha kitchen and dining room."
        />

        <div className="no-scrollbar -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter gallery">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "h-11 shrink-0 border px-5 text-[0.72rem] font-semibold uppercase tracking-[0.14em] transition-all duration-300",
                filter === f ? "border-copper-500 bg-copper-500 text-ink-900" : "border-cream/15 text-cream-200/75 hover:border-cream/40 hover:text-cream-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div key={filter} className="animate-fade columns-1 gap-5 xs:columns-2 lg:columns-3 [&>*]:mb-5">
          {items.map((g, i) => {
            const m = media[g.image];
            return (
              <button
                key={`${g.image}-${i}`}
                type="button"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setOpen(i);
                }}
                className="group relative block w-full break-inside-avoid overflow-hidden bg-ink-700 text-left"
                aria-label={`View larger: ${g.caption}`}
              >
                <div className={cn("relative w-full", g.tall ? "aspect-[3/4]" : "aspect-[4/3]")}>
                  <Image src={m.src} alt={m.alt} fill sizes="(min-width:1024px) 33vw, (min-width:400px) 50vw, 100vw" className="img-zoom object-cover" loading="lazy" />
                </div>
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink-900/85 via-transparent to-transparent p-5 opacity-100 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                  <div className="flex w-full items-end justify-between gap-3">
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-300">{g.category}</p>
                      <p className="font-display text-xl text-cream-50">{g.caption}</p>
                    </div>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cream/30 text-cream-50">
                      <Icon name="plus" className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {current && (
        <div role="dialog" aria-modal="true" aria-label={current.caption} className="fixed inset-0 z-[95] flex animate-fade items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-10" onClick={() => setOpen(null)}>
          <figure className="relative flex max-h-full w-full max-w-6xl flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-[70vh] w-full">
              <Image src={media[current.image].src} alt={media[current.image].alt} fill sizes="100vw" className="object-contain" />
            </div>
            <figcaption className="mt-5 text-center">
              <p className="text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-300">{current.category}</p>
              <p className="font-display text-2xl text-cream-50">{current.caption}</p>
              <p className="mt-1 text-xs text-cream-300/72">
                {(open ?? 0) + 1} / {items.length}
              </p>
            </figcaption>
          </figure>
          <button ref={closeRef} type="button" onClick={() => setOpen(null)} className="absolute right-4 top-4 grid h-12 w-12 place-items-center border border-cream/20 text-cream-50 hover:border-copper-400 sm:right-8 sm:top-8" aria-label="Close image">
            <Icon name="close" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-cream/20 bg-black/40 text-cream-50 hover:border-copper-400 sm:left-8" aria-label="Previous image">
            <Icon name="chevronLeft" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-cream/20 bg-black/40 text-cream-50 hover:border-copper-400 sm:right-8" aria-label="Next image">
            <Icon name="chevronRight" />
          </button>
        </div>
      )}
    </section>
  );
}
