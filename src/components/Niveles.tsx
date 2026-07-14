import { btn, btnOutline, eyebrow, section, sectionHead, wrap } from "@/lib/styles";

const TIERS = [
  {
    name: "Aliado",
    note: "Nivel de entrada",
    mid: false,
    outline: true,
    items: [
      "Mención en la web y en comunicación de agradecimiento",
      "Informe anual de impacto",
      "Aporte a definir",
    ],
  },
  {
    name: "Sostén",
    note: "Nivel intermedio",
    mid: true,
    outline: false,
    items: [
      "Todo lo del nivel Aliado",
      "Visita guiada a Casa Magma para el equipo",
      "Piezas de comunicación conjunta (redes, notas)",
      "Aporte a definir",
    ],
  },
  {
    name: "Fundador",
    note: "Nivel destacado",
    mid: false,
    outline: true,
    items: [
      "Todo lo del nivel Sostén",
      "Asociación destacada a un objetivo específico de Casa Magma",
      "Participación en eventos institucionales",
      "Aporte a definir",
    ],
  },
];

export function Niveles() {
  return (
    <section id="niveles" className={section}>
      <div className={wrap}>
        <div className={sectionHead}>
          <span className={`${eyebrow} text-center`}>Sumá a tu empresa</span>
          <h2>Niveles de apoyo a Casa Magma</h2>
        </div>
        <div className="grid items-stretch gap-[22px] min-[821px]:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-[18px] border bg-white px-5 py-6 sm:px-[26px] sm:py-[30px] ${
                tier.mid
                  ? "border-2 border-tierra shadow-[0_16px_34px_rgba(196,98,45,0.18)] min-[821px]:-translate-y-2"
                  : "border-ink/8"
              }`}
            >
              <div className="mb-1.5 font-display text-[1.3rem] font-bold text-ink">
                {tier.name}
              </div>
              <div className="mb-4 text-[0.82rem] font-semibold text-tierra">
                {tier.note}
              </div>
              <ul className="mb-[22px] grow list-none p-0 text-[0.92rem] text-body">
                {tier.items.map((item) => (
                  <li
                    key={item}
                    className="relative border-b border-ink/[0.06] py-2 pl-[22px] before:absolute before:top-[13px] before:left-0 before:text-[0.6rem] before:text-miel before:content-['◆']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <a
                className={`${tier.outline ? btnOutline : btn} text-center`}
                href="#contacto"
              >
                Quiero sumarme
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[0.78rem] text-[#8a7c6d] italic">
          Montos y beneficios finales de cada nivel: a confirmar antes de
          publicar.
        </p>
      </div>
    </section>
  );
}
