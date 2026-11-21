"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { NavLink } from "@/components/NavLink";
import { formatDuration } from "@/lib/format";
import { monthLabel, type MonthSummary } from "../utils/monthly";

type Row = {
  id: string;
  ts: number;
  label: string;
  duration: string;
  seconds: number;
  days: number;
  questions: number;
  questionsLabel: string;
};

export function MonthsTable({ overview, selected }: { overview: MonthSummary[]; selected: string }) {
  const rows = useMemo<Row[]>(
    () =>
      overview.map((m) => ({
        id: m.month,
        ts: Number(m.month.replace("-", "")),
        label: monthLabel(m.month),
        duration: m.seconds > 0 ? formatDuration(m.seconds) : "—",
        seconds: m.seconds,
        days: m.studiedDays,
        questions: m.questions,
        questionsLabel: m.questions > 0 ? `${m.questions} · ${m.percent}%` : "—",
      })),
    [overview]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="ts"
      globalFields={["label", "duration", "questionsLabel"]}
      rowClassName={(r: Row) => (r.id === selected ? "is-selected-row" : "")}
    >
      <Column
        field="label"
        header="Mês"
        sortable
        sortField="ts"
        body={(r: Row) => <NavLink to={`/desempenho/mensal?mes=${r.id}`}>{r.label}</NavLink>}
      />
      <Column field="duration" header="Tempo" sortable sortField="seconds" />
      <Column field="days" header="Dias estudados" sortable />
      <Column field="questionsLabel" header="Questões" sortable sortField="questions" />
    </AppDataTable>
  );
}
