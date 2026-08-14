import { eyebrow, wrap } from "@/lib/styles";

const PILLS = [
  "Enfoque interdisciplinario",
  "Acompañamiento integral individual a hombres y mujeres",
  "Vinculación mujeres-madres e hijos/as",
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
            Un equipo interdisciplinario, comprometido con las trayectorias
            vitales
          </h2>
          <p className="text-muted">
            Somos una asociación civil integrada por psicólogos, trabajadores
            sociales y voluntarios que, desde 2020, acompaña a personas que
            atraviesan la salida de la cárcel.
          </p>
          <p className="text-muted">
            Una parte fundamental de nuestro trabajo está orientado al vínculo
            entre mujeres con sus hijas e hijos, que puedan sostener y
            fortalecer esos lazos, en la búsqueda de una autonomía progresiva.
          </p>
          <p className="text-muted">
            Aunque nacimos en La Plata, trabajamos con un modelo pensado para
            escalar: dialogamos entre instituciones estatales, nacionales,
            provinciales y locales, asociaciones civiles y fundaciones, y
            proyectamos nuestro trabajo a nivel nacional.
          </p>
          <ul className="mt-[18px] grid gap-2 sm:flex sm:flex-wrap sm:gap-2.5">
            {PILLS.map((pill) => (
              <li
                className="rounded-full border border-verde/25 bg-white px-3.5 py-1.5 text-center text-[0.82rem] font-semibold text-verde sm:w-auto sm:text-left"
                key={pill}
              >
                {pill}
              </li>
            ))}
          </ul>
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
              y="90"
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
              y="140"
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
              y="200"
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
