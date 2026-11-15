import * as repo from "../repositories/exam.repository";
import type { ExamInput } from "../schemas/exam.schema";

export const listExams = repo.listExams;
export const listExamOptions = repo.listExamOptions;
export const getExam = repo.getExam;

export function createExam(userId: string, input: ExamInput) {
  return repo.createExam(userId, input);
}

export function deleteExam(userId: string, id: string) {
  return repo.deleteExam(userId, id);
}
