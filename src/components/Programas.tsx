import { eyebrow, sectionAlt, sectionHead, wrap } from "@/lib/styles";

const STAGES = [
  {
    flagship: true,
    tag: null as string | null,
    title: "Casa Magma",
    text: "Casa convivencial, alternativa al encierro, para mujeres con hijas e hijos pequeños. El espacio donde se sostiene la crianza acompañada, se promueve la autonomía progresiva y el ejercicio de la ciudadanía, y se prepara la reunificación familiar.",
  },
  {
    flagship: false,
    tag: "Salida de la cárcel",
    title: "Acompañamiento Autónomo",
    text: "Sostén psicosocial personalizado para quienes atraviesan la salida de la cárcel con mayor autonomía, sin perder el acompañamiento cercano.",
  },
];

export function Programas() {
  return (
    <section id="programas" className={sectionAlt}>
      <div className={wrap}>
        <div className={sectionHead}>
          <span className={`${eyebrow} text-center`}>Cómo trabajamos</span>
          <h2>Un mismo camino, distintos momentos de acompañamiento</h2>
        </div>
        <div className="mx-auto grid max-w-[820px] gap-[22px] min-[821px]:grid-cols-2">
          {STAGES.map((stage) => (
            <div
              key={stage.title}
              className={`relative rounded-[18px] border px-5 py-6 sm:px-6 sm:py-7 ${
                stage.flagship
                  ? "border-none bg-verde-deep text-white shadow-[0_18px_40px_rgba(30,74,56,0.28)]"
                  : "border-ink/[0.07] bg-white"
              }`}
            >
              {stage.flagship && (
                <span className="absolute -top-3 right-5 rounded-full bg-miel px-3 py-1.5 text-[0.7rem] font-bold tracking-[0.5px] text-ink shadow-[0_4px_10px_rgba(0,0,0,0.15)]">
                  Programa insignia
                </span>
              )}
              {stage.tag && (
                <span
                  className={`mb-2 block text-[0.72rem] font-bold tracking-wide uppercase ${
                    stage.flagship ? "text-white" : "text-tierra"
                  }`}
                >
                  {stage.tag}
                </span>
              )}
              <h3
                className={`text-[1.25rem] ${stage.flagship ? "text-white" : ""}`}
              >
                {stage.title}
              </h3>
              <p
                className={`m-0 text-[0.96rem] ${
                  stage.flagship ? "text-[#dfe9e3]" : "text-body"
                }`}
              >
                {stage.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
