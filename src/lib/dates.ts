// Datas "de calendário" são guardadas ao meio-dia UTC para não mudar de dia por fuso.
const TZ = "America/Sao_Paulo";

export function todayISO() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TZ });
}

export function isoToDate(iso: string) {
  return new Date(`${iso}T12:00:00.000Z`);
}

export function dateToISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function isValidISO(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = isoToDate(value);
  return !Number.isNaN(date.getTime()) && dateToISO(date) === value;
}

export function addDays(iso: string, days: number) {
  const d = isoToDate(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return dateToISO(d);
}

/** Segunda-feira da semana da data informada. */
export function startOfWeek(iso: string) {
  const dayOfWeek = (isoToDate(iso).getUTCDay() + 6) % 7;
  return addDays(iso, -dayOfWeek);
}

export function weekdayLabel(iso: string) {
  return isoToDate(iso).toLocaleDateString("pt-BR", { weekday: "short", timeZone: "UTC" });
}

export function dayMonthLabel(iso: string) {
  return isoToDate(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
}

/** Intervalo do dia no horário de Brasília (UTC-3, sem horário de verão). */
export function dayRange(iso: string) {
  return {
    start: new Date(`${iso}T00:00:00.000-03:00`),
    end: new Date(`${iso}T23:59:59.999-03:00`),
  };
}

export function dateTimeLabel(date: Date) {
  return date.toLocaleString("pt-BR", {
    timeZone: TZ,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Data (YYYY-MM-DD) de um instante, no horário de Brasília. */
export function toLocalISO(date: Date) {
  return date.toLocaleDateString("en-CA", { timeZone: TZ });
}
