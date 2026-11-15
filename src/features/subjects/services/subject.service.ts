import { AppError } from "@/lib/errors";
import { examExists } from "@/features/exams/repositories/exam.repository";
import * as repo from "../repositories/subject.repository";
import type { SubjectInput } from "../schemas/subject.schema";

export const listSubjects = repo.listSubjects;
export const getSubject = repo.getSubject;

export async function createSubject(userId: string, input: SubjectInput) {
  if (!(await examExists(userId, input.examId))) {
    throw new AppError("Concurso não encontrado", 404);
  }
  return repo.createSubject(input);
}

export function deleteSubject(userId: string, id: string) {
  return repo.deleteSubject(userId, id);
}

/** Progresso baseado nos tópicos "folha" (sem subtópicos). */
export function calcProgress(
  topics: { status: string; _count: { children: number } }[]
) {
  const leaves = topics.filter((t) => t._count.children === 0);
  return { done: leaves.filter((t) => t.status === "DONE").length, total: leaves.length };
}
