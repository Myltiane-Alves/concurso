import type { ErrorCategory } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function listAll(userId: string, take = 300) {
  return prisma.errorNote.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      subject: { select: { name: true } },
      topic: { select: { code: true, title: true } },
    },
  });
}

export function create(data: {
  userId: string;
  subjectId: string;
  topicId?: string;
  category: ErrorCategory;
  statement: string;
  wrongAnswer?: string;
  correctAnswer?: string;
  explanation?: string;
}) {
  return prisma.errorNote.create({ data });
}

export function remove(userId: string, id: string) {
  return prisma.errorNote.deleteMany({ where: { id, userId } });
}
