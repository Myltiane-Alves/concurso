"use server";

import { requireUserId } from "@/lib/session";
import { toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import { noteSchema } from "./schemas/note.schema";
import * as service from "./services/note.service";

export async function saveNoteAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = noteSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.saveNote(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function deleteNoteAction(formData: FormData) {
  const userId = await requireUserId();
  await service.deleteNote(userId, String(formData.get("id") ?? ""));
}
