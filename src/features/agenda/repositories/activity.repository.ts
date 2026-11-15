import { prisma } from "@/lib/prisma";
import { isoToDate } from "@/lib/dates";

const withSubject = { subject: { select: { name: true } } };

export function listBetween(userId: string, fromISO: string, toISO: string) {
  return prisma.studyActivity.findMany({
    where: { userId, date: { gte: isoToDate(fromISO), lte: isoToDate(toISO) } },
    orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    include: withSubject,
  });
}

export function listDay(userId: string, iso: string) {
  return listBetween(userId, iso, iso);
}

export function countOverdue(userId: string, todayISO: string) {
  return prisma.studyActivity.count({
    where: { userId, done: false, date: { lt: isoToDate(todayISO) } },
  });
}

export function rescheduleOverdue(userId: string, todayISO: string) {
  return prisma.studyActivity.updateMany({
    where: { userId, done: false, date: { lt: isoToDate(todayISO) } },
    data: { date: isoToDate(todayISO) },
  });
}

export function createActivity(data: {
  userId: string;
  title: string;
  date: Date;
  minutes: number;
  subjectId?: string;
}) {
  return prisma.studyActivity.create({ data });
}

export function setDone(userId: string, id: string, done: boolean) {
  return prisma.studyActivity.updateMany({ where: { id, userId }, data: { done } });
}

export function removeActivity(userId: string, id: string) {
  return prisma.studyActivity.deleteMany({ where: { id, userId } });
}
