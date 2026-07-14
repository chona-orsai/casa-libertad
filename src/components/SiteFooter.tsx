import { Logo } from "./Logo";
import { wrap } from "@/lib/styles";

export function SiteFooter() {
  return (
    <footer id="contacto" className="scroll-mt-header bg-ink py-7 pt-[52px] text-[#efe6d8]">
      <div className={wrap}>
        <div className="mb-9 grid gap-8 min-[701px]:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <Logo
              className="footer-logo"
              showSubtitle={false}
              style={{ fontSize: "1.6rem" }}
            />
            <p className="mt-3.5 mb-2 text-[0.92rem] text-[#cfc3b2]">
              Asociación Civil Casa Libertad
              <br />
              La Plata, Buenos Aires, Argentina
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-sans text-[0.82rem] tracking-[1.5px] text-miel uppercase">
              Contacto
            </h4>
            <p className="mb-2 text-[0.92rem] text-[#cfc3b2]">
              <a
                href="mailto:casalibertadlaplata@gmail.com"
                className="break-words text-[#efe6d8]/85 no-underline hover:text-miel hover:opacity-100"
              >
                casalibertadlaplata@gmail.com
              </a>
            </p>
            <p className="mb-2 text-[0.92rem] text-[#cfc3b2]">
              <a
                href="https://www.casalibertad.org.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="break-words text-[#efe6d8]/85 no-underline hover:text-miel hover:opacity-100"
              >
                www.casalibertad.org.ar
              </a>
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-sans text-[0.82rem] tracking-[1.5px] text-miel uppercase">
              Explorar
            </h4>
            <p className="mb-2 text-[0.92rem] text-[#cfc3b2]">
              <a
                href="#quienes"
                className="text-[#efe6d8]/85 no-underline hover:text-miel hover:opacity-100"
              >
                Quiénes somos
              </a>
            </p>
            <p className="mb-2 text-[0.92rem] text-[#cfc3b2]">
              <a
                href="#programas"
                className="text-[#efe6d8]/85 no-underline hover:text-miel hover:opacity-100"
              >
                Cómo trabajamos
              </a>
            </p>
            <p className="mb-2 text-[0.92rem] text-[#cfc3b2]">
              <a
                href="#niveles"
                className="text-[#efe6d8]/85 no-underline hover:text-miel hover:opacity-100"
              >
                Sumá tu empresa
              </a>
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-[18px] text-center text-[0.78rem] text-[#a89b8a]">
          © {new Date().getFullYear()} Casa Libertad — Asociación Civil. Todos
          los vínculos importan.
        </div>
      </div>
    </footer>
  );
}
