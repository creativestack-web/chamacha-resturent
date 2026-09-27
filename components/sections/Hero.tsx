import Image from "next/image";
import { hero } from "@/data/content";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink-900 pb-16 pt-32 sm:items-center sm:pb-24">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={media.hero.src}
          alt={media.hero.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={80}
          className="animate-kenburns object-cover object-[68%_center] sm:object-center"
        />
        {/* Layered overlays keep type readable while letting the food glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/75 to-ink-900/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-ink-900/50" />
        <div className="absolute inset-0 bg-ink-900/25 sm:hidden" />
      </div>

      <div className="container relative">
        <div className="max-w-[46rem]">
          <p className="mb-7 flex animate-rise items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-300" style={{ animationDelay: "150ms" }}>
            <span aria-hidden="true" className="h-px w-10 bg-copper-400" />
            {hero.eyebrow}
          </p>

          <h1 id="hero-title" className="font-display text-[2.9rem] leading-[0.98] tracking-[-0.015em] text-cream-50 xs:text-[3.3rem] sm:text-7xl lg:text-[5.6rem] 2xl:text-[6.2rem]">
            <span className="block animate-rise" style={{ animationDelay: "280ms" }}>
              {hero.headline[0]}
            </span>
            <span className="block animate-rise italic text-copper-300" style={{ animationDelay: "420ms" }}>
              {hero.headline[1]}
            </span>
          </h1>

          <p className="mt-7 max-w-xl animate-rise text-[1.05rem] leading-relaxed text-cream-200/85 sm:text-lg" style={{ animationDelay: "560ms" }}>
            {hero.text}
          </p>

          <div className="mt-10 flex animate-rise flex-col gap-3 xs:flex-row" style={{ animationDelay: "700ms" }}>
            <ButtonLink href={site.ordering.orderUrl} size="lg" className="w-full xs:w-auto">
              Order Online <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="#menu" variant="outline" size="lg" className="w-full xs:w-auto">
              Explore Menu
            </ButtonLink>
          </div>

          <ul className="mt-12 flex animate-rise flex-wrap items-center gap-x-5 gap-y-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-cream-200/70" style={{ animationDelay: "840ms" }} aria-label="Services">
            {hero.utilities.map((u, i) => (
              <li key={u} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden="true" className="h-1 w-1 rotate-45 bg-copper-500" />}
                {u}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#order-now"
        className="absolute bottom-8 right-8 hidden animate-fade flex-col items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-cream-200/60 transition-colors hover:text-copper-300 lg:flex"
        style={{ animationDelay: "1400ms" }}
        aria-label="Scroll to ordering options"
      >
        <span className="[writing-mode:vertical-rl]">Scroll</span>
        <span className="h-14 w-px bg-gradient-to-b from-copper-400 to-transparent" />
      </a>
    </section>
  );
}
