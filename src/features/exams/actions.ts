"use server";

import { requireUserId } from "@/lib/session";
import { toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import { examSchema } from "./schemas/exam.schema";
import { createExam, deleteExam } from "./services/exam.service";

export async function createExamAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = examSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await createExam(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function deleteExamAction(formData: FormData) {
  const userId = await requireUserId();
  await deleteExam(userId, String(formData.get("id") ?? ""));
}
