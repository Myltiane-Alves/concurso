import { formatMinutes } from "@/lib/format";
import type { GoalPeriod, GoalType } from "./progress";

export const TYPE_LABEL: Record<GoalType, string> = {
  STUDY_TIME: "Tempo de estudo",
  QUESTIONS: "Questões",
};

export const PERIOD_LABEL: Record<GoalPeriod, string> = {
  DAILY: "Diária",
  WEEKLY: "Semanal",
  MONTHLY: "Mensal",
};

const PERIOD_SUFFIX: Record<GoalPeriod, string> = {
  DAILY: "por dia",
  WEEKLY: "por semana",
  MONTHLY: "por mês",
};

export function formatAmount(type: GoalType, value: number) {
  return type === "STUDY_TIME" ? formatMinutes(value) : `${value} questões`;
}

export function goalTitle(g: {
  type: GoalType;
  period: GoalPeriod;
  target: number;
  subject: { name: string } | null;
}) {
  const verb = g.type === "STUDY_TIME" ? "Estudar" : "Resolver";
  return `${verb} ${formatAmount(g.type, g.target)} ${PERIOD_SUFFIX[g.period]} · ${
    g.subject ? g.subject.name : "Todas as disciplinas"
  }`;
}
