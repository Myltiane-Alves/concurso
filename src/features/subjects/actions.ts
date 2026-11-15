"use server";

import { requireUserId } from "@/lib/session";
import { toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import { subjectSchema } from "./schemas/subject.schema";
import { createSubject, deleteSubject } from "./services/subject.service";

export async function createSubjectAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = subjectSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await createSubject(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function deleteSubjectAction(formData: FormData) {
  const userId = await requireUserId();
  await deleteSubject(userId, String(formData.get("id") ?? ""));
}
