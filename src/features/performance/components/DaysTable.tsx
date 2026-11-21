"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { dayMonthLabel, isoToDate, weekdayLabel } from "@/lib/dates";
import { formatDuration } from "@/lib/format";
import type { DayDetail } from "../utils/daily";

type Row = {
  id: string;
  ts: number;
  dateLabel: string;
  seconds: number;
  duration: string;
  sessions: number;
  subjectsText: string;
  day: DayDetail;
};

export function DaysTable({ days }: { days: DayDetail[] }) {
  const maxSeconds = Math.max(1, ...days.map((d) => d.seconds));

  const rows = useMemo<Row[]>(
    () =>
      days.map((d) => ({
        id: d.date,
        ts: isoToDate(d.date).getTime(),
        dateLabel: `${dayMonthLabel(d.date)} ${weekdayLabel(d.date)}`,
        seconds: d.seconds,
        duration: d.seconds > 0 ? formatDuration(d.seconds) : "—",
        sessions: d.sessionsCount,
        subjectsText: d.subjects.map((s) => s.name).join(" "),
        day: d,
      })),
    [days]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="ts"
      globalFields={["dateLabel", "duration", "subjectsText"]}
      emptyMessage="Nenhum dia encontrado."
      rowExpansionTemplate={(r: Row) => (
        <div className="expansion">
          {r.day.subjects.map((s) => (
            <div key={s.id} className="day-subject">
              <span>{s.name}</span>
              <span className="muted small">{formatDuration(s.seconds)}</span>
            </div>
          ))}
          <span className="muted small">{r.sessions} sessão(ões)</span>
        </div>
      )}
    >
      <Column expander={(r: Row) => r.seconds > 0} header="Detalhe" style={{ width: "5rem" }} />
      <Column
        field="dateLabel"
        header="Dia"
        sortable
        sortField="ts"
        body={(r: Row) => (
          <span className="day-name">
            <strong>{dayMonthLabel(r.day.date)}</strong>
            <span className="muted small">{weekdayLabel(r.day.date)}</span>
          </span>
        )}
      />
      <Column
        header="Horas no dia"
        style={{ minWidth: "10rem" }}
        body={(r: Row) => (
          <span className="day-bar">
            <span
              className="day-bar-fill"
              style={{ width: `${r.seconds === 0 ? 0 : Math.max(2, (r.seconds / maxSeconds) * 100)}%` }}
            />
          </span>
        )}
      />
      <Column field="duration" header="Tempo" sortable sortField="seconds" />
      <Column field="sessions" header="Sessões" sortable />
    </AppDataTable>
  );
}
