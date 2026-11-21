"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { dateTimeLabel, isoToDate, toLocalISO } from "@/lib/dates";
import { formatDate, formatDuration } from "@/lib/format";

type Session = {
  id: string;
  endedAt: Date | null;
  totalSeconds: number | null;
  manual: boolean;
  difficulties: string | null;
  subject: { name: string } | null;
  topic: { code: string | null; title: string } | null;
};

type Row = {
  id: string;
  ts: number;
  dateLabel: string;
  subject: string;
  topic: string;
  manual: boolean;
  origin: string;
  seconds: number;
  duration: string;
  difficulties: string;
};

export function SessionHistoryTable({ sessions }: { sessions: Session[] }) {
  const rows = useMemo<Row[]>(
    () =>
      sessions.map((s) => ({
        id: s.id,
        ts: s.endedAt ? new Date(s.endedAt).getTime() : 0,
        // Horas manuais não têm horário real: mostra só o dia.
        dateLabel: s.endedAt
          ? s.manual
            ? formatDate(isoToDate(toLocalISO(s.endedAt)))
            : dateTimeLabel(s.endedAt)
          : "",
        subject: s.subject?.name ?? "Disciplina removida",
        topic: s.topic ? `${s.topic.code ? `${s.topic.code} ` : ""}${s.topic.title}` : "",
        manual: s.manual,
        origin: s.manual ? "Manual" : "Cronômetro",
        seconds: s.totalSeconds ?? 0,
        duration: formatDuration(s.totalSeconds ?? 0),
        difficulties: s.difficulties ?? "",
      })),
    [sessions]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="ts"
      globalFields={["dateLabel", "subject", "topic", "origin", "duration", "difficulties"]}
      emptyMessage="Nenhuma sessão encontrada."
    >
      <Column field="dateLabel" header="Data" sortable sortField="ts" />
      <Column
        field="subject"
        header="Disciplina"
        sortable
        body={(r: Row) => (
          <>
            {r.subject}
            {r.manual && <span className="badge-manual">Manual</span>}
          </>
        )}
      />
      <Column field="topic" header="Conteúdo" sortable />
      <Column field="duration" header="Tempo" sortable sortField="seconds" />
      <Column field="difficulties" header="Dificuldades" />
    </AppDataTable>
  );
}
