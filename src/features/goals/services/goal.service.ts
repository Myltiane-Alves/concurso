import { AppError } from "@/lib/errors";
import { todayISO } from "@/lib/dates";
import { findOwnedSubject } from "@/features/subjects/repositories/subject.repository";
import * as repo from "../repositories/goal.repository";
import type { GoalInput } from "../schemas/goal.schema";
import { periodWindow, progressInfo } from "../utils/progress";

/** Metas com o progresso do período atual (dia, semana ou mês). */
export async function listWithProgress(userId: string, onlyActive = false) {
  const goals = await repo.listGoals(userId, onlyActive);
  const today = todayISO();

  return Promise.all(
    goals.map(async (goal) => {
      const window = periodWindow(goal.period, today);
      const current =
        goal.type === "STUDY_TIME"
          ? await repo.sumStudyMinutes(userId, window.start, window.end, goal.subjectId)
          : await repo.sumQuestions(userId, window.start, window.end, goal.subjectId);

      return { ...goal, ...progressInfo(goal.target, current, window, goal.period) };
    })
  );
}

export async function saveGoal(userId: string, input: GoalInput) {
  const subjectId = input.subjectId ?? null;
  if (subjectId && !(await findOwnedSubject(userId, subjectId))) {
    throw new AppError("Disciplina não encontrada", 404);
  }

  const data = { type: input.type, period: input.period, subjectId, target: input.target };

  if (await repo.findDuplicate(userId, { type: data.type, period: data.period, subjectId }, input.id)) {
    throw new AppError("Você já tem uma meta com o mesmo tipo, período e disciplina", 409);
  }

  if (input.id) {
    const result = await repo.updateGoal(userId, input.id, data);
    if (result.count === 0) throw new AppError("Meta não encontrada", 404);
    return;
  }
  await repo.createGoal(userId, data);
}

export function setGoalActive(userId: string, id: string, active: boolean) {
  return repo.setActive(userId, id, active);
}

export function deleteGoal(userId: string, id: string) {
  return repo.removeGoal(userId, id);
}
