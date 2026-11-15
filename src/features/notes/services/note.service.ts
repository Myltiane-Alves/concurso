import { AppError } from "@/lib/errors";
import { findOwnedSubject } from "@/features/subjects/repositories/subject.repository";
import { findTopic } from "@/features/reviews/repositories/review.repository";
import * as repo from "../repositories/note.repository";
import type { NoteInput } from "../schemas/note.schema";

export const listNotes = repo.listAll;

export async function saveNote(userId: string, input: NoteInput) {
  let subjectId = input.subjectId ?? null;
  const topicId = input.topicId ?? null;

  if (topicId) {
    const topic = await findTopic(userId, topicId);
    if (!topic) throw new AppError("Conteúdo não encontrado", 404);
    if (subjectId && topic.subjectId !== subjectId) {
      throw new AppError("O conteúdo não pertence à disciplina escolhida", 400);
    }
    subjectId = topic.subjectId;
  }
  if (subjectId && !(await findOwnedSubject(userId, subjectId))) {
    throw new AppError("Disciplina não encontrada", 404);
  }

  const data = {
    title: input.title,
    content: input.content,
    links: input.links ?? null,
    subjectId,
    topicId,
  };

  if (input.id) {
    const result = await repo.update(userId, input.id, data);
    if (result.count === 0) throw new AppError("Anotação não encontrada", 404);
    return;
  }
  await repo.create(userId, data);
}

export function deleteNote(userId: string, id: string) {
  return repo.remove(userId, id);
}
