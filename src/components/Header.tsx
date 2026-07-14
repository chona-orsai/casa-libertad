"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { btn, wrap } from "@/lib/styles";

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
    <header className="sticky top-0 z-20 border-b border-ink/8 bg-crema/92 backdrop-blur-[6px]">
      <div
        className={`${wrap} flex items-center justify-between px-5 py-3 sm:px-7 sm:py-3.5`}
      >
        <a href="#top" aria-label="Casa Liber — inicio" className="no-underline">
          <Logo />
        </a>

        <nav
          className="flex items-center gap-3 sm:gap-7"
          aria-label="Navegación principal"
        >
          <ul className="m-0 hidden list-none gap-7 p-0 text-[0.95rem] font-semibold min-[861px]:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-ink/85 no-underline hover:text-tierra hover:opacity-100"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <span className="max-[860px]:hidden">
            <a className={btn} href="#niveles">
              Sumá tu empresa
            </a>
          </span>
          <button
            type="button"
            className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] border-none bg-transparent p-0 min-[861px]:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={`block h-0.5 w-6 rounded-sm bg-ink transition-[transform,opacity] duration-200 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded-sm bg-ink transition-[transform,opacity] duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded-sm bg-ink transition-[transform,opacity] duration-200 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </div>

      <nav
        id="mobile-menu"
        className={`overflow-hidden border-t border-ink/8 bg-crema/98 transition-[max-height] duration-300 min-[861px]:hidden ${
          open ? "max-h-[420px]" : "max-h-0"
        }`}
        aria-label="Navegación móvil"
      >
        <ul className="m-0 flex list-none flex-col gap-1 px-5 pt-2 pb-5">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="block border-b border-ink/[0.07] px-1 py-3 font-semibold no-underline"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              className={`${btn} mt-3.5 !block w-full text-center`}
              href="#niveles"
              onClick={() => setOpen(false)}
            >
              Sumá tu empresa
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
