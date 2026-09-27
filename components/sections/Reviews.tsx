"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { reviews } from "@/data/reviews";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-copper-400" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" className="h-4 w-4" fill={i < rating ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

export function Reviews() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const total = reviews.length;

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + total) % total), [total]);

  // Gentle auto-advance; pauses on hover/focus and for reduced-motion users
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => go(1), 7000);
    return () => clearInterval(t);
  }, [paused, go]);

  const r = reviews[index];

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="section overflow-hidden bg-ink-900">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper-600/[0.07] blur-[140px]" />
      <div className="container relative">
        <Reveal className="mx-auto max-w-4xl text-center">
          <Eyebrow className="mb-6 justify-center">Guest Voices</Eyebrow>
          <h2 id="reviews-title" className="font-display text-[2.4rem] leading-[1.04] text-cream-50 sm:text-5xl lg:text-[3.6rem]">
            What Our <em className="text-copper-300">Guests Say</em>
          </h2>

          <div
            className="relative mt-14"
            aria-roledescription="carousel"
            aria-label="Guest reviews"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={() => setPaused(false)}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
              touchX.current = null;
            }}
          >
            <Icon name="quote" className="mx-auto h-12 w-12 text-copper-500/70" />
            <div className="relative min-h-[300px] sm:min-h-[260px]">
              <figure
                key={r.id}
                className="animate-fade"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${total}`}
              >
                <blockquote className="mt-8 font-display text-[1.55rem] leading-[1.35] text-cream-50 sm:text-[2rem] lg:text-[2.3rem]">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-9 flex flex-col items-center gap-3">
                  <Stars rating={r.rating} />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cream-100">{r.name}</p>
                  <p className="text-xs text-cream-300/72">
                    {[r.context, r.date].filter(Boolean).join(" · ")}
                  </p>
                </figcaption>
              </figure>
            </div>

            <div className="mt-10 flex items-center justify-center gap-6">
              <button type="button" onClick={() => go(-1)} className="grid h-12 w-12 place-items-center border border-cream/15 text-cream-100 transition-colors hover:border-copper-400 hover:text-copper-300" aria-label="Previous review">
                <Icon name="chevronLeft" />
              </button>
              <div className="flex items-center gap-2">
                {reviews.map((rv, i) => (
                  <button
                    key={rv.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show review ${i + 1}`}
                    aria-current={i === index}
                    className="grid h-8 w-8 place-items-center"
                  >
                    <span className={cn("block h-[3px] transition-all duration-500 ease-luxe", i === index ? "w-8 bg-copper-400" : "w-3 bg-cream/25")} />
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => go(1)} className="grid h-12 w-12 place-items-center border border-cream/15 text-cream-100 transition-colors hover:border-copper-400 hover:text-copper-300" aria-label="Next review">
                <Icon name="chevronRight" />
              </button>
            </div>
          </div>

          <ButtonLink href={site.reviewsUrl} variant="outline" className="mt-12">
            See More Reviews <Icon name="arrowUpRight" className="h-4 w-4" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
