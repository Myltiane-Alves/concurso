import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import type * as R from "@/features/views/resolvers";
import { apiGet } from "./api-client";

type Data<F extends (...args: never[]) => Promise<unknown>> = Awaited<ReturnType<F>>;

const q = (value?: string) => encodeURIComponent(value ?? "");

export const queries = {
  dashboard: () =>
    queryOptions({
      queryKey: ["view", "dashboard"],
      queryFn: () => apiGet<Data<typeof R.dashboardView>>("dashboard"),
    }),
  goals: () =>
    queryOptions({
      queryKey: ["view", "goals"],
      queryFn: () => apiGet<Data<typeof R.goalsView>>("goals"),
    }),
  exams: () =>
    queryOptions({
      queryKey: ["view", "exams"],
      queryFn: () => apiGet<Data<typeof R.examsView>>("exams"),
    }),
  exam: (id: string) =>
    queryOptions({
      queryKey: ["view", "exam", id],
      queryFn: () => apiGet<Data<typeof R.examView>>(`exam/${q(id)}`),
    }),
  subjects: () =>
    queryOptions({
      queryKey: ["view", "subjects"],
      queryFn: () => apiGet<Data<typeof R.subjectsView>>("subjects"),
    }),
  subject: (id: string) =>
    queryOptions({
      queryKey: ["view", "subject", id],
      queryFn: () => apiGet<Data<typeof R.subjectView>>(`subject/${q(id)}`),
    }),
  planning: () =>
    queryOptions({
      queryKey: ["view", "planning"],
      queryFn: () => apiGet<Data<typeof R.planningView>>("planning"),
    }),
  cycle: (plano?: string) =>
    queryOptions({
      queryKey: ["view", "cycle", plano ?? ""],
      queryFn: () => apiGet<Data<typeof R.cycleView>>(`cycle?plano=${q(plano)}`),
      placeholderData: keepPreviousData,
    }),
  agenda: (semana?: string) =>
    queryOptions({
      queryKey: ["view", "agenda", semana ?? ""],
      queryFn: () => apiGet<Data<typeof R.agendaView>>(`agenda?semana=${q(semana)}`),
      placeholderData: keepPreviousData,
    }),
  study: () =>
    queryOptions({
      queryKey: ["view", "study"],
      queryFn: () => apiGet<Data<typeof R.studyView>>("study"),
    }),
  performance: (periodo?: string) =>
    queryOptions({
      queryKey: ["view", "performance", periodo ?? ""],
      queryFn: () => apiGet<Data<typeof R.performanceView>>(`performance?periodo=${q(periodo)}`),
      placeholderData: keepPreviousData,
    }),
  monthlyPerformance: (mes?: string) =>
    queryOptions({
      queryKey: ["view", "monthly-performance", mes ?? ""],
      queryFn: () => apiGet<Data<typeof R.monthlyPerformanceView>>(`monthly-performance?mes=${q(mes)}`),
      placeholderData: keepPreviousData,
    }),
  dailyPerformance: (mes?: string) =>
    queryOptions({
      queryKey: ["view", "daily-performance", mes ?? ""],
      queryFn: () => apiGet<Data<typeof R.dailyPerformanceView>>(`daily-performance?mes=${q(mes)}`),
      placeholderData: keepPreviousData,
    }),
  questions: (periodo?: string) =>
    queryOptions({
      queryKey: ["view", "questions", periodo ?? ""],
      queryFn: () => apiGet<Data<typeof R.questionsView>>(`questions?periodo=${q(periodo)}`),
      placeholderData: keepPreviousData,
    }),
  reviews: () =>
    queryOptions({
      queryKey: ["view", "reviews"],
      queryFn: () => apiGet<Data<typeof R.reviewsView>>("reviews"),
    }),
  errors: () =>
    queryOptions({
      queryKey: ["view", "errors"],
      queryFn: () => apiGet<Data<typeof R.errorsView>>("errors"),
    }),
  notes: () =>
    queryOptions({
      queryKey: ["view", "notes"],
      queryFn: () => apiGet<Data<typeof R.notesView>>("notes"),
    }),
  compare: (ids?: string) =>
    queryOptions({
      queryKey: ["view", "compare", ids ?? ""],
      queryFn: () => apiGet<Data<typeof R.compareView>>(`compare?ids=${q(ids)}`),
      placeholderData: keepPreviousData,
    }),
  questionHistory: () =>
    queryOptions({
      queryKey: ["view", "question-history"],
      queryFn: () => apiGet<Data<typeof R.questionHistoryView>>("question-history"),
    }),
};
