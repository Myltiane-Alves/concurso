import { prisma } from "@/lib/prisma";
import type { SubjectInput } from "../schemas/subject.schema";

export function listSubjects(userId: string) {
  return prisma.subject.findMany({
    where: { exam: { userId } },
    orderBy: [{ exam: { name: "asc" } }, { name: "asc" }],
    include: {
      exam: { select: { id: true, name: true } },
      topics: { select: { status: true, _count: { select: { children: true } } } },
    },
  });
}

export function getSubject(userId: string, id: string) {
  return prisma.subject.findFirst({
    where: { id, exam: { userId } },
    include: {
      exam: { select: { id: true, name: true } },
      topics: { orderBy: [{ position: "asc" }, { createdAt: "asc" }] },
    },
  });
}

export async function subjectExists(userId: string, id: string) {
  const s = await prisma.subject.findFirst({
    where: { id, exam: { userId } },
    select: { id: true },
  });
  return !!s;
}

export function createSubject(data: SubjectInput) {
  return prisma.subject.create({ data });
}

export function deleteSubject(userId: string, id: string) {
  return prisma.subject.deleteMany({ where: { id, exam: { userId } } });
}

export function findOwnedSubject(userId: string, id: string) {
  return prisma.subject.findFirst({
    where: { id, exam: { userId } },
    select: { id: true, name: true },
  });
}

export function listSubjectOptions(userId: string) {
  return prisma.subject.findMany({
    where: { exam: { userId } },
    orderBy: [{ exam: { name: "asc" } }, { name: "asc" }],
    select: { id: true, name: true, exam: { select: { name: true } } },
  });
}

export function listSubjectsWithTopics(userId: string) {
  return prisma.subject.findMany({
    where: { exam: { userId } },
    orderBy: [{ exam: { name: "asc" } }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      exam: { select: { name: true } },
      topics: {
        orderBy: [{ position: "asc" }, { createdAt: "asc" }],
        select: { id: true, code: true, title: true },
      },
    },
  });
}
