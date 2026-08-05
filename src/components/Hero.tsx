import { btn, btnOutline, eyebrow, wrap } from "@/lib/styles";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-[52px] sm:py-[76px] sm:pb-[60px]" id="top">
      <div
        className={`${wrap} grid items-center gap-7 min-[821px]:grid-cols-[1.15fr_0.85fr] min-[821px]:gap-12`}
      >
        <div>
          <span className={eyebrow}>Responsabilidad Social Empresarial</span>
          <h1 className="text-[clamp(2.1rem,4vw,3.1rem)] leading-[1.12]">
            Hay vínculos que, con acompañamiento,{" "}
            <em className="not-italic text-tierra [background:linear-gradient(180deg,transparent_62%,rgba(232,164,74,0.45)_62%)]">
              vuelven a construirse
            </em>
            .
          </h1>
          <p className="my-[18px] mb-[30px] max-w-[52ch] text-[1.05rem] text-body sm:text-[1.12rem]">
            Casa Liber acompaña a mujeres y a sus hijas e hijos en el proceso de
            salida del encierro, para que puedan reconstruir juntos un proyecto
            de vida. Tu empresa puede ser parte de ese sostén.
          </p>
          <div className="flex flex-wrap gap-2.5 sm:gap-3.5">
            <a className={`${btn} w-full text-center sm:w-auto`} href="#niveles">
              Conocé cómo sumarte
            </a>
            <a
              className={`${btnOutline} w-full text-center sm:w-auto`}
              href="#quienes"
            >
              Conocé nuestro trabajo
            </a>
          </div>
        </div>
        <div className="w-full max-w-[260px] justify-self-center sm:max-w-[360px]" aria-hidden="true">
          <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
            <circle cx="160" cy="160" r="150" fill="var(--color-crema-alt)" />
            <path
              d="M115 210 C60 170, 60 90, 120 70 C160 57, 190 85, 185 120 C180 150, 145 155, 140 130"
              fill="none"
              stroke="var(--color-verde)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M205 110 C260 150, 260 230, 200 250 C160 263, 130 235, 135 200 C140 170, 175 165, 180 190"
              fill="none"
              stroke="var(--color-tierra)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <circle cx="140" cy="128" r="9" fill="var(--color-miel)" />
            <circle cx="180" cy="192" r="9" fill="var(--color-miel)" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export function Divider() {
  return (
    <div className="mx-auto flex items-center justify-center gap-3.5 pt-1.5" aria-hidden="true">
      <svg viewBox="0 0 64 28" className="h-7 w-16">
        <path
          d="M2 20 C 18 2, 30 26, 46 8 C 52 2, 58 8, 62 14"
          fill="none"
          stroke="#C4622D"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
