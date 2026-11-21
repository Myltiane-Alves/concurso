import { NavLink } from "@/components/NavLink";
import { monthLabel } from "../utils/monthly";

type Props = { basePath: string; month: string; prevMonth: string; nextMonth: string | null };

export function MonthNav({ basePath, month, prevMonth, nextMonth }: Props) {
  return (
    <div className="week-nav">
      <NavLink to={`${basePath}?mes=${prevMonth}`}>← {monthLabel(prevMonth, "short")}</NavLink>
      <strong className="month-title">{monthLabel(month)}</strong>
      {nextMonth ? <NavLink to={`${basePath}?mes=${nextMonth}`}>{monthLabel(nextMonth, "short")} →</NavLink> : <span />}
    </div>
  );
}
