import { randomUUID } from "crypto";
import { AppError } from "@/lib/errors";
import * as repo from "../repositories/compare.repository";
import { compareExams } from "../utils/compare";

export async function getComparison(userId: string, examIds: string[]) {
  const found = await repo.loadExams(userId, examIds);
  const exams = examIds.map((id) => found.find((e) => e.id === id)).filter((e) => !!e);
  if (exams.length < 2) return null;

  const seconds = await repo.studySecondsBySubject(
    userId,
    exams.flatMap((e) => e.subjects.map((s) => s.id))
  );

  return compareExams(
    exams.map((e) => ({
      id: e.id,
      name: e.name,
      subjects: e.subjects.map((s) => ({
        id: s.id,
        examId: e.id,
        name: s.name,
        equivalenceId: s.equivalenceId,
        studySeconds: seconds.get(s.id) ?? 0,
        topics: s.topics,
      })),
    }))
  );
}

export async function linkSubjects(userId: string, rawIds: string[]) {
  const ids = [...new Set(rawIds)];
  if (ids.length < 2) throw new AppError("Selecione ao menos duas disciplinas", 400);

  const subjects = await repo.findOwnedSubjects(userId, ids);
  if (subjects.length !== ids.length) throw new AppError("Disciplina não encontrada", 404);
  if (new Set(subjects.map((s) => s.examId)).size < 2) {
    throw new AppError("As disciplinas precisam ser de concursos diferentes", 400);
  }

  const existing = [...new Set(subjects.map((s) => s.equivalenceId).filter((v): v is string => !!v))];
  await repo.setEquivalence(userId, ids, existing, existing[0] ?? randomUUID());
}

export async function unlinkSubjects(userId: string, ids: string[]) {
  if (ids.length === 0) return;
  await repo.clearEquivalence(userId, ids);
}
