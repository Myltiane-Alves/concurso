import { randomUUID } from "crypto";
import type { TopicStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { ParsedTopic } from "../utils/parse-edital";

export function countBySubject(subjectId: string) {
  return prisma.topic.count({ where: { subjectId } });
}

export function findInSubject(id: string, subjectId: string) {
  return prisma.topic.findFirst({ where: { id, subjectId }, select: { id: true } });
}

export function createTopic(data: {
  subjectId: string;
  title: string;
  code?: string;
  parentId?: string;
  position: number;
}) {
  return prisma.topic.create({ data });
}

export function updateStatus(userId: string, id: string, status: TopicStatus) {
  return prisma.topic.updateMany({
    where: { id, subject: { exam: { userId } } },
    data: { status },
  });
}

export function deleteTopic(userId: string, id: string) {
  return prisma.topic.deleteMany({ where: { id, subject: { exam: { userId } } } });
}

export async function importTopics(subjectId: string, items: ParsedTopic[]) {
  const existing = await prisma.topic.findMany({
    where: { subjectId },
    select: { id: true, code: true },
  });

  const idByCode = new Map<string, string>();
  for (const t of existing) if (t.code) idByCode.set(t.code, t.id);

  let position = existing.length;
  const data: {
    id: string;
    subjectId: string;
    parentId: string | null;
    code: string;
    title: string;
    position: number;
  }[] = [];

  for (const item of items) {
    if (idByCode.has(item.code)) continue; // evita duplicar códigos já cadastrados
    const id = randomUUID();
    const parentId = item.parentCode ? (idByCode.get(item.parentCode) ?? null) : null;
    idByCode.set(item.code, id);
    data.push({ id, subjectId, parentId, code: item.code, title: item.title, position: position++ });
  }

  if (data.length > 0) await prisma.topic.createMany({ data });
  return data.length;
}
