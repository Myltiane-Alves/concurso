import type { SessionStatus } from "@prisma/client";
import { AppError } from "@/lib/errors";
import { dayRange, todayISO } from "@/lib/dates";
import { findOwnedSubject } from "@/features/subjects/repositories/subject.repository";
import { findInSubject } from "@/features/topics/repositories/topic.repository";
import { findItem } from "@/features/plans/repositories/plan.repository";
import { toggleItem } from "@/features/plans/services/plan.service";
import { createAutoForTopic } from "@/features/reviews/services/review.service";
import * as repo from "../repositories/session.repository";
import type {
  FinishSessionInput,
  ManualSessionInput,
  StartSessionInput,
} from "../schemas/session.schema";

export const getActive = repo.findActive;
export const listFinished = repo.listFinished;
export const listManual = repo.listManual;

type Elapsable = {
  status: SessionStatus;
  accumulatedSeconds: number;
  lastResumedAt: Date | null;
};

/** Tempo efetivo: o que já foi acumulado + o trecho em andamento (se estiver rodando). */
export function elapsedSeconds(s: Elapsable, now = new Date()) {
  if (s.status !== "RUNNING" || !s.lastResumedAt) return s.accumulatedSeconds;
  const running = Math.floor((now.getTime() - s.lastResumedAt.getTime()) / 1000);
  return s.accumulatedSeconds + Math.max(0, running);
}

export function getTodaySeconds(userId: string) {
  const { start, end } = dayRange(todayISO());
  return repo.sumSecondsBetween(userId, start, end);
}

export async function startSession(userId: string, input: StartSessionInput) {
  if (await repo.findActive(userId)) {
    throw new AppError("Já existe uma sessão em andamento. Finalize-a antes de iniciar outra.", 409);
  }
  if (!(await findOwnedSubject(userId, input.subjectId))) {
    throw new AppError("Disciplina não encontrada", 404);
  }
  if (input.topicId && !(await findInSubject(input.topicId, input.subjectId))) {
    throw new AppError("O conteúdo não pertence à disciplina escolhida", 400);
  }
  if (input.planItemId) {
    const item = await findItem(userId, input.planItemId);
    if (!item || item.subjectId !== input.subjectId) {
      throw new AppError("Bloco do ciclo inválido", 400);
    }
  }

  const now = new Date();
  const session = await repo.createSession({ userId, ...input, startedAt: now, lastResumedAt: now });
  if (input.topicId) await repo.markTopicInProgress(userId, input.topicId);
  return session;
}

export async function pauseSession(userId: string, id: string) {
  const session = await repo.findOwned(userId, id);
  if (!session || session.status !== "RUNNING") {
    throw new AppError("A sessão não está em andamento", 409);
  }

  const result = await repo.updateIfStatus(userId, id, ["RUNNING"], {
    status: "PAUSED",
    accumulatedSeconds: elapsedSeconds(session),
    lastResumedAt: null,
  });
  if (result.count === 0) throw new AppError("A sessão não está em andamento", 409);
}

export async function resumeSession(userId: string, id: string) {
  const result = await repo.updateIfStatus(userId, id, ["PAUSED"], {
    status: "RUNNING",
    lastResumedAt: new Date(),
  });
  if (result.count === 0) throw new AppError("A sessão não está pausada", 409);
}

export async function finishSession(userId: string, input: FinishSessionInput) {
  const session = await repo.findOwned(userId, input.id);
  if (!session || session.status === "FINISHED") {
    throw new AppError("Sessão não encontrada ou já finalizada", 404);
  }

  const now = new Date();
  const total = elapsedSeconds(session, now);

  const result = await repo.updateIfStatus(userId, input.id, ["RUNNING", "PAUSED"], {
    status: "FINISHED",
    endedAt: now,
    lastResumedAt: null,
    accumulatedSeconds: total,
    totalSeconds: total,
    notes: input.notes ?? null,
    difficulties: input.difficulties ?? null,
  });
  if (result.count === 0) throw new AppError("Sessão já finalizada", 409);

  // Sessão iniciada a partir do ciclo: marca o bloco como concluído.
  if (session.planItemId) {
    try {
      await toggleItem(userId, session.planItemId, true);
    } catch {
      // o bloco pode ter sido removido do ciclo; o histórico da sessão permanece
    }
  }

  // Sessão com conteúdo: agenda a primeira revisão (1 dia depois), sem duplicar.
  if (session.topicId) {
    try {
      await createAutoForTopic(userId, session.topicId);
    } catch {
      // a revisão automática é um complemento; não deve impedir o fim da sessão
    }
  }
}

export async function discardSession(userId: string, id: string) {
  await repo.deleteActive(userId, id);
}

/** Registra (ou edita) horas estudadas sem usar o cronômetro. O tempo conta no dia escolhido. */
export async function saveManualSession(userId: string, input: ManualSessionInput) {
  if (input.date > todayISO()) throw new AppError("A data não pode ser futura", 400);
  if (!(await findOwnedSubject(userId, input.subjectId))) {
    throw new AppError("Disciplina não encontrada", 404);
  }
  if (input.topicId && !(await findInSubject(input.topicId, input.subjectId))) {
    throw new AppError("O conteúdo não pertence à disciplina escolhida", 400);
  }

  // O registro é posicionado ao meio-dia (Brasília) do dia escolhido, para contar no dia certo.
  const noon = new Date(`${input.date}T12:00:00-03:00`);
  const endedAt = input.date === todayISO() && noon > new Date() ? new Date() : noon;
  const data = {
    subjectId: input.subjectId,
    topicId: input.topicId,
    startedAt: new Date(endedAt.getTime() - input.seconds * 1000),
    endedAt,
    seconds: input.seconds,
    notes: input.notes,
  };

  if (input.id) {
    const result = await repo.updateManual(userId, input.id, data);
    if (result.count === 0) {
      throw new AppError("Só é possível editar horas adicionadas manualmente", 404);
    }
  } else {
    await repo.createManual(userId, data);
  }

  if (input.topicId) await repo.markTopicInProgress(userId, input.topicId);
}

export function deleteManualSession(userId: string, id: string) {
  return repo.deleteManual(userId, id);
}
