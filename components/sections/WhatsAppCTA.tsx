import Image from "next/image";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { whatsappLink } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export function WhatsAppCTA() {
  return (
    <section aria-labelledby="wa-title" className="relative bg-ink-900 py-20 md:py-24">
      <div className="container">
        <Reveal className="relative isolate overflow-hidden border border-cream/[0.08] bg-[#0E1D15]">
          <Image src={media.chickenKarahi.src} alt="" fill sizes="(min-width:1024px) 50vw, 100vw" className="-z-10 object-cover object-right opacity-40 [mask-image:linear-gradient(to_right,transparent_20%,black_75%)]" loading="lazy" />
          <div className="grid items-center gap-10 px-6 py-12 sm:px-12 md:grid-cols-[1fr_auto] md:py-16 lg:px-16">
            <div className="max-w-xl">
              <span className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-[#1E7048] text-white">
                <Icon name="whatsapp" className="h-7 w-7" />
              </span>
              <h2 id="wa-title" className="font-display text-[2.3rem] leading-[1.05] text-cream-50 sm:text-5xl">Prefer WhatsApp?</h2>
              <p className="mt-4 text-lg text-cream-200/80">Message us directly and place your order with ease.</p>
              <p className="mt-2 text-sm text-cream-300/72">{site.contact.whatsappDisplay}</p>
            </div>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-16 items-center justify-center gap-3 bg-[#1E7048] px-9 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#23804F] hover:shadow-[0_12px_30px_-10px_rgba(37,145,92,0.7)]"
            >
              <Icon name="whatsapp" className="h-5 w-5" /> Order on WhatsApp
              <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
