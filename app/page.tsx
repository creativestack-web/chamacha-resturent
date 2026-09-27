import { Hero } from "@/components/sections/Hero";
import { QuickOrder } from "@/components/sections/QuickOrder";
import { Signatures } from "@/components/sections/Signatures";
import { MenuSection } from "@/components/menu/MenuSection";
import { Deals } from "@/components/sections/Deals";
import { FamilyGroups } from "@/components/sections/FamilyGroups";
import { WhyChamcha } from "@/components/sections/WhyChamcha";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Reviews } from "@/components/sections/Reviews";
import { Gallery } from "@/components/sections/Gallery";
import { OrderingInfo } from "@/components/sections/OrderingInfo";
import { Locations } from "@/components/sections/Locations";
import { Reservation } from "@/components/sections/Reservation";
import { WhatsAppCTA } from "@/components/sections/WhatsAppCTA";
import { Contact } from "@/components/sections/Contact";
import { Social } from "@/components/sections/Social";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickOrder />
      <Signatures />
      <MenuSection />
      <Deals />
      <FamilyGroups />
      <WhyChamcha />
      <About />
      <Experience />
      <Reviews />
      <Gallery />
      <OrderingInfo />
      <Locations />
      <Reservation />
      <WhatsAppCTA />
      <Contact />
      <Social />
    </>
  );
}
