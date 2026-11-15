import { addDays, todayISO } from "@/lib/dates";
import * as repo from "../repositories/performance.repository";
import { aggregate } from "../utils/aggregate";

export const MAX_PERIOD_DAYS = 90;

export async function getPerformance(userId: string, periodDays: number) {
  const today = todayISO();
  // Busca sempre a janela máxima: o período só filtra e a sequência usa o histórico.
  const sessions = await repo.listFinishedSince(userId, addDays(today, -(MAX_PERIOD_DAYS - 1)));
  return aggregate(sessions, addDays(today, -(periodDays - 1)), today, today);
}

export const listDifficulties = repo.listDifficulties;
