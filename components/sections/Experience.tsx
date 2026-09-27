import Image from "next/image";
import { experience } from "@/data/content";
import { media } from "@/data/media";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";

/**
 * Editorial "food magazine" spread: an asymmetric grid of large photographs
 * with numbered captions.
 */
export function Experience() {
  const [a, b, c, d, e] = experience;
  return (
    <section id="experience" aria-labelledby="experience-title" className="section bg-ink-800 grain">
      <div className="container">
        <Reveal className="mb-14 grid gap-8 md:mb-20 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow className="mb-6">The Chamcha Experience</Eyebrow>
            <h2 id="experience-title" className="font-display text-[2.4rem] leading-[1.02] text-cream-50 sm:text-5xl lg:text-[4.2rem]">
              From the market <br className="hidden sm:block" />
              <em className="text-copper-300">to your table.</em>
            </h2>
          </div>
          <p className="self-end leading-relaxed text-cream-200/70 lg:col-span-4 lg:col-start-9">
            Great Pakistani food is a craft of fire, fresh produce and patience. Here&rsquo;s a glimpse behind the pass — how each plate comes together.
          </p>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-12 md:gap-8">
          <Figure item={a} className="md:col-span-5" aspect="aspect-[3/4]" sizes="(min-width:768px) 40vw, 100vw" />
          <div className="grid gap-6 md:col-span-7 md:gap-8">
            <Figure item={b} aspect="aspect-[16/10]" sizes="(min-width:768px) 56vw, 100vw" position="object-[center_40%]" />
            <div className="grid gap-6 sm:grid-cols-2 md:gap-8">
              <Figure item={c} aspect="aspect-[4/5]" sizes="(min-width:768px) 28vw, 50vw" />
              <Figure item={d} aspect="aspect-[4/5]" sizes="(min-width:768px) 28vw, 50vw" />
            </div>
          </div>
          <Figure item={e} className="md:col-span-12" aspect="aspect-[16/10] md:aspect-[21/8]" sizes="100vw" wide />
        </div>
      </div>
    </section>
  );
}

function Figure({
  item,
  className = "",
  aspect,
  sizes,
  position = "object-center",
  wide,
}: {
  item: (typeof experience)[number];
  className?: string;
  aspect: string;
  sizes: string;
  position?: string;
  wide?: boolean;
}) {
  const m = media[item.image];
  return (
    <Reveal as="figure" className={`group relative overflow-hidden bg-ink-700 ${className}`}>
      <div className={`relative ${aspect} overflow-hidden`}>
        <Image src={m.src} alt={m.alt} fill sizes={sizes} className={`img-zoom object-cover ${position}`} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/10 to-transparent" />
      </div>
      <figcaption className={`absolute inset-x-0 bottom-0 p-6 sm:p-8 ${wide ? "md:max-w-xl md:p-12" : ""}`}>
        <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-eyebrow text-copper-300">{item.kicker}</p>
        <p className={`font-display leading-tight text-cream-50 ${wide ? "text-3xl md:text-4xl" : "text-2xl"}`}>{item.title}</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-cream-200/75">{item.caption}</p>
      </figcaption>
    </Reveal>
  );
}
