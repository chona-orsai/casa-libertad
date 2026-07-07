"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const NAV_LINKS = [
  { href: "#quienes", label: "Quiénes somos" },
  { href: "#programas", label: "Cómo trabajamos" },
  { href: "#niveles", label: "Sumá tu empresa" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header>
      <div className="nav wrap">
        <a
          href="#top"
          aria-label="Casa Liber — inicio"
          style={{ textDecoration: "none" }}
        >
          <Logo />
        </a>

        <nav className="nav-links" aria-label="Navegación principal">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
          <a className="btn" href="#niveles">
            Sumá tu empresa
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </div>

      <nav
        id="mobile-menu"
        className="mobile-menu"
        data-open={open}
        aria-label="Navegación móvil"
      >
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a className="btn" href="#niveles" onClick={() => setOpen(false)}>
              Sumá tu empresa
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
