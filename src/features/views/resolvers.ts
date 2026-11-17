import { AppError } from "@/lib/errors";
import { addDays, dateToISO, isValidISO, startOfWeek, todayISO } from "@/lib/dates";
import { getSummary } from "@/features/dashboard/services/summary.service";
import { getExam, listExamOptions, listExams } from "@/features/exams/services/exam.service";
import { calcProgress, getSubject, listSubjects } from "@/features/subjects/services/subject.service";
import {
  listSubjectOptions,
  listSubjectsWithTopics,
} from "@/features/subjects/repositories/subject.repository";
import { getActivePlan, getPlan, listPlans } from "@/features/plans/services/plan.service";
import { countOverdue, listBetween, listDay } from "@/features/agenda/services/activity.service";
import {
  getActive,
  getTodaySeconds,
  listFinished,
  listManual,
} from "@/features/sessions/services/session.service";
import {
  getMonthly,
  getPerformance,
  listDifficulties,
} from "@/features/performance/services/performance.service";
import { getStats, listPaged, listRecent } from "@/features/questions/services/question.service";
import { listCompleted, listPending } from "@/features/reviews/services/review.service";
import { listErrors } from "@/features/errors/services/error-note.service";
import { getComparison } from "@/features/compare/services/compare.service";
import { listWithProgress } from "@/features/goals/services/goal.service";
import { listNotes } from "@/features/notes/services/note.service";

const PERIODS = [7, 30, 90];

export async function dashboardView(userId: string) {
  const [summary, goals] = await Promise.all([getSummary(userId), listWithProgress(userId, true)]);
  return { ...summary, goals };
}

export async function goalsView(userId: string) {
  const [goals, subjects] = await Promise.all([listWithProgress(userId), listSubjectOptions(userId)]);
  return { goals, subjects };
}

export const examsView = (userId: string) => listExams(userId);

export async function examView(userId: string, id: string) {
  const exam = await getExam(userId, id);
  if (!exam) throw new AppError("Concurso não encontrado", 404);
  return exam;
}

export async function subjectsView(userId: string) {
  const [exams, subjects] = await Promise.all([listExamOptions(userId), listSubjects(userId)]);
  return {
    exams,
    subjects: subjects.map((s) => ({
      id: s.id,
      name: s.name,
      priority: s.priority,
      exam: s.exam,
      progress: calcProgress(s.topics),
    })),
  };
}

export async function subjectView(userId: string, id: string) {
  const subject = await getSubject(userId, id);
  if (!subject) throw new AppError("Disciplina não encontrada", 404);
  return subject;
}

export async function planningView(userId: string) {
  const today = todayISO();
  const [plan, activities, overdue] = await Promise.all([
    getActivePlan(userId),
    listDay(userId, today),
    countOverdue(userId),
  ]);
  return { today, plan, activities, overdue };
}

export async function cycleView(userId: string, plano?: string) {
  const plans = await listPlans(userId);
  const selectedId = plans.find((p) => p.id === plano)?.id ?? plans[0]?.id ?? null;
  const [plan, subjects] = await Promise.all([
    selectedId ? getPlan(userId, selectedId) : Promise.resolve(null),
    listSubjectOptions(userId),
  ]);
  return {
    plans: plans.map((p) => ({ id: p.id, name: p.name, isActive: p.isActive })),
    selectedId,
    plan,
    subjects,
  };
}

