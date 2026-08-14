import { eyebrow, sectionAlt, sectionHead, wrap } from "@/lib/styles";

const STAGES = [
  {
    flagship: true,
    tag: "Programa para madres jefas de hogar",
    title: "Casa Magma",
    text: "Dispositivo convivencial, alternativa a la cárcel, para mujeres con hijas e hijos pequeños. Es el espacio donde se sostiene la crianza acompañada, se promueve la autonomía progresiva, el ejercicio de la ciudadanía, y se fomenta la reunificación familiar.",
  },
  {
    flagship: false,
    tag: "Salida de la cárcel",
    title: "Acompañamiento Autónomo",
    text: "Espacio destinado a las personas que deciden voluntariamente co-pensar sus trayectorias vitales entre la cárcel y la libertad, impulsando el anclaje institucional y territorial.",
  },
];

export function Programas() {
  return (
    <section id="programas" className={sectionAlt}>
      <div className={wrap}>
        <div className={sectionHead}>
          <span className={`${eyebrow} text-center`}>Cómo trabajamos</span>
          <h2>Un mismo camino, distintos espacios de acompañamiento</h2>
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
              <span
                className={`mb-2 block text-[0.72rem] font-bold tracking-wide uppercase ${
                  stage.flagship ? "text-miel" : "text-tierra"
                }`}
              >
                {stage.tag}
              </span>
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
