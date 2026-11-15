import { prisma } from "@/lib/prisma";
import { dayRange } from "@/lib/dates";

export function listFinishedSince(userId: string, startISO: string) {
  return prisma.studySession.findMany({
    where: { userId, status: "FINISHED", endedAt: { gte: dayRange(startISO).start } },
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
