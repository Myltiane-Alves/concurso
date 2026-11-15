import { prisma } from "@/lib/prisma";

export function listAll(userId: string, take = 500) {
  return prisma.studyNote.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take,
    include: {
      subject: { select: { name: true } },
      topic: { select: { code: true, title: true } },
    },
  });
}

type NoteData = {
  title: string;
  content: string;
  links: string | null;
  subjectId: string | null;
  topicId: string | null;
};

export function create(userId: string, data: NoteData) {
  return prisma.studyNote.create({ data: { ...data, userId } });
}

export function update(userId: string, id: string, data: NoteData) {
  return prisma.studyNote.updateMany({ where: { id, userId }, data });
}

export function remove(userId: string, id: string) {
  return prisma.studyNote.deleteMany({ where: { id, userId } });
}
