"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { dateTimeLabel } from "@/lib/dates";
import { DIFFICULTY_LABEL } from "../utils/intervals";

type Review = {
  id: string;
  title: string;
  completedAt: Date | null;
  difficulty: string | null;
  intervalDays: number | null;
  notes: string | null;
  subject: { name: string } | null;
};

type Row = {
  id: string;
  ts: number;
  dateLabel: string;
  title: string;
  subject: string;
  difficulty: string;
  difficultyLabel: string;
  interval: string;
  notes: string;
};

export function CompletedReviewsTable({ reviews }: { reviews: Review[] }) {
  const rows = useMemo<Row[]>(
    () =>
      reviews.map((r) => ({
        id: r.id,
        ts: r.completedAt ? new Date(r.completedAt).getTime() : 0,
        dateLabel: r.completedAt ? dateTimeLabel(new Date(r.completedAt)) : "",
        title: r.title,
        subject: r.subject?.name ?? "",
        difficulty: r.difficulty ?? "",
        difficultyLabel: r.difficulty ? (DIFFICULTY_LABEL[r.difficulty] ?? r.difficulty) : "",
        interval: r.intervalDays ? `${r.intervalDays} dia(s)` : "",
        notes: r.notes ?? "",
      })),
    [reviews]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="ts"
      globalFields={["title", "subject", "dateLabel", "difficultyLabel", "notes"]}
      emptyMessage="Nenhuma revisão concluída ainda."
    >
      <Column field="dateLabel" header="Concluída em" sortable sortField="ts" />
      <Column field="title" header="Revisão" sortable />
      <Column field="subject" header="Disciplina" sortable />
      <Column
        field="difficultyLabel"
        header="Dificuldade"
        sortable
        body={(r: Row) =>
          r.difficulty ? (
            <span className={`score ${r.difficulty === "EASY" ? "good" : r.difficulty === "MEDIUM" ? "warn" : "bad"}`}>
              {r.difficultyLabel}
            </span>
          ) : null
        }
      />
      <Column field="interval" header="Intervalo" />
      <Column field="notes" header="Observações" />
    </AppDataTable>
  );
}
