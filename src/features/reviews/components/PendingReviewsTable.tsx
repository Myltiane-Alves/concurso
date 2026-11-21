"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { ActionForm } from "@/components/ActionForm";
import { AppDataTable } from "@/components/AppDataTable";
import { DeleteButton } from "@/components/DeleteButton";
import { MutateForm } from "@/components/MutateForm";
import { dateToISO } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { completeReviewAction, deleteReviewAction, postponeReviewAction } from "../actions";
import { suggestedNextDays } from "../utils/intervals";

type Kind = "overdue" | "today" | "upcoming";

const KIND_LABEL: Record<Kind, string> = { overdue: "Atrasada", today: "Hoje", upcoming: "Próxima" };

type Review = {
  id: string;
  title: string;
  dueDate: Date;
  intervalDays: number | null;
  postponedCount: number;
  notes: string | null;
  subject: { name: string } | null;
};

type Row = {
  id: string;
  ts: number;
  dateLabel: string;
  title: string;
  subject: string;
  kind: Kind;
  kindLabel: string;
  interval: string;
  postponed: string;
  notes: string;
  intervalDays: number | null;
};

export function PendingReviewsTable({ reviews, today }: { reviews: Review[]; today: string }) {
  const rows = useMemo<Row[]>(
    () =>
      reviews.map((r) => {
        const due = dateToISO(r.dueDate);
        const kind: Kind = due < today ? "overdue" : due === today ? "today" : "upcoming";
        return {
          id: r.id,
          ts: new Date(r.dueDate).getTime(),
          dateLabel: formatDate(r.dueDate),
          title: r.title,
          subject: r.subject?.name ?? "",
          kind,
          kindLabel: KIND_LABEL[kind],
          interval: r.intervalDays ? `${r.intervalDays} dia(s)` : "",
          postponed: r.postponedCount > 0 ? `${r.postponedCount}x` : "",
          notes: r.notes ?? "",
          intervalDays: r.intervalDays,
        };
      }),
    [reviews, today]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="ts"
      sortOrder={1}
      globalFields={["title", "subject", "dateLabel", "kindLabel", "notes"]}
      emptyMessage="Nenhuma revisão pendente."
      rowExpansionTemplate={(r: Row) => (
        <div className="expansion">
          <strong>Concluir revisão: {r.title}</strong>
          <ActionForm action={completeReviewAction} submitLabel="Registrar revisão">
            <input type="hidden" name="id" value={r.id} />
            <div className="form-grid">
              <label>
                Como foi? *
                <select name="difficulty" defaultValue="MEDIUM">
                  <option value="EASY">Fácil</option>
                  <option value="MEDIUM">Médio</option>
                  <option value="HARD">Difícil</option>
                </select>
              </label>
              <label>
                Próxima revisão em (dias)
                <input
                  name="nextInDays"
                  type="number"
                  min={1}
                  max={365}
                  defaultValue={suggestedNextDays(r.intervalDays) ?? ""}
                  placeholder="Deixe vazio para não agendar"
                />
              </label>
            </div>
            <label>
              Observações
              <textarea name="notes" rows={2} placeholder="O que ainda precisa reforçar?" />
            </label>
          </ActionForm>
        </div>
      )}
    >
      <Column expander header="Concluir" style={{ width: "5.5rem" }} />
      <Column
        field="title"
        header="Revisão"
        sortable
        body={(r: Row) => (
          <div className="cell-stack">
            <strong>{r.title}</strong>
            {r.notes && <span className="muted small">{r.notes}</span>}
          </div>
        )}
      />
      <Column field="subject" header="Disciplina" sortable />
      <Column field="dateLabel" header="Prevista" sortable sortField="ts" />
      <Column
        field="kindLabel"
        header="Situação"
        sortable
        sortField="ts"
        body={(r: Row) => <span className={`badge-due ${r.kind}`}>{r.kindLabel}</span>}
      />
      <Column field="interval" header="Intervalo" />
      <Column field="postponed" header="Adiada" />
      <Column
        header="Ações"
        style={{ width: "11rem" }}
        body={(r: Row) => (
          <div className="row-actions">
            {[1, 3].map((days) => (
              <MutateForm key={days} action={postponeReviewAction}>
                <input type="hidden" name="id" value={r.id} />
                <input type="hidden" name="days" value={days} />
                <button type="submit" className="btn-small" title={`Adiar ${days} dia(s)`}>
                  +{days}d
                </button>
              </MutateForm>
            ))}
            <DeleteButton action={deleteReviewAction} fields={{ id: r.id }} message="Excluir esta revisão?" />
          </div>
        )}
      />
    </AppDataTable>
  );
}
