import { AppError } from "@/lib/errors";
import { addDays, isoToDate, todayISO } from "@/lib/dates";
import { findOwnedSubject } from "@/features/subjects/repositories/subject.repository";
import { findInSubject } from "@/features/topics/repositories/topic.repository";
import * as repo from "../repositories/question.repository";
import type { QuestionInput } from "../schemas/question.schema";
import { percent } from "../utils/percent";

export const listRecent = repo.listRecent;
export const listPaged = repo.listPaged;

export async function createRecord(userId: string, input: QuestionInput) {
  if (input.date > todayISO()) throw new AppError("A data não pode ser futura", 400);
  if (!(await findOwnedSubject(userId, input.subjectId))) {
    throw new AppError("Disciplina não encontrada", 404);
  }
  if (input.topicId && !(await findInSubject(input.topicId, input.subjectId))) {
    throw new AppError("O conteúdo não pertence à disciplina escolhida", 400);
  }

  return repo.createRecord({
    userId,
    subjectId: input.subjectId,
    topicId: input.topicId,
    board: input.board,
    source: input.source,
    date: isoToDate(input.date),
    total: input.total,
    correct: input.correct,
    notes: input.notes,
  });
}

export function deleteRecord(userId: string, id: string) {
  return repo.deleteRecord(userId, id);
}

/** periodDays = null → todo o histórico. */
export async function getStats(userId: string, periodDays: number | null) {
  const since = periodDays ? isoToDate(addDays(todayISO(), -(periodDays - 1))) : undefined;
  const [sum, groups] = await Promise.all([repo.sums(userId, since), repo.sumsBySubject(userId, since)]);

  return {
    total: sum.total,
    correct: sum.correct,
    wrong: sum.total - sum.correct,
    percent: percent(sum.correct, sum.total),
    // Menor desempenho primeiro, para evidenciar onde estão as dificuldades.
    bySubject: groups
      .map((g) => ({ ...g, percent: percent(g.correct, g.total) }))
      .sort((a, b) => a.percent - b.percent),
  };
}

/** Estatísticas de um intervalo de datas de calendário (inclusive nas pontas). */
export async function getStatsBetween(userId: string, startISO: string, endISO: string) {
  const since = isoToDate(startISO);
  const until = isoToDate(endISO);
  const [sum, groups] = await Promise.all([
    repo.sums(userId, since, until),
    repo.sumsBySubject(userId, since, until),
  ]);

  return {
    total: sum.total,
    correct: sum.correct,
    wrong: sum.total - sum.correct,
    percent: percent(sum.correct, sum.total),
    bySubject: groups
      .map((g) => ({ ...g, percent: percent(g.correct, g.total) }))
      .sort((a, b) => a.percent - b.percent),
  };
}
