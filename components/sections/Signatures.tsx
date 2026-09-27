import Image from "next/image";
import { signatureItemIds } from "@/data/content";
import { media } from "@/data/media";
import { menuItems } from "@/data/menu";
import { formatPrice } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { AddToCart, FavoriteButton } from "@/components/cart/AddToCart";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function Signatures() {
  const items = signatureItemIds.map((id) => menuItems.find((m) => m.id === id)).filter((m): m is NonNullable<typeof m> => !!m);

  return (
    <section id="specialties" aria-labelledby="signatures-title" className="section bg-ink-900">
      <div className="container">
        <SectionHeading
          id="signatures-title"
          eyebrow="Our Specialties"
          title={
            <>
              Our Signature <em className="text-copper-300">Favorites</em>
            </>
          }
          subtitle="The dishes our guests come back for."
          action={
            <ButtonLink href="#menu" variant="outline">
              Full Menu <Icon name="arrow" className="h-4 w-4" />
            </ButtonLink>
          }
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item, i) => {
            const m = media[item.image];
            const badge = item.chefsChoice ? "Chef’s Choice" : item.popular ? "Popular" : null;
            return (
              <Reveal key={item.id} delay={(i % 3) * 90} as="article" className="group card-frame flex flex-col overflow-hidden transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-copper-500/30">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink-700">
                  <Image src={m.src} alt={m.alt} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="img-zoom object-cover" />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-transparent" />
                  {badge && (
                    <span className={`absolute left-4 top-4 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] ${item.chefsChoice ? "bg-copper-500 text-ink-900" : "bg-cream-100 text-ink-900"}`}>
                      {badge}
                    </span>
                  )}
                  <FavoriteButton id={item.id} name={item.name} className="absolute right-4 top-4" />
                  <span className="absolute bottom-4 left-4 font-display text-sm italic text-cream-100/80">No. {String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-[1.7rem] leading-tight text-cream-50">{item.name}</h3>
                    <p className="shrink-0 font-display text-xl text-copper-300">
                      <span className="sr-only">Price: </span>
                      {formatPrice(item.price)}
                    </p>
                  </div>
                  {item.serving && <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cream-300/72">{item.serving}</p>}
                  <p className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-cream-200/70">{item.description}</p>
                  <AddToCart item={{ id: item.id, name: item.name, price: item.price, image: m.src }} className="mt-6" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
