"use server";

import { requireUserId } from "@/lib/session";
import { toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import { questionSchema } from "./schemas/question.schema";
import * as service from "./services/question.service";

export async function createQuestionRecordAction(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = questionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.createRecord(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function deleteQuestionRecordAction(formData: FormData) {
  const userId = await requireUserId();
  await service.deleteRecord(userId, String(formData.get("id") ?? ""));
}
