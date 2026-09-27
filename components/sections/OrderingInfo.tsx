import Image from "next/image";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { whatsappLink } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";

const steps = ["Choose your favorites", "Add to cart", "Select delivery or pickup", "Confirm your order"];

const modes: { icon: IconName; title: string; text: string; meta: string }[] = [
  { icon: "truck", title: "Delivery", text: "Get your favorite dishes delivered to your door.", meta: `Estimated ${site.ordering.estimatedDelivery}` },
  { icon: "bag", title: "Pickup", text: "Order ahead and collect when convenient.", meta: `Ready in ${site.ordering.estimatedPickup}` },
  { icon: "dine", title: "Dine-In", text: "Visit us and enjoy the full restaurant experience.", meta: "Walk in or reserve a table" },
];

export function OrderingInfo() {
  return (
    <section id="ordering" aria-labelledby="ordering-title" className="section relative isolate overflow-hidden bg-ink-900">
      <div className="absolute inset-0 -z-10">
        <Image src={media.bbq.src} alt="" fill sizes="100vw" className="object-cover opacity-[0.18]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-900/80 to-ink-900" />
      </div>
      <div className="container">
        <SectionHeading
          id="ordering-title"
          eyebrow="Delivery · Pickup · Dine-In"
          title={
            <>
              Order From <em className="text-copper-300">Chamcha</em>
            </>
          }
          subtitle="Four simple steps — from craving to your table."
          align="center"
        />

        {/* Steps */}
        <Reveal as="ol" className="relative mx-auto mb-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-copper-500/0 via-copper-500/50 to-copper-500/0 lg:block" />
          {steps.map((s, i) => (
            <li key={s} className="relative flex flex-col items-center text-center">
              <span className="relative grid h-14 w-14 place-items-center rounded-full border border-copper-500/50 bg-ink-900 font-display text-xl text-copper-300">
                {i + 1}
              </span>
              <p className="mt-4 max-w-[12rem] font-medium text-cream-100">{s}</p>
              {i < steps.length - 1 && <Icon name="arrow" className="mt-3 h-4 w-4 rotate-90 text-copper-500/60 sm:hidden" />}
            </li>
          ))}
        </Reveal>

        {/* Modes */}
        <div className="grid gap-5 md:grid-cols-3">
          {modes.map((m, i) => (
            <Reveal key={m.title} delay={i * 100} className="group card-frame p-8 transition-all duration-500 hover:-translate-y-1 hover:border-copper-500/35 sm:p-10">
              <Icon name={m.icon} className="h-9 w-9 text-copper-400" />
              <h3 className="mt-7 font-display text-3xl text-cream-50">{m.title}</h3>
              <p className="mt-3 leading-relaxed text-cream-200/70">{m.text}</p>
              <p className="mt-6 border-t border-cream/[0.08] pt-4 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream-300/72">{m.meta}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 flex flex-col items-center gap-6 text-center">
          <p className="flex flex-wrap items-center justify-center gap-2 text-cream-200/80">
            <Icon name="pin" className="h-4 w-4 text-copper-400" />
            Currently serving: <strong className="font-semibold text-cream-50">{site.ordering.deliveryAreasSummary}</strong>
          </p>
          <div className="flex w-full flex-col gap-3 xs:w-auto xs:flex-row">
            <ButtonLink href={site.ordering.orderUrl} size="lg">
              Order Online <Icon name="arrow" className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href={whatsappLink()} variant="whatsapp" size="lg">
              <Icon name="whatsapp" className="h-4 w-4" /> WhatsApp Order
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
