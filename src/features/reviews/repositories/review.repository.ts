import type { ReviewDifficulty } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const withRelations = {
  subject: { select: { name: true } },
  topic: { select: { code: true, title: true } },
};

export type NewReview = {
  userId: string;
  subjectId?: string | null;
  topicId?: string | null;
  title: string;
  dueDate: Date;
  intervalDays?: number | null;
  notes?: string;
};

export function listPending(userId: string) {
  return prisma.review.findMany({
    where: { userId, status: "PENDING" },
    orderBy: [{ dueDate: "asc" }, { createdAt: "asc" }],
    include: withRelations,
  });
}

export function listCompleted(userId: string, take: number) {
  return prisma.review.findMany({
    where: { userId, status: "DONE" },
    orderBy: { completedAt: "desc" },
    take,
    include: withRelations,
  });
}

export function findOwned(userId: string, id: string) {
  return prisma.review.findFirst({ where: { id, userId } });
}

export function createReview(data: NewReview) {
  return prisma.review.create({ data });
}

export function findTopic(userId: string, topicId: string) {
  return prisma.topic.findFirst({
    where: { id: topicId, subject: { exam: { userId } } },
    select: { id: true, code: true, title: true, subjectId: true },
  });
}

export async function hasPendingForTopic(userId: string, topicId: string) {
  const found = await prisma.review.findFirst({
    where: { userId, topicId, status: "PENDING" },
    select: { id: true },
  });
  return !!found;
}

/** Conclui a revisão e, se informado, cria a próxima — tudo ou nada. */
export function completeReview(
  userId: string,
  id: string,
  data: { difficulty: ReviewDifficulty; notes?: string; completedAt: Date },
  next?: NewReview
) {
  return prisma.$transaction(async (tx) => {
    const result = await tx.review.updateMany({
      where: { id, userId, status: "PENDING" },
      data: {
        status: "DONE",
        completedAt: data.completedAt,
        difficulty: data.difficulty,
        ...(data.notes ? { notes: data.notes } : {}),
      },
    });
    if (result.count === 0) return false;
    if (next) await tx.review.create({ data: next });
    return true;
  });
}

export function postponeReview(userId: string, id: string, dueDate: Date) {
  return prisma.review.updateMany({
    where: { id, userId, status: "PENDING" },
    data: { dueDate, postponedCount: { increment: 1 } },
  });
}

/** Só revisões pendentes podem ser excluídas: as concluídas formam o histórico. */
export function removePending(userId: string, id: string) {
  return prisma.review.deleteMany({ where: { id, userId, status: "PENDING" } });
}
