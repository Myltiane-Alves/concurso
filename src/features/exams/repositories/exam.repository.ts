import { prisma } from "@/lib/prisma";
import type { ExamInput } from "../schemas/exam.schema";

export function listExams(userId: string) {
  return prisma.exam.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { subjects: true } } },
  });
}

export function listExamOptions(userId: string) {
  return prisma.exam.findMany({
    where: { userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export function getExam(userId: string, id: string) {
  return prisma.exam.findFirst({
    where: { id, userId },
    include: {
      subjects: {
        orderBy: { name: "asc" },
        include: { _count: { select: { topics: true } } },
      },
    },
  });
}

export async function examExists(userId: string, id: string) {
  const exam = await prisma.exam.findFirst({ where: { id, userId }, select: { id: true } });
  return !!exam;
}

export function createExam(userId: string, data: ExamInput) {
  return prisma.exam.create({ data: { ...data, userId } });
}

export function deleteExam(userId: string, id: string) {
  return prisma.exam.deleteMany({ where: { id, userId } });
}
