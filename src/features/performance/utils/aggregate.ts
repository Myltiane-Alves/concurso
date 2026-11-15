import { addDays, toLocalISO } from "@/lib/dates";

export type SessionLite = {
  endedAt: Date | null;
  totalSeconds: number | null;
  subjectId: string | null;
  subject: { name: string } | null;
};

export type PerformanceData = {
  days: { date: string; seconds: number }[];
  bySubject: { id: string; name: string; seconds: number }[];
  totalSeconds: number;
  studiedDays: number;
  periodDays: number;
  avgSecondsPerStudiedDay: number;
  sessionsCount: number;
  streak: number;
};

/** Agrupa as sessões finalizadas por dia e por disciplina dentro do período. */
export function aggregate(
  sessions: SessionLite[],
  startISO: string,
  endISO: string,
  todayISO: string
): PerformanceData {
  const byDay = new Map<string, number>();
  const bySubject = new Map<string, { id: string; name: string; seconds: number }>();
  let sessionsCount = 0;

  for (const s of sessions) {
    if (!s.endedAt) continue;
    const seconds = s.totalSeconds ?? 0;
    const day = toLocalISO(s.endedAt);

    byDay.set(day, (byDay.get(day) ?? 0) + seconds);

    if (day >= startISO && day <= endISO) {
      sessionsCount++;
      const id = s.subjectId ?? "removida";
      const entry = bySubject.get(id) ?? {
        id,
        name: s.subject?.name ?? "Disciplina removida",
        seconds: 0,
      };
      entry.seconds += seconds;
      bySubject.set(id, entry);
    }
  }

  const days: { date: string; seconds: number }[] = [];
  for (let d = startISO; d <= endISO; d = addDays(d, 1)) {
    days.push({ date: d, seconds: byDay.get(d) ?? 0 });
  }

  const totalSeconds = days.reduce((sum, d) => sum + d.seconds, 0);
  const studiedDays = days.filter((d) => d.seconds > 0).length;

  // Sequência: dias seguidos estudados até hoje (se hoje ainda não teve estudo, conta a partir de ontem).
  let streak = 0;
  let cursor = (byDay.get(todayISO) ?? 0) > 0 ? todayISO : addDays(todayISO, -1);
  while ((byDay.get(cursor) ?? 0) > 0) {
    streak++;
    cursor = addDays(cursor, -1);
  }

  return {
    days,
    bySubject: [...bySubject.values()].sort((a, b) => b.seconds - a.seconds),
    totalSeconds,
    studiedDays,
    periodDays: days.length,
    avgSecondsPerStudiedDay: studiedDays === 0 ? 0 : Math.round(totalSeconds / studiedDays),
    sessionsCount,
    streak,
  };
}
