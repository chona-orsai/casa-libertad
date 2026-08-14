import type { Metadata } from "next";
import { Fraunces, Source_Sans_3, Kalam } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const siteUrl = "https://www.casalibertad.org.ar";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Casa Liber — Sumá a tu empresa",
  description:
    "Casa Liber acompaña a mujeres y a sus hijas e hijos en la salida del encierro para sostener su proyecto de vida. Sumá tu empresa a través de nuestros niveles de apoyo a Casa Liber.",
  keywords: [
    "Casa Liber",
    "Casa Libertad",
    "responsabilidad social empresarial",
    "RSE",
    "Casa Magma",
    "reinserción",
    "La Plata",
  ],
  authors: [{ name: "Asociación Civil Casa Libertad" }],
  openGraph: {
    title: "Casa Liber — Sumá a tu empresa",
    description:
      "Hay vínculos que, con acompañamiento, vuelven a afianzarse. Sumá tu empresa al sostén de mujeres y sus hijas e hijos.",
    url: siteUrl,
    siteName: "Casa Liber",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Liber — Sumá a tu empresa",
    description:
      "Hay vínculos que, con acompañamiento, vuelven a afianzarse. Sumá tu empresa al sostén de estas familias.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${sourceSans.variable} ${kalam.variable} font-sans`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
