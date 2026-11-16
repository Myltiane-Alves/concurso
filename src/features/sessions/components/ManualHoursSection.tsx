"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
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
          {entries.map((e) =>
            editingId === e.id ? (
              <div key={e.id} className="edit-box">
                <ManualSessionForm
                  subjects={subjects}
                  today={today}
                  entry={e}
                  onDone={() => setEditingId(null)}
                />
                <button type="button" className="btn-small" onClick={() => setEditingId(null)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <div key={e.id} className="history-item">
                <div className="history-main">
                  <strong>{e.subject?.name ?? "Disciplina removida"}</strong>
                  <span className="muted small">
                    {e.endedAt ? formatDate(isoToDate(toLocalISO(e.endedAt))) : ""}
                    {e.topic ? ` · ${e.topic.code ? `${e.topic.code} ` : ""}${e.topic.title}` : ""}
                  </span>
                  {e.notes && <span className="muted small">{e.notes}</span>}
                </div>
                <span className="history-time">{formatDuration(e.totalSeconds ?? 0)}</span>
                <button
                  type="button"
                  className="btn-icon neutral"
                  title="Editar"
                  onClick={() => setEditingId(e.id)}
                >
                  <Pencil size={16} />
                </button>
                <DeleteButton
                  action={deleteManualSessionAction}
                  fields={{ id: e.id }}
                  message="Excluir estas horas?"
                />
              </div>
            )
          )}
        </div>
      )}
    </>
  );
}
