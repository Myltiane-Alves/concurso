"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  BookOpen,
  CalendarDays,
  Timer,
  ListChecks,
  Repeat,
  NotebookPen,
  StickyNote,
  BarChart3,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/concursos", label: "Concursos", icon: Trophy },
  { href: "/disciplinas", label: "Disciplinas", icon: BookOpen },
  { href: "/planejamento", label: "Planejamento", icon: CalendarDays },
  { href: "/estudar", label: "Estudar", icon: Timer },
  { href: "/questoes", label: "Questões", icon: ListChecks },
  { href: "/revisoes", label: "Revisões", icon: Repeat },
  { href: "/caderno-erros", label: "Caderno de erros", icon: NotebookPen },
  { href: "/anotacoes", label: "Anotações", icon: StickyNote },
  { href: "/desempenho", label: "Desempenho", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">StudyConcursos</div>
      <nav>
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={pathname.startsWith(href) ? "active" : undefined}
          >
            <Icon size={18} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
