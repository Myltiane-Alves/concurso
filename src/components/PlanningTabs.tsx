import { NavLink } from "./NavLink";

const tabs = [
  { key: "overview", to: "/planejamento", label: "Visão geral" },
  { key: "cycle", to: "/planejamento/ciclo", label: "Ciclo de estudos" },
  { key: "agenda", to: "/planejamento/agenda", label: "Agenda" },
];

export function PlanningTabs({ active }: { active: "overview" | "cycle" | "agenda" }) {
  return (
    <div className="tabs">
      {tabs.map((t) => (
        <NavLink key={t.key} to={t.to} className={`tab ${t.key === active ? "active" : ""}`}>
          {t.label}
        </NavLink>
      ))}
    </div>
  );
}
