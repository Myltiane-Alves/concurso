"use server";

import { requireUserId } from "@/lib/session";
import { toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import { importSchema, statusSchema, topicSchema } from "./schemas/topic.schema";
import { createTopic, importFromText, removeTopic, setStatus } from "./services/topic.service";

export async function createTopicAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = topicSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await createTopic(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function importTopicsAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = importSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await importFromText(userId, parsed.data.subjectId, parsed.data.text);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function setTopicStatusAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = statusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  await setStatus(userId, parsed.data.id, parsed.data.status);
}

export async function deleteTopicAction(formData: FormData) {
  const userId = await requireUserId();
  await removeTopic(userId, String(formData.get("id") ?? ""));
}
