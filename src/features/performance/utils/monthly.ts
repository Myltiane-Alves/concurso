import { dateToISO, toLocalISO } from "@/lib/dates";
import { percent } from "@/features/questions/utils/percent";

const MONTHS = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

const pad = (n: number) => String(n).padStart(2, "0");

export const isValidMonth = (value: string) => /^\d{4}-(0[1-9]|1[0-2])$/.test(value);

export function addMonths(month: string, delta: number) {
  const [year, m] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, m - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}

/** Primeiro e último dia do mês. No mês atual, o fim efetivo é hoje. */
export function monthRange(month: string, today: string) {
  const [year, m] = month.split("-").map(Number);
  const lastDay = new Date(Date.UTC(year, m, 0)).getUTCDate();
  const end = `${month}-${pad(lastDay)}`;
  const isCurrent = month === today.slice(0, 7);
  return { start: `${month}-01`, end, effectiveEnd: isCurrent ? today : end, isCurrent };
}

export function monthLabel(month: string, style: "long" | "short" = "long") {
  const [year, m] = month.split("-").map(Number);
  const name = MONTHS[m - 1];
  return style === "long"
    ? `${name.charAt(0).toUpperCase()}${name.slice(1)} de ${year}`
    : `${name.slice(0, 3)}/${String(year).slice(2)}`;
}

export type MonthSummary = {
  month: string;
  seconds: number;
  studiedDays: number;
  questions: number;
  correct: number;
  percent: number;
};

/** Resumo dos últimos meses (terminando em endMonth): tempo, dias estudados e questões. */
export function buildYearOverview(
  sessions: { endedAt: Date | null; totalSeconds: number | null }[],
  records: { date: Date; total: number; correct: number }[],
  endMonth: string,
  months = 12
): MonthSummary[] {
  const seconds = new Map<string, number>();
  const days = new Map<string, Set<string>>();
  const questions = new Map<string, number>();
  const correct = new Map<string, number>();

  for (const s of sessions) {
    if (!s.endedAt) continue;
    const day = toLocalISO(s.endedAt);
    const month = day.slice(0, 7);
    const secs = s.totalSeconds ?? 0;
    seconds.set(month, (seconds.get(month) ?? 0) + secs);
    if (secs > 0) days.set(month, (days.get(month) ?? new Set()).add(day));
  }

  for (const r of records) {
    const month = dateToISO(r.date).slice(0, 7);
    questions.set(month, (questions.get(month) ?? 0) + r.total);
    correct.set(month, (correct.get(month) ?? 0) + r.correct);
  }

  return Array.from({ length: months }, (_, i) => {
    const month = addMonths(endMonth, -(months - 1 - i));
    const q = questions.get(month) ?? 0;
    const c = correct.get(month) ?? 0;
    return {
      month,
      seconds: seconds.get(month) ?? 0,
      studiedDays: days.get(month)?.size ?? 0,
      questions: q,
      correct: c,
      percent: percent(c, q),
    };
  });
}
