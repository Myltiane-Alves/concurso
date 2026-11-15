"use client";

import { useState } from "react";
import { ActionForm } from "@/components/ActionForm";
import { createReviewAction } from "../actions";

type SubjectOption = {
  id: string;
  name: string;
  exam: { name: string };
  topics: { id: string; code: string | null; title: string }[];
};

export function ReviewForm({ subjects, today }: { subjects: SubjectOption[]; today: string }) {
  const [subjectId, setSubjectId] = useState("");
  const topics = subjects.find((s) => s.id === subjectId)?.topics ?? [];

  return (
    <ActionForm action={createReviewAction} submitLabel="Agendar revisão">
      <div className="form-grid">
        <label>
          Data da revisão *
          <input name="date" type="date" defaultValue={today} min={today} required />
        </label>

        <label>
          Disciplina
          <select name="subjectId" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">— Nenhuma —</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.exam.name})
              </option>
            ))}
          </select>
        </label>

        <label>
          Conteúdo
          <select name="topicId" defaultValue="" key={subjectId} disabled={!subjectId}>
            <option value="">— Disciplina inteira —</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code ? `${t.code} ` : ""}
                {t.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Título (opcional se escolher disciplina/conteúdo)
          <input name="title" placeholder="Ex.: Rever resumo de atos administrativos" />
        </label>
      </div>

      <label>
        Observações
        <textarea name="notes" rows={2} />
      </label>
    </ActionForm>
  );
}
