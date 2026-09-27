import { whyChamcha } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";

export function WhyChamcha() {
  return (
    <section aria-labelledby="why-title" className="section grain bg-ink-800">
      <div className="container">
        <SectionHeading
          id="why-title"
          eyebrow="The Chamcha Standard"
          title={
            <>
              Why Guests Choose <em className="text-copper-300">Chamcha</em>
            </>
          }
          align="center"
        />
        <div className="grid border-l border-t border-cream/[0.08] sm:grid-cols-2 lg:grid-cols-3">
          {whyChamcha.map((b, i) => (
            <Reveal key={b.title} delay={(i % 3) * 90} className="group relative border-b border-r border-cream/[0.08] p-8 transition-colors duration-500 hover:bg-cream/[0.025] sm:p-10">
              <span aria-hidden="true" className="absolute left-0 top-0 h-px w-0 bg-copper-500 transition-all duration-700 ease-luxe group-hover:w-full" />
              <div className="mb-8 flex items-center justify-between">
                <span className="grid h-14 w-14 place-items-center border border-copper-500/35 text-copper-400 transition-all duration-500 group-hover:border-copper-400 group-hover:bg-copper-500 group-hover:text-ink-900">
                  <Icon name={b.icon} className="h-6 w-6" />
                </span>
                <span aria-hidden="true" className="font-display text-3xl italic text-cream/25">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="font-display text-[1.65rem] text-cream-50">{b.title}</h3>
              <p className="mt-3 leading-relaxed text-cream-200/65">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
