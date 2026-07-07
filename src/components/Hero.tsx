export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div>
          <span className="eyebrow">Responsabilidad Social Empresarial</span>
          <h1>
            Hay vínculos que, con acompañamiento,{" "}
            <em>vuelven a construirse</em>.
          </h1>
          <p className="lead">
            Casa Liber acompaña a madres y a sus hijas e hijos en el proceso de
            salida del encierro, para que puedan reconstruir juntos un proyecto
            de vida. Tu empresa puede ser parte de ese sostén.
          </p>
          <div className="hero-ctas">
            <a className="btn" href="#niveles">
              Conocé cómo sumarte
            </a>
            <a className="btn btn-outline" href="#quienes">
              Conocé nuestro trabajo
            </a>
          </div>
        </div>
        <div className="bond-mark" aria-hidden="true">
          <svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
            <circle cx="160" cy="160" r="150" fill="var(--crema-alt)" />
            <path
              d="M115 210 C60 170, 60 90, 120 70 C160 57, 190 85, 185 120 C180 150, 145 155, 140 130"
              fill="none"
              stroke="var(--verde)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M205 110 C260 150, 260 230, 200 250 C160 263, 130 235, 135 200 C140 170, 175 165, 180 190"
              fill="none"
              stroke="var(--tierra)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <circle cx="140" cy="128" r="9" fill="var(--miel)" />
            <circle cx="180" cy="192" r="9" fill="var(--miel)" />
          </svg>
        </div>
      </div>
    </section>
  );
}

export function Divider() {
  return (
    <div className="divider" aria-hidden="true">
      <svg viewBox="0 0 64 28">
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
