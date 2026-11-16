import type { GoalPeriod, GoalType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { dayRange, isoToDate } from "@/lib/dates";

export function listGoals(userId: string, onlyActive = false) {
  return prisma.goal.findMany({
    where: { userId, ...(onlyActive ? { active: true } : {}) },
    orderBy: [{ period: "asc" }, { type: "asc" }, { createdAt: "asc" }],
    include: { subject: { select: { name: true } } },
  });
}

export function findDuplicate(
  userId: string,
  data: { type: GoalType; period: GoalPeriod; subjectId: string | null },
  excludeId?: string
) {
  return prisma.goal.findFirst({
    where: { userId, ...data, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  });
}

type GoalData = { type: GoalType; period: GoalPeriod; subjectId: string | null; target: number };

export function createGoal(userId: string, data: GoalData) {
  return prisma.goal.create({ data: { ...data, userId } });
}

export function updateGoal(userId: string, id: string, data: GoalData) {
  return prisma.goal.updateMany({ where: { id, userId }, data });
}

export function setActive(userId: string, id: string, active: boolean) {
  return prisma.goal.updateMany({ where: { id, userId }, data: { active } });
}

export function removeGoal(userId: string, id: string) {
  return prisma.goal.deleteMany({ where: { id, userId } });
}

/** Minutos estudados (sessões finalizadas, inclusive as manuais) no intervalo de datas. */
export async function sumStudyMinutes(userId: string, startISO: string, endISO: string, subjectId: string | null) {
  const result = await prisma.studySession.aggregate({
    where: {
      userId,
      status: "FINISHED",
      endedAt: { gte: dayRange(startISO).start, lte: dayRange(endISO).end },
      ...(subjectId ? { subjectId } : {}),
    },
    _sum: { totalSeconds: true },
  });
  return Math.floor((result._sum.totalSeconds ?? 0) / 60);
}

export async function sumQuestions(userId: string, startISO: string, endISO: string, subjectId: string | null) {
  const result = await prisma.questionRecord.aggregate({
    where: {
      userId,
      date: { gte: isoToDate(startISO), lte: isoToDate(endISO) },
      ...(subjectId ? { subjectId } : {}),
    },
    _sum: { total: true },
  });
  return result._sum.total ?? 0;
}
