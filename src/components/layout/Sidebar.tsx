"use client";

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
import { useRoute } from "@/lib/hash-router";
import { NavLink } from "@/components/NavLink";

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
  const { path } = useRoute();
  const current = path === "/" ? "/dashboard" : path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">StudyConcursos</div>
      <nav>
        {items.map(({ href, label, icon: Icon }) => (
          <NavLink key={href} to={href} className={current.startsWith(href) ? "active" : undefined}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
