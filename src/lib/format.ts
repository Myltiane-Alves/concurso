export function formatDate(date: Date | null | undefined) {
  return date ? date.toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "—";
}

export function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}

export function formatDuration(totalSeconds: number) {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  return formatMinutes(Math.floor(totalSeconds / 60));
}
