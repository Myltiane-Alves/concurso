import { prisma } from "@/lib/prisma";

export function loadExams(userId: string, ids: string[]) {
  return prisma.exam.findMany({
    where: { userId, id: { in: ids } },
    select: {
      id: true,
      name: true,
      subjects: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          equivalenceId: true,
          topics: { select: { id: true, title: true, status: true, parentId: true } },
        },
      },
    },
  });
}

export async function studySecondsBySubject(userId: string, subjectIds: string[]) {
  if (subjectIds.length === 0) return new Map<string, number>();
  const rows = await prisma.studySession.groupBy({
    by: ["subjectId"],
    where: { userId, status: "FINISHED", subjectId: { in: subjectIds } },
    _sum: { totalSeconds: true },
  });
  return new Map(rows.map((r) => [r.subjectId as string, r._sum.totalSeconds ?? 0]));
}

export function findOwnedSubjects(userId: string, ids: string[]) {
  return prisma.subject.findMany({
    where: { id: { in: ids }, exam: { userId } },
    select: { id: true, examId: true, equivalenceId: true },
  });
}

/** Aplica o mesmo vínculo às disciplinas escolhidas e a quem já estava ligado a elas. */
export function setEquivalence(userId: string, ids: string[], oldIds: string[], target: string) {
  return prisma.subject.updateMany({
    where: {
      exam: { userId },
      OR: [{ id: { in: ids } }, ...(oldIds.length ? [{ equivalenceId: { in: oldIds } }] : [])],
    },
    data: { equivalenceId: target },
  });
}

export function clearEquivalence(userId: string, ids: string[]) {
  return prisma.subject.updateMany({
    where: { id: { in: ids }, exam: { userId } },
    data: { equivalenceId: null },
  });
}
