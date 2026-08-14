import { eyebrow, sectionAlt, sectionHead, wrap } from "@/lib/styles";

const REASONS = [
  {
    title: "Impacto medible",
    text: "Tu aporte se destina a un programa concreto —por ejemplo, Casa Magma— con objetivos claros de reunificación familiar.",
  },
  {
    title: "Una causa que conecta",
    text: "Familia, infancia y segundas oportunidades son temas que movilizan tanto puertas adentro de tu empresa como frente a tu comunidad.",
  },
  {
    title: "Trayectoria e institucionalidad",
    text: "Trabajamos en articulación con instituciones estatales, nacionales, provinciales y locales, asociaciones civiles y fundaciones.",
  },
  {
    title: "Visibilidad institucional",
    text: "Tu empresa puede aparecer asociada a Casa Liber en nuestra comunicación, según el nivel de apoyo elegido.",
  },
];

export function WhyJoin() {
  return (
    <section className={sectionAlt}>
      <div className={wrap}>
        <div className={sectionHead}>
          <span className={`${eyebrow} text-center`}>
            Por qué asociar tu empresa
          </span>
          <h2>
            Un impacto concreto, con respaldo institucional&nbsp;real
          </h2>
        </div>
        <div className="grid gap-[22px] min-[761px]:grid-cols-2">
          {REASONS.map((reason) => (
            <div
              className="rounded-2xl border border-ink/[0.07] bg-white p-5 sm:p-[26px]"
              key={reason.title}
            >
              <h3 className="mb-2 text-[1.05rem] text-verde">{reason.title}</h3>
              <p className="m-0 text-[0.95rem] text-body">{reason.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
