import Image from "next/image";
import { about } from "@/data/content";
import { media } from "@/data/media";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function About() {
  const main = media[about.image];
  const second = media[about.secondaryImage];
  return (
    <section id="about" aria-labelledby="about-title" className="section overflow-hidden bg-ink-900">
      <div className="container grid items-center gap-16 lg:grid-cols-12 lg:gap-12">
        {/* Images */}
        <Reveal className="relative lg:col-span-6">
          <div className="relative aspect-[4/5] w-[86%] overflow-hidden sm:aspect-[5/6]">
            <Image src={main.src} alt={main.alt} fill sizes="(min-width:1024px) 42vw, 86vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-10 right-0 aspect-[3/4] w-[46%] overflow-hidden border-[6px] border-ink-900 shadow-lift sm:-bottom-12">
            <Image src={second.src} alt={second.alt} fill sizes="(min-width:1024px) 22vw, 46vw" className="object-cover" />
          </div>
          <div aria-hidden="true" className="absolute -left-4 -top-4 h-28 w-28 border-l border-t border-copper-500/60 sm:-left-6 sm:-top-6" />
        </Reveal>

        {/* Story */}
        <Reveal delay={120} className="lg:col-span-6 lg:pl-8 xl:pl-14">
          <Eyebrow className="mb-6">{about.eyebrow}</Eyebrow>
          <h2 id="about-title" className="font-display text-[2.4rem] leading-[1.04] text-cream-50 sm:text-5xl lg:text-[3.6rem]">
            A Taste Worth <em className="text-copper-300">Coming Back For</em>
          </h2>
          <p className="mt-7 font-display text-xl italic leading-relaxed text-cream-100/90 sm:text-[1.4rem]">{about.lead}</p>
          {about.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="mt-5 leading-relaxed text-cream-200/70">
              {p}
            </p>
          ))}

          <dl className="mt-10 grid gap-6 border-t border-cream/[0.08] pt-8 sm:grid-cols-3">
            {about.pillars.map((pl) => (
              <div key={pl.title}>
                <dt className="mb-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-copper-400">{pl.title}</dt>
                <dd className="text-sm leading-relaxed text-cream-200/65">{pl.text}</dd>
              </div>
            ))}
          </dl>

          <ButtonLink href="#experience" variant="outline" className="mt-10">
            Discover Our Story <Icon name="arrow" className="h-4 w-4" />
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
