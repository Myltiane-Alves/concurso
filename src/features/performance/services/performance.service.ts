import { addDays, todayISO } from "@/lib/dates";
import { getStatsBetween } from "@/features/questions/services/question.service";
import * as repo from "../repositories/performance.repository";
import { aggregate } from "../utils/aggregate";
import { aggregateDaily } from "../utils/daily";
import { addMonths, buildYearOverview, isValidMonth, monthRange } from "../utils/monthly";

export const MAX_PERIOD_DAYS = 90;

export async function getPerformance(userId: string, periodDays: number) {
  const today = todayISO();
  // Busca sempre a janela máxima: o período só filtra e a sequência usa o histórico.
  const sessions = await repo.listFinishedSince(userId, addDays(today, -(MAX_PERIOD_DAYS - 1)));
  return aggregate(sessions, addDays(today, -(periodDays - 1)), today, today);
}

export const listDifficulties = repo.listDifficulties;

/** Desempenho de um mês, comparado com o anterior, e resumo dos últimos 12 meses. */
export async function getMonthly(userId: string, monthParam?: string) {
  const today = todayISO();
  const thisMonth = today.slice(0, 7);
  const month = monthParam && isValidMonth(monthParam) && monthParam <= thisMonth ? monthParam : thisMonth;
  const prevMonth = addMonths(month, -1);

  const range = monthRange(month, today);
  const prevRange = monthRange(prevMonth, today);
  const overviewStart = `${addMonths(thisMonth, -11)}-01`;
  const fetchFrom = prevRange.start < overviewStart ? prevRange.start : overviewStart;

  const [sessions, records, questions, prevQuestions] = await Promise.all([
    repo.listFinishedSince(userId, fetchFrom),
    repo.listQuestionRecordsSince(userId, overviewStart),
    getStatsBetween(userId, range.start, range.end),
    getStatsBetween(userId, prevRange.start, prevRange.end),
  ]);

  const perf = aggregate(sessions, range.start, range.effectiveEnd, today);
  const prev = aggregate(sessions, prevRange.start, prevRange.end, today);

  return {
    month,
    thisMonth,
    prevMonth,
    nextMonth: month < thisMonth ? addMonths(month, 1) : null,
    perf,
    previous: { seconds: prev.totalSeconds, studiedDays: prev.studiedDays },
    questions,
    previousQuestions: { total: prevQuestions.total, percent: prevQuestions.percent },
    overview: buildYearOverview(sessions, records, thisMonth),
  };
}

/** Horas estudadas em cada dia do mês, com o detalhe por disciplina. */
export async function getDaily(userId: string, monthParam?: string) {
  const today = todayISO();
  const thisMonth = today.slice(0, 7);
  const month = monthParam && isValidMonth(monthParam) && monthParam <= thisMonth ? monthParam : thisMonth;
  const range = monthRange(month, today);

  const sessions = await repo.listFinishedSince(userId, range.start, range.effectiveEnd);
  const days = aggregateDaily(sessions, range.start, range.effectiveEnd);

  const totalSeconds = days.reduce((sum, d) => sum + d.seconds, 0);
  const studiedDays = days.filter((d) => d.seconds > 0).length;
  const best = days.reduce((top, d) => (d.seconds > top.seconds ? d : top), days[0]);

  return {
    month,
    thisMonth,
    prevMonth: addMonths(month, -1),
    nextMonth: month < thisMonth ? addMonths(month, 1) : null,
    days: [...days].reverse(), // dia mais recente primeiro
    totalSeconds,
    studiedDays,
    periodDays: days.length,
    avgSecondsPerStudiedDay: studiedDays === 0 ? 0 : Math.round(totalSeconds / studiedDays),
    best: best && best.seconds > 0 ? { date: best.date, seconds: best.seconds } : null,
  };
}
