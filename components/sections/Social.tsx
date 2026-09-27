import Image from "next/image";
import { socialTiles } from "@/data/content";
import { media } from "@/data/media";
import { site } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function Social() {
  return (
    <section aria-labelledby="social-title" className="section bg-ink-900 pb-0 md:pb-0">
      <div className="container">
        <SectionHeading
          id="social-title"
          eyebrow={site.social.instagramHandle}
          title={
            <>
              Follow the <em className="text-copper-300">Chamcha Experience</em>
            </>
          }
          subtitle="New dishes, fresh-off-the-grill moments and offers — first on our socials."
          action={
            <div className="flex flex-wrap gap-2.5">
              <ButtonLink href={site.social.instagram} variant="outline" size="sm"><Icon name="instagram" className="h-4 w-4" /> Instagram</ButtonLink>
              <ButtonLink href={site.social.facebook} variant="outline" size="sm"><Icon name="facebook" className="h-4 w-4" /> Facebook</ButtonLink>
              <ButtonLink href={site.social.tiktok} variant="outline" size="sm"><Icon name="tiktok" className="h-4 w-4" /> TikTok</ButtonLink>
            </div>
          }
        />
      </div>
      <Reveal className="grid grid-cols-3 gap-1 sm:gap-1.5 md:grid-cols-6">
        {socialTiles.map((k) => {
          const m = media[k];
          return (
            <a key={k} href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden bg-ink-700" aria-label={`${m.alt} — view on Instagram`}>
              <Image src={m.src} alt="" fill sizes="(min-width:768px) 17vw, 33vw" className="img-zoom object-cover" loading="lazy" />
              <span className="absolute inset-0 grid place-items-center bg-ink-900/0 transition-colors duration-500 group-hover:bg-ink-900/55">
                <Icon name="instagram" className="h-7 w-7 scale-75 text-cream-50 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
              </span>
            </a>
          );
        })}
      </Reveal>
    </section>
  );
}
