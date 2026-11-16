import { addDays, isoToDate, startOfWeek } from "@/lib/dates";

export type GoalType = "STUDY_TIME" | "QUESTIONS";
export type GoalPeriod = "DAILY" | "WEEKLY" | "MONTHLY";

export type PeriodWindow = { start: string; end: string; daysTotal: number; daysElapsed: number };

const pad = (n: number) => String(n).padStart(2, "0");
const daysBetween = (from: string, to: string) =>
  Math.round((isoToDate(to).getTime() - isoToDate(from).getTime()) / 86_400_000);

/** Período atual da meta (dia, semana de segunda a domingo, ou mês), em datas de calendário. */
export function periodWindow(period: GoalPeriod, today: string): PeriodWindow {
  if (period === "DAILY") return { start: today, end: today, daysTotal: 1, daysElapsed: 1 };

  if (period === "WEEKLY") {
    const start = startOfWeek(today);
    return { start, end: addDays(start, 6), daysTotal: 7, daysElapsed: daysBetween(start, today) + 1 };
  }

  const [year, month] = today.split("-").map(Number);
  const daysTotal = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return {
    start: `${year}-${pad(month)}-01`,
    end: `${year}-${pad(month)}-${pad(daysTotal)}`,
    daysTotal,
    daysElapsed: Number(today.slice(8, 10)),
  };
}

export type ProgressInfo = {
  current: number;
  percent: number;
  remaining: number;
  done: boolean;
  daysLeft: number;
  perDayNeeded: number;
  /** null em metas diárias; nas demais, compara com o ritmo esperado até ontem. */
  onTrack: boolean | null;
};

export function progressInfo(target: number, current: number, window: PeriodWindow, period: GoalPeriod): ProgressInfo {
  const done = current >= target;
  const remaining = Math.max(0, target - current);
  const daysLeft = Math.max(1, window.daysTotal - window.daysElapsed + 1);

  const expectedUntilYesterday = Math.floor((target * (window.daysElapsed - 1)) / window.daysTotal);

  return {
    current,
    percent: target === 0 ? 0 : Math.min(100, Math.round((current / target) * 100)),
    remaining,
    done,
    daysLeft,
    perDayNeeded: done ? 0 : Math.ceil(remaining / daysLeft),
    onTrack: period === "DAILY" ? null : done || current >= expectedUntilYesterday,
  };
}
