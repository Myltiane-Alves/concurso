"use server";

import { requireUserId } from "@/lib/session";
import { toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import { errorNoteSchema } from "./schemas/error-note.schema";
import * as service from "./services/error-note.service";

export async function createErrorNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = errorNoteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.createErrorNote(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function deleteErrorNoteAction(formData: FormData) {
  const userId = await requireUserId();
  await service.deleteErrorNote(userId, String(formData.get("id") ?? ""));
}
