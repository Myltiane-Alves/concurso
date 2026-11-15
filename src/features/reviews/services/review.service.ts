import { AppError } from "@/lib/errors";
import { addDays, dateToISO, isoToDate, todayISO } from "@/lib/dates";
import { findOwnedSubject } from "@/features/subjects/repositories/subject.repository";
import * as repo from "../repositories/review.repository";
import type { CompleteReviewInput, CreateReviewInput } from "../schemas/review.schema";
import { FIRST_REVIEW_DAYS } from "../utils/intervals";

export const listPending = repo.listPending;
export const listCompleted = repo.listCompleted;

const topicLabel = (t: { code: string | null; title: string }) => (t.code ? `${t.code} ${t.title}` : t.title);

export async function createManual(userId: string, input: CreateReviewInput) {
  if (input.date < todayISO()) throw new AppError("A data não pode ser anterior a hoje", 400);

  let subjectId = input.subjectId;
  let title = input.title;

  if (input.topicId) {
    const topic = await repo.findTopic(userId, input.topicId);
    if (!topic) throw new AppError("Conteúdo não encontrado", 404);
    if (subjectId && topic.subjectId !== subjectId) {
      throw new AppError("O conteúdo não pertence à disciplina escolhida", 400);
    }
    subjectId = topic.subjectId;
    title = title ?? topicLabel(topic);
  }

  if (subjectId) {
    const subject = await findOwnedSubject(userId, subjectId);
    if (!subject) throw new AppError("Disciplina não encontrada", 404);
    title = title ?? subject.name;
  }

  if (!title) throw new AppError("Informe um título ou escolha uma disciplina/conteúdo", 400);

  return repo.createReview({
    userId,
    subjectId,
    topicId: input.topicId,
    title,
    dueDate: isoToDate(input.date),
    notes: input.notes,
  });
}

/** Chamado ao finalizar uma sessão com conteúdo: agenda a primeira revisão (1 dia depois). */
export async function createAutoForTopic(userId: string, topicId: string) {
  if (await repo.hasPendingForTopic(userId, topicId)) return null; // evita duplicidade

  const topic = await repo.findTopic(userId, topicId);
  if (!topic) return null;

  return repo.createReview({
    userId,
    subjectId: topic.subjectId,
    topicId: topic.id,
    title: topicLabel(topic),
    dueDate: isoToDate(addDays(todayISO(), FIRST_REVIEW_DAYS)),
    intervalDays: FIRST_REVIEW_DAYS,
  });
}

export async function complete(userId: string, input: CompleteReviewInput) {
  const review = await repo.findOwned(userId, input.id);
  if (!review || review.status !== "PENDING") {
    throw new AppError("Revisão não encontrada ou já concluída", 404);
  }

  const next = input.nextInDays
    ? {
        userId,
        subjectId: review.subjectId,
        topicId: review.topicId,
        title: review.title,
        dueDate: isoToDate(addDays(todayISO(), input.nextInDays)),
        intervalDays: input.nextInDays,
      }
    : undefined;

  const ok = await repo.completeReview(
    userId,
    input.id,
    { difficulty: input.difficulty, notes: input.notes, completedAt: new Date() },
    next
  );
  if (!ok) throw new AppError("Revisão já concluída", 409);
}

export async function postpone(userId: string, id: string, days: number) {
  const review = await repo.findOwned(userId, id);
  if (!review || review.status !== "PENDING") {
    throw new AppError("Revisão não encontrada ou já concluída", 404);
  }

  // Soma os dias a partir da data prevista ou de hoje, o que for mais tarde.
  const today = todayISO();
  const due = dateToISO(review.dueDate);
  const base = due > today ? due : today;
  await repo.postponeReview(userId, id, isoToDate(addDays(base, days)));
}

export function removePending(userId: string, id: string) {
  return repo.removePending(userId, id);
}
