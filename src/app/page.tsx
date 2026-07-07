import { ChalkFilter } from "@/components/ChalkFilter";
import { Header } from "@/components/Header";
import { Hero, Divider } from "@/components/Hero";
import { Quienes } from "@/components/Quienes";
import { Programas } from "@/components/Programas";
import { WhyJoin } from "@/components/WhyJoin";
import { Niveles } from "@/components/Niveles";
import { Club } from "@/components/Club";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#quienes">
        Saltar al contenido
      </a>
      <ChalkFilter />
      <Header />
      <main>
        <Hero />
        <Divider />
        <Quienes />
        <Programas />
        <WhyJoin />
        <Niveles />
        <Club />
      </main>
      <SiteFooter />
    </>
  );
}
