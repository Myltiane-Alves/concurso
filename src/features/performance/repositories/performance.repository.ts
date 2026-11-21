import { prisma } from "@/lib/prisma";
import { dayRange, isoToDate } from "@/lib/dates";

export function listFinishedSince(userId: string, startISO: string, endISO?: string) {
  return prisma.studySession.findMany({
    where: { userId, status: "FINISHED", endedAt: { gte: dayRange(startISO).start, ...(endISO ? { lte: dayRange(endISO).end } : {}) },
    },
    select: {
      endedAt: true,
      totalSeconds: true,
      subjectId: true,
      subject: { select: { name: true } },
    },
  });
}

export function listDifficulties(userId: string, take: number) {
  return prisma.studySession.findMany({
    where: { userId, status: "FINISHED", difficulties: { not: null } },
    orderBy: { endedAt: "desc" },
    take,
    select: {
      id: true,
      endedAt: true,
      difficulties: true,
      subject: { select: { name: true } },
      topic: { select: { code: true, title: true } },
    },
  });
}

export function listQuestionRecordsSince(userId: string, startISO: string) {
  return prisma.questionRecord.findMany({
    where: { userId, date: { gte: isoToDate(startISO) } },
    select: { date: true, total: true, correct: true },
  });
}
