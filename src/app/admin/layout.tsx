import type { Metadata } from "next";
import { ChalkFilter } from "@/components/ChalkFilter";
import "./admin.css";

export const metadata: Metadata = {
  title: "Registro — Club de Amigos | Casa Liber",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell min-h-dvh font-sans text-ink">
      <ChalkFilter />
      {children}
    </div>
  );
}
