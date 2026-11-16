import type { Prisma, SessionStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ACTIVE: SessionStatus[] = ["RUNNING", "PAUSED"];

const withRelations = {
  subject: { select: { name: true } },
  topic: { select: { code: true, title: true } },
};

export function findActive(userId: string) {
  return prisma.studySession.findFirst({
    where: { userId, status: { in: ACTIVE } },
    include: withRelations,
  });
}

export function findOwned(userId: string, id: string) {
  return prisma.studySession.findFirst({ where: { id, userId } });
}

export function createSession(data: {
  userId: string;
  subjectId: string;
  topicId?: string;
  planItemId?: string;
  startedAt: Date;
  lastResumedAt: Date;
}) {
  return prisma.studySession.create({ data });
}

/** Atualiza só se a sessão estiver em um dos status esperados (evita corrida entre cliques). */
export function updateIfStatus(
  userId: string,
  id: string,
  from: SessionStatus[],
  data: Prisma.StudySessionUncheckedUpdateManyInput
) {
  return prisma.studySession.updateMany({ where: { id, userId, status: { in: from } }, data });
}

export function deleteActive(userId: string, id: string) {
  return prisma.studySession.deleteMany({ where: { id, userId, status: { in: ACTIVE } } });
}

export function listFinished(userId: string, take = 10) {
  return prisma.studySession.findMany({
    where: { userId, status: "FINISHED" },
    orderBy: { endedAt: "desc" },
    take,
    include: withRelations,
  });
}

export async function sumSecondsBetween(userId: string, start: Date, end: Date) {
  const result = await prisma.studySession.aggregate({
    where: { userId, status: "FINISHED", endedAt: { gte: start, lte: end } },
    _sum: { totalSeconds: true },
  });
  return result._sum.totalSeconds ?? 0;
}

export function markTopicInProgress(userId: string, topicId: string) {
  return prisma.topic.updateMany({
    where: { id: topicId, status: "NOT_STARTED", subject: { exam: { userId } } },
    data: { status: "IN_PROGRESS" },
  });
}

export function listManual(userId: string, take = 30) {
  return prisma.studySession.findMany({
    where: { userId, status: "FINISHED", manual: true },
    orderBy: { endedAt: "desc" },
    take,
    include: withRelations,
  });
}

type ManualData = {
  subjectId: string;
  topicId?: string;
  startedAt: Date;
  endedAt: Date;
  seconds: number;
  notes?: string;
};

export function createManual(userId: string, data: ManualData) {
  return prisma.studySession.create({
    data: {
      userId,
      subjectId: data.subjectId,
      topicId: data.topicId,
      status: "FINISHED",
      manual: true,
      startedAt: data.startedAt,
      endedAt: data.endedAt,
      accumulatedSeconds: data.seconds,
      totalSeconds: data.seconds,
      notes: data.notes,
    },
  });
}

/** Só registros manuais podem ser alterados: as sessões do cronômetro ficam preservadas (RN003). */
export function updateManual(userId: string, id: string, data: ManualData) {
  return prisma.studySession.updateMany({
    where: { id, userId, manual: true, status: "FINISHED" },
    data: {
      subjectId: data.subjectId,
      topicId: data.topicId ?? null,
      startedAt: data.startedAt,
      endedAt: data.endedAt,
      accumulatedSeconds: data.seconds,
      totalSeconds: data.seconds,
      notes: data.notes ?? null,
    },
  });
}

export function deleteManual(userId: string, id: string) {
  return prisma.studySession.deleteMany({ where: { id, userId, manual: true } });
}
