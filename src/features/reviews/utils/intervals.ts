/** Sequência sugerida de revisões: 1 dia → 7 dias → 30 dias. */
export function suggestedNextDays(intervalDays: number | null): number | null {
  if (intervalDays === 1) return 7;
  if (intervalDays === 7) return 30;
  return null;
}

export const FIRST_REVIEW_DAYS = 1;

export const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: "Fácil",
  MEDIUM: "Médio",
  HARD: "Difícil",
};
