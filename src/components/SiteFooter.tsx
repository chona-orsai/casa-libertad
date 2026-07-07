import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer id="contacto">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Logo
              className="footer-logo"
              showSubtitle={false}
              style={{ fontSize: "1.6rem" }}
            />
            <p style={{ marginTop: 14 }}>
              Asociación Civil Casa Libertad
              <br />
              La Plata, Buenos Aires, Argentina
            </p>
          </div>
          <div>
            <h4>Contacto</h4>
            <p>
              <a href="mailto:casalibertadlaplata@gmail.com">
                casalibertadlaplata@gmail.com
              </a>
            </p>
            <p>
              <a
                href="https://www.casalibertad.org.ar"
                target="_blank"
                rel="noopener noreferrer"
              >
                www.casalibertad.org.ar
              </a>
            </p>
          </div>
          <div>
            <h4>Explorar</h4>
            <p>
              <a href="#quienes">Quiénes somos</a>
            </p>
            <p>
              <a href="#programas">Cómo trabajamos</a>
            </p>
            <p>
              <a href="#niveles">Sumá tu empresa</a>
            </p>
          </div>
        </div>
        <div className="foot-bottom">
          © {new Date().getFullYear()} Casa Libertad — Asociación Civil. Todos
          los vínculos importan.
        </div>
      </div>
    </footer>
  );
}
