import { eyebrow, wrap } from "@/lib/styles";

const PILLS = [
  "Enfoque multidisciplinario",
  "Vinculación madres e hijos",
  "Proyección nacional",
];

export function Quienes() {
  return (
    <section id="quienes" className="scroll-mt-header py-12 sm:py-16">
      <div
        className={`${wrap} grid items-center gap-[52px] min-[821px]:grid-cols-2`}
      >
        <div>
          <span className={eyebrow}>Quiénes somos</span>
          <h2>
            Un equipo multidisciplinario, un solo objetivo: sostener el vínculo
          </h2>
          <p className="text-muted">
            Somos una asociación civil que acompaña, con un equipo integrado de
            psicología, trabajo social y acompañamiento legal, a mujeres que
            atraviesan la salida de un contexto de encierro. Todo nuestro
            trabajo está orientado a un mismo eje: que el vínculo entre una madre
            y sus hijas e hijos pueda sostenerse y reconstruirse, en lugar de
            romperse por el camino.
          </p>
          <p className="text-muted">
            Aunque nacimos en La Plata, trabajamos con un modelo pensado para
            escalar: dialogamos con el sistema penitenciario provincial y con la
            Iglesia, y proyectamos nuestro trabajo a nivel nacional.
          </p>
          <div className="mt-[18px] flex flex-wrap gap-2.5">
            {PILLS.map((pill) => (
              <span
                className="rounded-full border border-verde/25 bg-white px-3.5 py-1.5 text-[0.82rem] font-semibold text-verde"
                key={pill}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full max-w-[260px] justify-self-center sm:max-w-[360px]" aria-hidden="true">
          <svg viewBox="0 0 320 260" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="10"
              y="10"
              width="300"
              height="240"
              rx="24"
              fill="#fff"
              stroke="rgba(43,33,27,0.08)"
            />
            <text
              x="160"
              y="70"
              textAnchor="middle"
              fontFamily="Fraunces, serif"
              fontSize="15"
              fill="#2D6A4F"
              fontWeight="700"
            >
              Psicología
            </text>
            <text
              x="160"
              y="120"
              textAnchor="middle"
              fontFamily="Fraunces, serif"
              fontSize="15"
              fill="#C4622D"
              fontWeight="700"
            >
              Trabajo social
            </text>
            <text
              x="160"
              y="170"
              textAnchor="middle"
              fontFamily="Fraunces, serif"
              fontSize="15"
              fill="#2D6A4F"
              fontWeight="700"
            >
              Acompañamiento legal
            </text>
            <text
              x="160"
              y="220"
              textAnchor="middle"
              fontFamily="Fraunces, serif"
              fontSize="16"
              fill="#E8A44A"
              fontWeight="700"
            >
              → Vínculo sostenido
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
