import { ChalkFilter } from "@/components/ChalkFilter";
import { Header } from "@/components/Header";
import { Hero, Divider } from "@/components/Hero";
import { Quienes } from "@/components/Quienes";
import { Programas } from "@/components/Programas";
import { WhyJoin } from "@/components/WhyJoin";
import { Niveles } from "@/components/Niveles";
import { Club } from "@/components/Club";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <a
        className="absolute top-0 left-[-9999px] z-[100] rounded-br-[10px] bg-verde px-[18px] py-2.5 font-bold text-white focus:left-0"
        href="#quienes"
      >
        Saltar al contenido
      </a>
      <ChalkFilter />
      <Header />
      <main>
        <Hero />
        <Club />
        <Divider />
        <Quienes />
        <Programas />
        <Niveles />
        <WhyJoin />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
