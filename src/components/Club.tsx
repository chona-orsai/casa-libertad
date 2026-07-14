import { section, wrap } from "@/lib/styles";

const CHECKOUT_URL = process.env.MERCADOPAGO_PREAPPROVAL_PLAN_ID
  ? `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${process.env.MERCADOPAGO_PREAPPROVAL_PLAN_ID}`
  : "mailto:casalibertadlaplata@gmail.com";

export function Club() {
  return (
    <section id="club" className={section}>
      <div className={wrap}>
        <div className="rounded-3xl bg-verde-deep px-5 py-10 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="flex flex-col gap-8 min-[821px]:flex-row min-[821px]:items-center min-[821px]:justify-between min-[821px]:gap-12">
            <div className="min-w-0 flex-1">
              <span className="mb-3.5 block text-[0.8rem] font-bold tracking-[1.5px] text-miel uppercase">
                Club de Amigos de Casa Liber
              </span>
              <h2 className="max-w-[28ch] text-balance text-white min-[821px]:max-w-none">
                ¿Preferís sumarte vos, en lugar de tu empresa?
              </h2>
              <p className="mt-3 max-w-[52ch] text-[#dfe9e3]">
                El Club de Amigos de Casa Liber es nuestra comunidad de aportantes
                mensuales. No sos un donante más: sos parte de la red que sostiene
                a estas familias en el tiempo.
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-5 border-t border-white/15 pt-6 min-[821px]:w-auto min-[821px]:min-w-[14.5rem] min-[821px]:border-t-0 min-[821px]:border-l min-[821px]:pt-0 min-[821px]:pl-10">
              <div className="min-[821px]:text-right">
                <p className="m-0 text-[0.72rem] font-bold tracking-[1.5px] text-miel/90 uppercase">
                  Aporte mensual
                </p>
                <p className="mt-1.5 mb-0 font-display text-[2.35rem] leading-none font-bold tracking-tight text-white">
                  {"$6.000"}
                </p>
                <p className="mt-1.5 mb-0 text-[0.9rem] text-[#dfe9e3]">
                  por mes
                </p>
              </div>
              <a
                className="inline-block w-full cursor-pointer rounded-full border-none bg-miel px-7 py-3.5 text-center text-[0.95rem] font-bold text-ink no-underline transition-transform duration-150 ease-out hover:-translate-y-0.5"
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Quiero ser Amigo/a
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
