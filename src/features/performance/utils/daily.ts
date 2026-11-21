import { addDays, toLocalISO } from "@/lib/dates";
import type { SessionLite } from "./aggregate";

export type DayDetail = {
  date: string;
  seconds: number;
  sessionsCount: number;
  subjects: { id: string; name: string; seconds: number }[];
};

/** Uma linha por dia do intervalo (inclusive os dias sem estudo), com o total e o detalhe por disciplina. */
export function aggregateDaily(sessions: SessionLite[], startISO: string, endISO: string): DayDetail[] {
  const byDay = new Map<string, DayDetail>();

  for (const s of sessions) {
    if (!s.endedAt) continue;
    const date = toLocalISO(s.endedAt);
    if (date < startISO || date > endISO) continue;

    const seconds = s.totalSeconds ?? 0;
    const day = byDay.get(date) ?? { date, seconds: 0, sessionsCount: 0, subjects: [] };
    day.seconds += seconds;
    day.sessionsCount += 1;

    const id = s.subjectId ?? "removida";
    const subject = day.subjects.find((x) => x.id === id);
    if (subject) subject.seconds += seconds;
    else day.subjects.push({ id, name: s.subject?.name ?? "Disciplina removida", seconds });

    byDay.set(date, day);
  }

  const days: DayDetail[] = [];
  for (let d = startISO; d <= endISO; d = addDays(d, 1)) {
    const day = byDay.get(d) ?? { date: d, seconds: 0, sessionsCount: 0, subjects: [] };
    day.subjects.sort((a, b) => b.seconds - a.seconds);
    days.push(day);
  }
  return days;
}
