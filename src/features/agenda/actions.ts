"use server";

import { requireUserId } from "@/lib/session";
import { toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import { activitySchema } from "./schemas/activity.schema";
import * as service from "./services/activity.service";


export async function createActivityAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = activitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.createActivity(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function toggleActivityAction(formData: FormData) {
  const userId = await requireUserId();
  await service.setDone(userId, String(formData.get("id") ?? ""), formData.get("done") === "true");
}

export async function deleteActivityAction(formData: FormData) {
  const userId = await requireUserId();
  await service.removeActivity(userId, String(formData.get("id") ?? ""));
}

export async function rescheduleOverdueAction() {
  const userId = await requireUserId();
  await service.rescheduleOverdue(userId);
}
