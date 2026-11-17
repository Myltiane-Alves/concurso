"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ComingSoon } from "@/components/ComingSoon";
import { useRoute } from "@/lib/hash-router";
import { queries } from "@/lib/queries";
import { AgendaScreen } from "@/screens/AgendaScreen";
import { CompareScreen } from "@/screens/CompareScreen";
import { CycleScreen } from "@/screens/CycleScreen";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { ErrorsScreen } from "@/screens/ErrorsScreen";
import { NotesScreen } from "@/screens/NotesScreen";
import { ExamDetailScreen } from "@/screens/ExamDetailScreen";
import { ExamsScreen } from "@/screens/ExamsScreen";
import { GoalsScreen } from "@/screens/GoalsScreen";
import { MonthlyPerformanceScreen } from "@/screens/MonthlyPerformanceScreen";
import { PerformanceScreen } from "@/screens/PerformanceScreen";
import { PlanningScreen } from "@/screens/PlanningScreen";
import { QuestionHistoryScreen } from "@/screens/QuestionHistoryScreen";
import { QuestionsScreen } from "@/screens/QuestionsScreen";
import { ReviewsScreen } from "@/screens/ReviewsScreen";
import { StudyScreen } from "@/screens/StudyScreen";
import { SubjectDetailScreen } from "@/screens/SubjectDetailScreen";
import { SubjectsScreen } from "@/screens/SubjectsScreen";

export function AppRouter() {
  const { segments, params } = useRoute();
  const queryClient = useQueryClient();
  const [section = "dashboard", id] = segments;
  const routeKey = segments.join("/");

  // Ao trocar de tela, volta ao topo.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [routeKey]);

  // Depois de carregar, busca as telas principais em segundo plano: a navegação fica instantânea.
  useEffect(() => {
    const timer = setTimeout(() => {
      queryClient.prefetchQuery(queries.exams());
      queryClient.prefetchQuery(queries.subjects());
      queryClient.prefetchQuery(queries.planning());
      queryClient.prefetchQuery(queries.study());
      queryClient.prefetchQuery(queries.questions());
      queryClient.prefetchQuery(queries.performance());
      queryClient.prefetchQuery(queries.reviews());
    }, 1200);
    return () => clearTimeout(timer);
  }, [queryClient]);

  switch (section) {
    case "dashboard":
      return <DashboardScreen />;
    case "concursos":
      return id ? <ExamDetailScreen id={id} /> : <ExamsScreen />;
    case "disciplinas":
      return id ? <SubjectDetailScreen id={id} /> : <SubjectsScreen />;
    case "metas":
      return <GoalsScreen />;
    case "comparar":
      return <CompareScreen ids={params.get("ids") ?? undefined} />;
    case "planejamento":
      if (id === "ciclo") return <CycleScreen plano={params.get("plano") ?? undefined} />;
      if (id === "agenda") return <AgendaScreen semana={params.get("semana") ?? undefined} />;
      return <PlanningScreen />;
    case "estudar":
      return <StudyScreen />;
    case "questoes":
      return id === "historico" ? (
        <QuestionHistoryScreen
          disciplina={params.get("disciplina") ?? undefined}
          pagina={params.get("pagina") ?? undefined}
        />
      ) : (
        <QuestionsScreen periodo={params.get("periodo") ?? undefined} />
      );
    case "desempenho":
      if (id === "mensal") return <MonthlyPerformanceScreen mes={params.get("mes") ?? undefined} />;
      return <PerformanceScreen periodo={params.get("periodo") ?? undefined} />;
    case "revisoes":
      return <ReviewsScreen />;
    case "caderno-erros":
      return <ErrorsScreen />;
    case "anotacoes":
      return <NotesScreen />;
    default:
      return <ComingSoon title="Página não encontrada" />;
  }
}
