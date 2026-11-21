"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { DeleteButton } from "@/components/DeleteButton";
import { formatDate } from "@/lib/format";
import { deleteQuestionRecordAction } from "../actions";
import { level, percent } from "../utils/percent";

type Rec = {
  id: string;
  date: Date;
  total: number;
  correct: number;
  board: string | null;
  source: string | null;
  notes: string | null;
  subject: { name: string } | null;
  topic: { code: string | null; title: string } | null;
};

type Row = {
  id: string;
  ts: number;
  dateLabel: string;
  subject: string;
  topic: string;
  origin: string;
  correct: number;
  total: number;
  percent: number;
  notes: string;
};

export function RecordsTable({ records }: { records: Rec[] }) {
  const rows = useMemo<Row[]>(
    () =>
      records.map((r) => ({
        id: r.id,
        ts: new Date(r.date).getTime(),
        dateLabel: formatDate(new Date(r.date)),
        subject: r.subject?.name ?? "Disciplina removida",
        topic: r.topic ? `${r.topic.code ? `${r.topic.code} ` : ""}${r.topic.title}` : "",
        origin: [r.board, r.source].filter(Boolean).join(" · "),
        correct: r.correct,
        total: r.total,
        percent: percent(r.correct, r.total),
        notes: r.notes ?? "",
      })),
    [records]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="ts"
      globalFields={["dateLabel", "subject", "topic", "origin", "notes"]}
      emptyMessage="Nenhum registro encontrado."
    >
      <Column field="dateLabel" header="Data" sortable sortField="ts" />
      <Column field="subject" header="Disciplina" sortable />
      <Column field="topic" header="Conteúdo" sortable />
      <Column field="origin" header="Banca / fonte" />
      <Column
        header="Acertos"
        sortable
        sortField="percent"
        body={(r: Row) => (
          <span className={`score ${level(r.percent)}`}>
            {r.correct}/{r.total} · {r.percent}%
          </span>
        )}
      />
      <Column field="notes" header="Observações" />
      <Column
        header="Ações"
        style={{ width: "5rem" }}
        body={(r: Row) => (
          <DeleteButton action={deleteQuestionRecordAction} fields={{ id: r.id }} message="Excluir este registro?" />
        )}
      />
    </AppDataTable>
  );
}
