"use server";

import { requireUserId } from "@/lib/session";
import { toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import { planItemSchema, planSchema } from "./schemas/plan.schema";
import * as service from "./services/plan.service";

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "");

export async function createPlanAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = planSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.createPlan(userId, parsed.data.name);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function addItemAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = planItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.addItem(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function activatePlanAction(formData: FormData) {
  const userId = await requireUserId();
  await service.activatePlan(userId, text(formData, "id"));
}

export async function deletePlanAction(formData: FormData) {
  const userId = await requireUserId();
  await service.deletePlan(userId, text(formData, "id"));
}

export async function removeItemAction(formData: FormData) {
  const userId = await requireUserId();
  await service.removeItem(userId, text(formData, "id"));
}

export async function moveItemAction(formData: FormData) {
  const userId = await requireUserId();
  const direction = text(formData, "direction") === "up" ? -1 : 1;
  await service.moveItem(userId, text(formData, "id"), direction);
}

export async function toggleItemAction(formData: FormData) {
  const userId = await requireUserId();
  await service.toggleItem(userId, text(formData, "id"), text(formData, "done") === "true");
}

export async function resetRoundAction(formData: FormData) {
  const userId = await requireUserId();
  await service.resetRound(userId, text(formData, "id"));
}