export async function agendaView(userId: string, semana?: string) {
  const today = todayISO();
  const start = startOfWeek(semana && isValidISO(semana) ? semana : today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  const [activities, subjects, overdue] = await Promise.all([
    listBetween(userId, days[0], days[6]),
    listSubjectOptions(userId),
    countOverdue(userId),
  ]);
  return { today, start, days, activities, subjects, overdue };
}

export async function studyView(userId: string) {
  const [active, history, manualEntries, todaySeconds, subjects, plan] = await Promise.all([
    getActive(userId),
    listFinished(userId, 10),
    listManual(userId, 30),
    getTodaySeconds(userId),
    listSubjectsWithTopics(userId),
    getActivePlan(userId),
  ]);

  const next = plan?.items.find((i) => !i.doneInRound);
  const nextBlock = next
    ? { id: next.id, minutes: next.minutes, subject: { id: next.subject.id, name: next.subject.name } }
    : null;

  return {
    active,
    history,
    manualEntries,
    todaySeconds,
    subjects,
    nextBlock,
    today: todayISO(),
    serverNow: Date.now(),
  };
}

export async function performanceView(userId: string, periodo?: string) {
  const days = PERIODS.includes(Number(periodo)) ? Number(periodo) : 30;
  const [perf, subjects, difficulties, questions] = await Promise.all([
    getPerformance(userId, days),
    listSubjects(userId),
    listDifficulties(userId, 5),
    getStats(userId, days),
  ]);
  return {
    days,
    perf,
    subjects: subjects.map((s) => ({
      id: s.id,
      name: s.name,
      exam: s.exam,
      progress: calcProgress(s.topics),
    })),
    difficulties,
    questions,
  };
}

export const monthlyPerformanceView = (userId: string, mes?: string) => getMonthly(userId, mes);

export async function questionsView(userId: string, periodo?: string) {
  const days = periodo === "todos" ? null : PERIODS.includes(Number(periodo)) ? Number(periodo) : 30;
  const [stats, subjects, recent] = await Promise.all([
    getStats(userId, days),
    listSubjectsWithTopics(userId),
    listRecent(userId, 5),
  ]);
  return { days, today: todayISO(), stats, subjects, recent };
}

export async function reviewsView(userId: string) {
  const [pending, completed, subjects] = await Promise.all([
    listPending(userId),
    listCompleted(userId, 30),
    listSubjectsWithTopics(userId),
  ]);
  return { today: todayISO(), pending, completed, subjects };
}

export async function errorsView(userId: string) {
  const [items, subjects] = await Promise.all([listErrors(userId), listSubjectsWithTopics(userId)]);
  return { items, subjects };
}

export async function notesView(userId: string) {
  const [items, subjects] = await Promise.all([listNotes(userId), listSubjectsWithTopics(userId)]);
  return { items, subjects };
}

export async function compareView(userId: string, idsParam?: string) {
  const exams = (await listExams(userId)).map((e) => ({
    id: e.id,
    name: e.name,
    subjects: e._count.subjects,
  }));
  const valid = new Set(exams.map((e) => e.id));
  const selectedIds = [...new Set((idsParam ?? "").split(",").filter((id) => valid.has(id)))].slice(0, 4);
  const comparison = selectedIds.length >= 2 ? await getComparison(userId, selectedIds) : null;
  return { exams, selectedIds, comparison };
}

const HISTORY_PAGE_SIZE = 20;

export async function questionHistoryView(userId: string, disciplina?: string, pagina?: string) {
  const page = Math.max(1, Number.parseInt(pagina ?? "1", 10) || 1);
  const [{ items, total }, subjects] = await Promise.all([
    listPaged(userId, { subjectId: disciplina || undefined, page, pageSize: HISTORY_PAGE_SIZE }),
    listSubjectOptions(userId),
  ]);
  return { items, total, page, pageSize: HISTORY_PAGE_SIZE, subjects, disciplina: disciplina ?? "" };
}

export async function resolveView(name: string[], userId: string, params: URLSearchParams) {
  const [view, id = ""] = name;

  switch (view) {
    case "dashboard":
      return dashboardView(userId);
    case "goals":
      return goalsView(userId);
    case "exams":
      return examsView(userId);
    case "exam":
      return examView(userId, id);
    case "subjects":
      return subjectsView(userId);
    case "subject":
      return subjectView(userId, id);
    case "planning":
      return planningView(userId);
    case "cycle":
      return cycleView(userId, params.get("plano") || undefined);
    case "agenda":
      return agendaView(userId, params.get("semana") || undefined);
    case "study":
      return studyView(userId);
    case "performance":
      return performanceView(userId, params.get("periodo") || undefined);
    case "monthly-performance":
      return monthlyPerformanceView(userId, params.get("mes") || undefined);
    case "questions":
      return questionsView(userId, params.get("periodo") || undefined);
    case "reviews":
      return reviewsView(userId);
    case "errors":
      return errorsView(userId);
    case "notes":
      return notesView(userId);
    case "compare":
      return compareView(userId, params.get("ids") || undefined);
    case "question-history":
      return questionHistoryView(
        userId,
        params.get("disciplina") || undefined,
        params.get("pagina") || undefined
      );
    default:
      throw new AppError("Tela não encontrada", 404);
  }
}
