import { NavLink } from "@/components/NavLink";

export function PerformanceTabs({ active }: { active: "period" | "monthly" }) {
  return (
    <div className="tabs">
      <NavLink to="/desempenho" className={`tab ${active === "period" ? "active" : ""}`}>
        Por período
      </NavLink>
      <NavLink to="/desempenho/mensal" className={`tab ${active === "monthly" ? "active" : ""}`}>
        Mês a mês
      </NavLink>
    </div>
  );
}
