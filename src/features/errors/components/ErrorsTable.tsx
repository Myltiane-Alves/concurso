"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { DeleteButton } from "@/components/DeleteButton";
import { dateTimeLabel } from "@/lib/dates";
import { deleteErrorNoteAction } from "../actions";
import { ERROR_CATEGORY_LABEL } from "../utils/labels";

type Note = {
  id: string;
  category: string;
  statement: string;
  wrongAnswer: string | null;
  correctAnswer: string | null;
  explanation: string | null;
  createdAt: Date;
  subject: { name: string } | null;
  topic: { code: string | null; title: string } | null;
};

type Row = {
  id: string;
  ts: number;
  dateLabel: string;
  subject: string;
  topic: string;
  category: string;
  categoryLabel: string;
  statement: string;
  wrongAnswer: string;
  correctAnswer: string;
  explanation: string;
};

export function ErrorsTable({ notes }: { notes: Note[] }) {
  const rows = useMemo<Row[]>(
    () =>
      notes.map((n) => ({
        id: n.id,
        ts: new Date(n.createdAt).getTime(),
        dateLabel: dateTimeLabel(new Date(n.createdAt)),
        subject: n.subject?.name ?? "Disciplina removida",
        topic: n.topic ? `${n.topic.code ? `${n.topic.code} ` : ""}${n.topic.title}` : "",
        category: n.category,
        categoryLabel: ERROR_CATEGORY_LABEL[n.category] ?? n.category,
        statement: n.statement,
        wrongAnswer: n.wrongAnswer ?? "",
        correctAnswer: n.correctAnswer ?? "",
        explanation: n.explanation ?? "",
      })),
    [notes]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="ts"
      globalFields={["dateLabel", "subject", "topic", "categoryLabel", "statement", "wrongAnswer", "correctAnswer", "explanation"]}
      emptyMessage="Nenhum erro encontrado."
      rowExpansionTemplate={(r: Row) => (
        <div className="expansion">
          <p className="pre">{r.statement}</p>
          {(r.wrongAnswer || r.correctAnswer) && (
            <p className="small">
              {r.wrongAnswer && (
                <span className="answer wrong">
                  Marcou: <strong>{r.wrongAnswer}</strong>
                </span>
              )}
              {r.correctAnswer && (
                <span className="answer right">
                  Correta: <strong>{r.correctAnswer}</strong>
                </span>
              )}
            </p>
          )}
          {r.explanation && <p className="pre muted small">{r.explanation}</p>}
        </div>
      )}
    >
      <Column expander header="Detalhes" style={{ width: "5.5rem" }} />
      <Column field="dateLabel" header="Data" sortable sortField="ts" />
      <Column field="subject" header="Disciplina" sortable />
      <Column field="topic" header="Conteúdo" sortable />
      <Column
        field="categoryLabel"
        header="Categoria"
        sortable
        body={(r: Row) => <span className={`badge-cat ${r.category}`}>{r.categoryLabel}</span>}
      />
      <Column
        field="statement"
        header="Enunciado"
        body={(r: Row) => <span className="cell-clamp">{r.statement}</span>}
      />
      <Column
        header="Ações"
        style={{ width: "5rem" }}
        body={(r: Row) => (
          <DeleteButton action={deleteErrorNoteAction} fields={{ id: r.id }} message="Excluir este erro?" />
        )}
      />
    </AppDataTable>
  );
}
