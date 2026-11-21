"use client";

import { useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { DeleteButton } from "@/components/DeleteButton";
import { isoToDate, toLocalISO } from "@/lib/dates";
import { formatDate, formatDuration } from "@/lib/format";
import { deleteManualSessionAction } from "../actions";
import { ManualSessionForm, type ManualEntry } from "./ManualSessionForm";

type Subjects = React.ComponentProps<typeof ManualSessionForm>["subjects"];

type Entry = ManualEntry & {
  subject: { name: string } | null;
  topic: { code: string | null; title: string } | null;
};

type Row = {
  id: string;
  ts: number;
  dateLabel: string;
  subject: string;
  topic: string;
  seconds: number;
  duration: string;
  notes: string;
  entry: Entry;
};

export function ManualHoursSection({
  subjects,
  entries,
  today,
}: {
  subjects: Subjects;
  entries: Entry[];
  today: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editing = entries.find((e) => e.id === editingId);

  const rows = useMemo<Row[]>(
    () =>
      entries.map((e) => ({
        id: e.id,
        ts: e.endedAt ? new Date(e.endedAt).getTime() : 0,
        dateLabel: e.endedAt ? formatDate(isoToDate(toLocalISO(e.endedAt))) : "",
        subject: e.subject?.name ?? "Disciplina removida",
        topic: e.topic ? `${e.topic.code ? `${e.topic.code} ` : ""}${e.topic.title}` : "",
        seconds: e.totalSeconds ?? 0,
        duration: formatDuration(e.totalSeconds ?? 0),
        notes: e.notes ?? "",
        entry: e,
      })),
    [entries]
  );

  return (
    <>
      <details className="card complete-box">
        <summary>Adicionar horas estudadas anteriormente</summary>
        {subjects.length === 0 ? (
          <p className="muted">Cadastre disciplinas primeiro.</p>
        ) : (
          <ManualSessionForm subjects={subjects} today={today} />
        )}
      </details>

      {entries.length > 0 && (
        <div className="card">
          <h2>Horas adicionadas manualmente</h2>

          {editing && (
            <div className="edit-box">
              <strong>Editar registro</strong>
              <ManualSessionForm
                key={editing.id}
                subjects={subjects}
                today={today}
                entry={editing}
                onDone={() => setEditingId(null)}
              />
              <button type="button" className="btn-small" onClick={() => setEditingId(null)}>
                Cancelar
              </button>
            </div>
          )}

          <AppDataTable
            value={rows}
            sortField="ts"
            globalFields={["dateLabel", "subject", "topic", "duration", "notes"]}
          >
            <Column field="dateLabel" header="Data" sortable sortField="ts" />
            <Column field="subject" header="Disciplina" sortable />
            <Column field="topic" header="Conteúdo" sortable />
            <Column field="duration" header="Tempo" sortable sortField="seconds" />
            <Column field="notes" header="Observações" />
            <Column
              header="Ações"
              style={{ width: "6.5rem" }}
              body={(r: Row) => (
                <div className="row-actions">
                  <button
                    type="button"
                    className="btn-icon neutral"
                    title="Editar"
                    onClick={() => setEditingId(r.id)}
                  >
                    <Pencil size={16} />
                  </button>
                  <DeleteButton
                    action={deleteManualSessionAction}
                    fields={{ id: r.id }}
                    message="Excluir estas horas?"
                  />
                </div>
              )}
            />
          </AppDataTable>
        </div>
      )}
    </>
  );
}
