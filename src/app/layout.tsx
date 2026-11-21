import type { Metadata } from "next";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./globals.scss";

export const metadata: Metadata = {
  title: "StudyConcursos",
  description: "Planejamento e acompanhamento de estudos para concursos públicos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
