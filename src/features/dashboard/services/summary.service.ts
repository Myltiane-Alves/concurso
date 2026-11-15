import { prisma } from "@/lib/prisma";
import { isoToDate, todayISO } from "@/lib/dates";

export async function getSummary(userId: string) {
  const leaf = { subject: { exam: { userId } }, children: { none: {} } };

  const [exams, subjects, topics, topicsDone, reviewsDue] = await Promise.all([
    prisma.exam.count({ where: { userId } }),
    prisma.subject.count({ where: { exam: { userId } } }),
    prisma.topic.count({ where: leaf }),
    prisma.topic.count({ where: { ...leaf, status: "DONE" } }),
    prisma.review.count({
      where: { userId, status: "PENDING", dueDate: { lte: isoToDate(todayISO()) } },
    }),
  ]);

  return { exams, subjects, topics, topicsDone, reviewsDue };
}
