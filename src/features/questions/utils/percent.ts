/** Percentual de acertos com uma casa decimal. Sempre calculado sobre os totais (RN004). */
export function percent(correct: number, total: number) {
  return total === 0 ? 0 : Math.round((correct / total) * 1000) / 10;
}

export function level(value: number) {
  if (value >= 80) return "good";
  if (value >= 60) return "warn";
  return "bad";
}
