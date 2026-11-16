"use server";

import { requireUserId } from "@/lib/session";
import { AppError, toErrorMessage } from "@/lib/errors";
import type { FormState } from "@/lib/form-state";
import * as service from "./services/compare.service";

const idsOf = (fd: FormData) => fd.getAll("ids").map(String).filter(Boolean);

/** Vínculo vindo de uma sugestão (botão "Confirmar"). */
export async function linkSubjectsAction(formData: FormData) {
  const userId = await requireUserId();
  try {
    await service.linkSubjects(userId, idsOf(formData));
  } catch (e) {
    if (!(e instanceof AppError)) throw e;
  }
}

/** Vínculo manual vindo da lista de disciplinas exclusivas (mostra erro no formulário). */
export async function linkSelectedAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const userId = await requireUserId();
  try {
    await service.linkSubjects(userId, idsOf(formData));
  } catch (e) {
    return { error: toErrorMessage(e) };
  }
  return { success: true };
}

export async function unlinkSubjectsAction(formData: FormData) {
  const userId = await requireUserId();
  await service.unlinkSubjects(userId, idsOf(formData));
}
