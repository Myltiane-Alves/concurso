import { prisma } from "@/lib/prisma";

function dateFilter(since?: Date, until?: Date) {
  if (!since && !until) return {};
  return { date: { ...(since ? { gte: since } : {}), ...(until ? { lte: until } : {}) } };
}

const withRelations = {
  subject: { select: { name: true } },
  topic: { select: { code: true, title: true } },
};

export function createRecord(data: {
  userId: string;
  subjectId: string;
  topicId?: string;
  board?: string;
  source?: string;
  date: Date;
  total: number;
  correct: number;
  notes?: string;
}) {
  return prisma.questionRecord.create({ data });
}

export function listRecent(userId: string, take: number) {
  return prisma.questionRecord.findMany({
    where: { userId },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    take,
    include: withRelations,
  });
}

export async function listPaged(
  userId: string,
  opts: { subjectId?: string; page: number; pageSize: number }
) {
  const where = { userId, ...(opts.subjectId ? { subjectId: opts.subjectId } : {}) };
  const [items, total] = await Promise.all([
    prisma.questionRecord.findMany({
      where,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: (opts.page - 1) * opts.pageSize,
      take: opts.pageSize,
      include: withRelations,
    }),
    prisma.questionRecord.count({ where }),
  ]);
  return { items, total };
}

export function deleteRecord(userId: string, id: string) {
  return prisma.questionRecord.deleteMany({ where: { id, userId } });
}

export async function sums(userId: string, since?: Date, until?: Date) {
  const result = await prisma.questionRecord.aggregate({
    where: { userId, ...dateFilter(since, until) },
    _sum: { total: true, correct: true },
  });
  return { total: result._sum.total ?? 0, correct: result._sum.correct ?? 0 };
}

export async function sumsBySubject(userId: string, since?: Date, until?: Date) {
  const groups = await prisma.questionRecord.groupBy({
    by: ["subjectId"],
    where: { userId, ...dateFilter(since, until) },
    _sum: { total: true, correct: true },
  });

  const ids = groups.map((g) => g.subjectId).filter((id): id is string => !!id);
  const subjects = ids.length
    ? await prisma.subject.findMany({ where: { id: { in: ids } }, select: { id: true, name: true } })
    : [];
  const names = new Map(subjects.map((s) => [s.id, s.name]));

  return groups.map((g) => ({
    id: g.subjectId ?? "removida",
    name: g.subjectId ? (names.get(g.subjectId) ?? "Disciplina removida") : "Disciplina removida",
    total: g._sum.total ?? 0,
    correct: g._sum.correct ?? 0,
  }));
}
