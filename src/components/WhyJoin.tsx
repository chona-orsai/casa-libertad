const REASONS = [
  {
    title: "Impacto medible",
    text: "Tu aporte se destina a un programa concreto —Casa Magma— con objetivos claros de reunificación familiar y reinserción.",
  },
  {
    title: "Una causa que conecta",
    text: "Familia, infancia y segundas oportunidades son temas que movilizan tanto puertas adentro de tu empresa como frente a tu comunidad.",
  },
  {
    title: "Trayectoria e institucionalidad",
    text: "Trabajamos en articulación con el sistema penitenciario provincial y con actores de la sociedad civil, con años de trabajo sostenido.",
  },
  {
    title: "Visibilidad institucional",
    text: "Tu empresa puede aparecer asociada a Casa Liber en nuestra comunicación, según el nivel de apoyo elegido.",
  },
];

export function WhyJoin() {
  return (
    <section>
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Por qué asociar tu empresa</span>
          <h2>Un impacto concreto, con respaldo institucional real</h2>
        </div>
        <div className="why-grid">
          {REASONS.map((reason) => (
            <div className="why-card" key={reason.title}>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
