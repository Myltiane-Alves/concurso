import { AppError } from "@/lib/errors";
import { isoToDate, todayISO } from "@/lib/dates";
import { findOwnedSubject } from "@/features/subjects/repositories/subject.repository";
import * as repo from "../repositories/activity.repository";
import type { ActivityInput } from "../schemas/activity.schema";

export const listBetween = repo.listBetween;
export const listDay = repo.listDay;

export function countOverdue(userId: string) {
  return repo.countOverdue(userId, todayISO());
}

export async function rescheduleOverdue(userId: string) {
  await repo.rescheduleOverdue(userId, todayISO());
}

export async function createActivity(userId: string, input: ActivityInput) {
  let subjectName: string | undefined;

  if (input.subjectId) {
    const subject = await findOwnedSubject(userId, input.subjectId);
    if (!subject) throw new AppError("Disciplina não encontrada", 404);
    subjectName = subject.name;
  }

  const title = input.title ?? subjectName;
  if (!title) throw new AppError("Informe um título ou escolha uma disciplina", 400);

  return repo.createActivity({
    userId,
    title,
    date: isoToDate(input.date),
    minutes: input.minutes,
    subjectId: input.subjectId,
  });
}

export function setDone(userId: string, id: string, done: boolean) {
  return repo.setDone(userId, id, done);
}

export function removeActivity(userId: string, id: string) {
  return repo.removeActivity(userId, id);
}
