"use client";

import { useState } from "react";
import { ActionForm } from "@/components/ActionForm";
import { toLocalISO } from "@/lib/dates";
import { saveManualSessionAction } from "../actions";

type SubjectOption = {
  id: string;
  name: string;
  exam: { name: string };
  topics: { id: string; code: string | null; title: string }[];
};

export type ManualEntry = {
  id: string;
  subjectId: string | null;
  topicId: string | null;
  endedAt: Date | null;
  totalSeconds: number | null;
  notes: string | null;
};

type Props = {
  subjects: SubjectOption[];
  today: string;
  entry?: ManualEntry;
  onDone?: () => void;
};

export function ManualSessionForm({ subjects, today, entry, onDone }: Props) {
  const [subjectId, setSubjectId] = useState(entry?.subjectId ?? "");
  const topics = subjects.find((s) => s.id === subjectId)?.topics ?? [];

  const total = entry?.totalSeconds ?? 0;
  const defaultDate = entry?.endedAt ? toLocalISO(entry.endedAt) : today;

  return (
    <ActionForm
      action={saveManualSessionAction}
      submitLabel={entry ? "Salvar alterações" : "Adicionar horas"}
      onSuccess={onDone}
    >
      {entry && <input type="hidden" name="id" value={entry.id} />}

      <div className="form-grid">
        <label>
          Data do estudo *
          <input name="date" type="date" defaultValue={defaultDate} max={today} required />
        </label>

        <label>
          Disciplina *
          <select name="subjectId" required value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="" disabled>
              Selecione...
            </option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.exam.name})
              </option>
            ))}
          </select>
        </label>

        <label>
          Conteúdo (opcional)
          <select
            name="topicId"
            key={subjectId}
            defaultValue={subjectId === entry?.subjectId ? (entry?.topicId ?? "") : ""}
            disabled={!subjectId}
          >
            <option value="">— Estudo geral da disciplina —</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code ? `${t.code} ` : ""}
                {t.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Horas
          <input name="hours" type="number" min={0} max={24} defaultValue={Math.floor(total / 3600)} required />
        </label>

        <label>
          Minutos
          <input
            name="minutes"
            type="number"
            min={0}
            max={59}
            defaultValue={Math.floor((total % 3600) / 60)}
            required
          />
        </label>
      </div>

      <label>
        Observações
        <textarea name="notes" rows={2} defaultValue={entry?.notes ?? ""} />
      </label>
    </ActionForm>
  );
}
