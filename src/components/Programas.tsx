const STAGES = [
  {
    flagship: true,
    tag: "Etapa residencial",
    title: "Casa Magma",
    text: "Dispositivo residencial, alternativo al encierro, para madres con hijas e hijos pequeños. El espacio donde se sostiene la crianza acompañada y se prepara la reunificación familiar.",
  },
  {
    flagship: false,
    tag: "Etapa de externación",
    title: "Acompañamiento Autónomo",
    text: "Sostén psicosocial personalizado para quienes atraviesan la externación con mayor autonomía, sin perder el acompañamiento cercano.",
  },
  {
    flagship: false,
    tag: "Etapa de autonomía económica",
    title: "Polo Productivo",
    text: "Formación e inserción laboral con modelo cooperativo, para sostener en el tiempo el proyecto de vida y el vínculo familiar recuperado.",
  },
];

export function Programas() {
  return (
    <section id="programas" className="alt">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Cómo trabajamos</span>
          <h2>Un mismo camino, tres etapas de acompañamiento</h2>
        </div>
        <div className="stages">
          {STAGES.map((stage) => (
            <div
              key={stage.title}
              className={`stage${stage.flagship ? " flagship" : ""}`}
            >
              {stage.flagship && (
                <span className="flagship-badge">Programa insignia</span>
              )}
              <span className="stage-tag">{stage.tag}</span>
              <h3>{stage.title}</h3>
              <p>{stage.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
