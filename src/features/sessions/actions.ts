"use server";

import { requireUserId } from "@/lib/session";
import { AppError, toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import {
  finishSessionSchema,
  manualSessionSchema,
  startSessionSchema,
} from "./schemas/session.schema";
import * as service from "./services/session.service";

const idOf = (fd: FormData) => String(fd.get("id") ?? "");

export async function startSessionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = startSessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.startSession(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function finishSessionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = finishSessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.finishSession(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

// Pausar/retomar ignoram conflitos de estado (ex.: duplo clique) e apenas atualizam a tela.
async function safely(run: () => Promise<void>) {
  try {
    await run();
  } catch (e) {
    if (!(e instanceof AppError)) throw e;
  }
}

export async function pauseSessionAction(formData: FormData) {
  const userId = await requireUserId();
  await safely(() => service.pauseSession(userId, idOf(formData)));
}

export async function resumeSessionAction(formData: FormData) {
  const userId = await requireUserId();
  await safely(() => service.resumeSession(userId, idOf(formData)));
}

export async function discardSessionAction(formData: FormData) {
  const userId = await requireUserId();
  await service.discardSession(userId, idOf(formData));
}

export async function saveManualSessionAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = manualSessionSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.saveManualSession(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function deleteManualSessionAction(formData: FormData) {
  const userId = await requireUserId();
  await service.deleteManualSession(userId, idOf(formData));
}
