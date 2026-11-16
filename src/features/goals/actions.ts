"use server";

import { requireUserId } from "@/lib/session";
import { toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import { goalSchema } from "./schemas/goal.schema";
import * as service from "./services/goal.service";

export async function saveGoalAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = goalSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.saveGoal(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function toggleGoalAction(formData: FormData) {
  const userId = await requireUserId();
  await service.setGoalActive(userId, String(formData.get("id") ?? ""), formData.get("active") === "true");
}

export async function deleteGoalAction(formData: FormData) {
  const userId = await requireUserId();
  await service.deleteGoal(userId, String(formData.get("id") ?? ""));
}
