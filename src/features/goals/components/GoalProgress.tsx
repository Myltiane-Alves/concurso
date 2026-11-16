import { formatAmount, goalTitle } from "../utils/labels";
import type { GoalPeriod, GoalType } from "../utils/progress";

export type GoalView = {
  id: string;
  type: GoalType;
  period: GoalPeriod;
  target: number;
  active: boolean;
  subjectId: string | null;
  subject: { name: string } | null;
  current: number;
  percent: number;
  remaining: number;
  done: boolean;
  daysLeft: number;
  perDayNeeded: number;
  onTrack: boolean | null;
};

function statusText(g: GoalView) {
  if (g.done) return "Meta batida";
  const missing = `faltam ${formatAmount(g.type, g.remaining)}`;
  if (g.period === "DAILY") return `Hoje: ${missing}`;
  return `${g.onTrack ? "No ritmo" : "Abaixo do ritmo"} · ${missing} (cerca de ${formatAmount(
    g.type,
    g.perDayNeeded
  )} por dia, ${g.daysLeft} dia(s))`;
}

export function GoalProgress({ goal }: { goal: GoalView }) {
  const level = goal.done ? "good" : goal.onTrack === false ? "bad" : "";

  return (
    <div className="bar-row">
      <div className="bar-label">
        <span>{goalTitle(goal)}</span>
        <span className="muted small">
          {formatAmount(goal.type, goal.current)} de {formatAmount(goal.type, goal.target)}
        </span>
      </div>
      <div className="progress">
        <div className={`progress-fill ${level}`} style={{ width: `${goal.percent}%` }} />
      </div>
      <span className={`goal-status ${goal.done ? "done" : goal.onTrack === false ? "late" : ""}`}>
        {statusText(goal)}
      </span>
    </div>
  );
}
