import type { TopicStatus } from "@prisma/client";
import { AppError } from "@/lib/errors";
import { subjectExists } from "@/features/subjects/repositories/subject.repository";
import * as repo from "../repositories/topic.repository";
import type { TopicInput } from "../schemas/topic.schema";
import { parseEditalText } from "../utils/parse-edital";

async function assertSubject(userId: string, subjectId: string) {
  if (!(await subjectExists(userId, subjectId))) {
    throw new AppError("Disciplina não encontrada", 404);
  }
}

export async function createTopic(userId: string, input: TopicInput) {
  await assertSubject(userId, input.subjectId);

  if (input.parentId && !(await repo.findInSubject(input.parentId, input.subjectId))) {
    throw new AppError("Conteúdo pai inválido", 400);
  }

  const position = await repo.countBySubject(input.subjectId);
  return repo.createTopic({ ...input, position });
}

export async function importFromText(userId: string, subjectId: string, text: string) {
  await assertSubject(userId, subjectId);

  const items = parseEditalText(text);
  if (items.length === 0) {
    throw new AppError("Não encontrei itens numerados no texto (ex.: 1, 1.1, 1.2).", 400);
  }
  return repo.importTopics(subjectId, items);
}

export function setStatus(userId: string, id: string, status: TopicStatus) {
  return repo.updateStatus(userId, id, status);
}

export function removeTopic(userId: string, id: string) {
  return repo.deleteTopic(userId, id);
}
