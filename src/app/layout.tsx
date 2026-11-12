import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "StudyConcursos",
  description: "Planejamento e acompanhamento de estudos para concursos públicos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
