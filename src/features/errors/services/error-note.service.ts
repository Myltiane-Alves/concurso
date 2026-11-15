import { AppError } from "@/lib/errors";
import { findOwnedSubject } from "@/features/subjects/repositories/subject.repository";
import { findInSubject } from "@/features/topics/repositories/topic.repository";
import { createAutoForTopic } from "@/features/reviews/services/review.service";
import * as repo from "../repositories/error-note.repository";
import type { ErrorNoteInput } from "../schemas/error-note.schema";

export const listErrors = repo.listAll;

export async function createErrorNote(userId: string, input: ErrorNoteInput) {
  if (!(await findOwnedSubject(userId, input.subjectId))) {
    throw new AppError("Disciplina não encontrada", 404);
  }
  if (input.topicId && !(await findInSubject(input.topicId, input.subjectId))) {
    throw new AppError("O conteúdo não pertence à disciplina escolhida", 400);
  }

  const { scheduleReview, ...data } = input;
  const note = await repo.create({ userId, ...data });

  // Opcional: agenda uma revisão do conteúdo errado (sem duplicar se já houver uma pendente).
  if (scheduleReview && input.topicId) {
    try {
      await createAutoForTopic(userId, input.topicId);
    } catch {
      // a revisão é um complemento; o erro já foi salvo
    }
  }
  return note;
}

export function deleteErrorNote(userId: string, id: string) {
  return repo.remove(userId, id);
}
