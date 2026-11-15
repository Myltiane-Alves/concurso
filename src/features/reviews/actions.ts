"use server";

import { requireUserId } from "@/lib/session";
import { AppError, toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import {
  completeReviewSchema,
  createReviewSchema,
  postponeReviewSchema,
} from "./schemas/review.schema";
import * as service from "./services/review.service";

export async function createReviewAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = createReviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.createManual(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function completeReviewAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  const parsed = completeReviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await service.complete(userId, parsed.data);
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function postponeReviewAction(formData: FormData) {
  const userId = await requireUserId();
  const parsed = postponeReviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  try {
    await service.postpone(userId, parsed.data.id, parsed.data.days);
  } catch (e) {
    if (!(e instanceof AppError)) throw e;
  }
}

export async function deleteReviewAction(formData: FormData) {
  const userId = await requireUserId();
  await service.removePending(userId, String(formData.get("id") ?? ""));
}
