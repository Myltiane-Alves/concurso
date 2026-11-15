import { AppError } from "@/lib/errors";
import { findOwnedSubject } from "@/features/subjects/repositories/subject.repository";
import * as repo from "../repositories/plan.repository";
import type { PlanItemInput } from "../schemas/plan.schema";

export const listPlans = repo.listPlans;
export const getPlan = repo.getPlan;
export const getActivePlan = repo.getActivePlan;

export function createPlan(userId: string, name: string) {
  return repo.createPlan(userId, name);
}

export async function activatePlan(userId: string, id: string) {
  if (!(await repo.setActivePlan(userId, id))) throw new AppError("Ciclo não encontrado", 404);
}

export function deletePlan(userId: string, id: string) {
  return repo.deletePlan(userId, id);
}

export async function addItem(userId: string, input: PlanItemInput) {
  if (!(await repo.planExists(userId, input.planId))) throw new AppError("Ciclo não encontrado", 404);
  if (!(await findOwnedSubject(userId, input.subjectId))) throw new AppError("Disciplina não encontrada", 404);
  return repo.addItem(input.planId, input.subjectId, input.minutes);
}

export function removeItem(userId: string, id: string) {
  return repo.removeItem(userId, id);
}

export async function moveItem(userId: string, id: string, direction: -1 | 1) {
  const item = await repo.findItem(userId, id);
  if (!item) throw new AppError("Item não encontrado", 404);
  await repo.swapItem(item.planId, id, direction);
}

/** Marca/desmarca o bloco. Ao concluir o último, uma nova rodada do ciclo começa. */
export async function toggleItem(userId: string, id: string, done: boolean) {
  const item = await repo.findItem(userId, id);
  if (!item) throw new AppError("Item não encontrado", 404);

  await repo.setItemDone(id, done);

  if (done && (await repo.countPending(item.planId)) === 0) {
    await repo.startNewRound(item.planId);
  }
}

export async function resetRound(userId: string, planId: string) {
  if (!(await repo.planExists(userId, planId))) throw new AppError("Ciclo não encontrado", 404);
  await repo.resetRound(planId);
}
