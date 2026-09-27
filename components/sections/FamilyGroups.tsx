import Image from "next/image";
import { familySection } from "@/data/content";
import { media } from "@/data/media";
import { whatsappLink } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function FamilyGroups() {
  const m = media[familySection.image];
  return (
    <section aria-labelledby="family-title" className="relative isolate overflow-hidden bg-cream-100 text-ink-900">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[380px] overflow-hidden sm:min-h-[480px] lg:min-h-[720px]">
          <Image src={m.src} alt={m.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-900/40 to-transparent" />
        </div>
        <div className="flex items-center px-5 py-20 sm:px-10 lg:px-16 xl:px-24">
          <Reveal className="max-w-xl">
            <Eyebrow tone="ember" className="mb-6">{familySection.eyebrow}</Eyebrow>
            <h2 id="family-title" className="font-display text-[2.4rem] leading-[1.04] sm:text-5xl lg:text-[3.5rem]">
              Good Food Is <em className="text-ember-500">Better Together.</em>
            </h2>
            <p className="mt-6 text-[1.05rem] leading-relaxed text-ink-600/85">{familySection.text}</p>
            <ul className="mt-10 divide-y divide-ink-900/10 border-y border-ink-900/10">
              {familySection.items.map((it, i) => (
                <li key={it.title} className="flex gap-5 py-4">
                  <span className="w-8 shrink-0 font-display text-lg italic text-copper-700">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="font-semibold text-ink-900">{it.title}</p>
                    <p className="text-sm text-ink-600/75">{it.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#deals" size="lg" className="bg-ink-900 text-cream-50 hover:bg-ink-600 hover:shadow-none">
                Explore Family Deals <Icon name="arrow" className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href={whatsappLink("Hello Chamcha Restaurant! I'd like to ask about a group / event order.")}
                size="lg"
                className="border border-ink-900/25 bg-transparent text-ink-900 hover:border-ink-900 hover:bg-transparent hover:shadow-none"
              >
                Plan a Group Order
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
