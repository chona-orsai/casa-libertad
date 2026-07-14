import type { Metadata } from "next";
import Link from "next/link";
import { ChalkFilter } from "@/components/ChalkFilter";
import { Logo } from "@/components/Logo";
import { btn, wrap } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Gracias — Club de Amigos | Casa Liber",
  description:
    "Gracias por sumarte al Club de Amigos de Casa Liber. Tu aporte mensual sostiene a madres y a sus hijas e hijos.",
  robots: { index: false, follow: false },
};

export default function GraciasPage() {
  return (
    <>
      <ChalkFilter />
      <main className="relative flex min-h-dvh flex-col overflow-hidden bg-crema">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(232,164,74,0.22),transparent_55%),radial-gradient(ellipse_at_90%_80%,rgba(45,106,79,0.14),transparent_50%)]"
        />

        <header className={`${wrap} relative z-10 pt-8 sm:pt-10`}>
          <Link href="/" aria-label="Casa Liber — inicio" className="no-underline">
            <Logo />
          </Link>
        </header>

        <section
          className={`${wrap} relative z-10 flex flex-1 flex-col items-center justify-center py-16 text-center sm:py-20`}
        >
          <p className="mb-4 text-[0.8rem] font-bold tracking-[1.5px] text-verde uppercase">
            Club de Amigos
          </p>
          <h1 className="max-w-[18ch] text-balance text-[clamp(2rem,5vw,3.25rem)] leading-[1.15]">
            Gracias por sumarte
          </h1>
          <p className="mt-4 max-w-[38ch] text-[1.05rem] text-body">
            Tu aporte mensual de $6.000 forma parte de la red que sostiene a estas
            familias. Mercado Pago te va a confirmar el cobro por mail.
          </p>
          <Link className={`${btn} mt-9`} href="/">
            Volver al inicio
          </Link>
        </section>
      </main>
    </>
  );
}
