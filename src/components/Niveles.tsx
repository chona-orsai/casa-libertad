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
    <section id="niveles" className="alt">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Sumá a tu empresa</span>
          <h2>Niveles de apoyo a Casa Magma</h2>
        </div>
        <div className="tiers">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`tier${tier.mid ? " mid" : ""}`}
            >
              <div className="tier-name">{tier.name}</div>
              <div className="tier-note">{tier.note}</div>
              <ul>
                {tier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a
                className={`btn${tier.outline ? " btn-outline" : ""}`}
                href="#contacto"
              >
                Quiero sumarme
              </a>
            </div>
          ))}
        </div>
        <p
          className="to-confirm"
          style={{ textAlign: "center", marginTop: 24 }}
        >
          Montos y beneficios finales de cada nivel: a confirmar antes de
          publicar.
        </p>
      </div>
    </section>
  );
}
