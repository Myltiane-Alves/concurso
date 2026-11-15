import { prisma } from "@/lib/prisma";

const planInclude = {
  items: {
    orderBy: { position: "asc" as const },
    include: {
      subject: { select: { id: true, name: true, exam: { select: { name: true } } } },
    },
  },
};

export function listPlans(userId: string) {
  return prisma.studyPlan.findMany({
    where: { userId },
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    include: { items: { select: { minutes: true, doneInRound: true } } },
  });
}

export function getPlan(userId: string, id: string) {
  return prisma.studyPlan.findFirst({ where: { id, userId }, include: planInclude });
}

export function getActivePlan(userId: string) {
  return prisma.studyPlan.findFirst({ where: { userId, isActive: true }, include: planInclude });
}

export function createPlan(userId: string, name: string) {
  return prisma.$transaction(async (tx) => {
    await tx.studyPlan.updateMany({ where: { userId }, data: { isActive: false } });
    return tx.studyPlan.create({ data: { userId, name, isActive: true } });
  });
}

export async function setActivePlan(userId: string, id: string) {
  const plan = await prisma.studyPlan.findFirst({ where: { id, userId }, select: { id: true } });
  if (!plan) return false;
  await prisma.$transaction([
    prisma.studyPlan.updateMany({ where: { userId }, data: { isActive: false } }),
    prisma.studyPlan.update({ where: { id }, data: { isActive: true } }),
  ]);
  return true;
}

export function deletePlan(userId: string, id: string) {
  return prisma.studyPlan.deleteMany({ where: { id, userId } });
}

export async function planExists(userId: string, id: string) {
  const plan = await prisma.studyPlan.findFirst({ where: { id, userId }, select: { id: true } });
  return !!plan;
}

export async function addItem(planId: string, subjectId: string, minutes: number) {
  const max = await prisma.studyPlanItem.aggregate({ where: { planId }, _max: { position: true } });
  return prisma.studyPlanItem.create({
    data: { planId, subjectId, minutes, position: (max._max.position ?? -1) + 1 },
  });
}

export function findItem(userId: string, id: string) {
  return prisma.studyPlanItem.findFirst({ where: { id, plan: { userId } } });
}

export function removeItem(userId: string, id: string) {
  return prisma.studyPlanItem.deleteMany({ where: { id, plan: { userId } } });
}

export function setItemDone(id: string, done: boolean) {
  return prisma.studyPlanItem.update({ where: { id }, data: { doneInRound: done } });
}

export function countPending(planId: string) {
  return prisma.studyPlanItem.count({ where: { planId, doneInRound: false } });
}

export function startNewRound(planId: string) {
  return prisma.$transaction([
    prisma.studyPlanItem.updateMany({ where: { planId }, data: { doneInRound: false } }),
    prisma.studyPlan.update({ where: { id: planId }, data: { rounds: { increment: 1 } } }),
  ]);
}

export function resetRound(planId: string) {
  return prisma.studyPlanItem.updateMany({ where: { planId }, data: { doneInRound: false } });
}

export async function swapItem(planId: string, itemId: string, direction: -1 | 1) {
  const items = await prisma.studyPlanItem.findMany({
    where: { planId },
    orderBy: { position: "asc" },
    select: { id: true, position: true },
  });
  const index = items.findIndex((i) => i.id === itemId);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= items.length) return;

  await prisma.$transaction([
    prisma.studyPlanItem.update({ where: { id: items[index].id }, data: { position: items[target].position } }),
    prisma.studyPlanItem.update({ where: { id: items[target].id }, data: { position: items[index].position } }),
  ]);
}
