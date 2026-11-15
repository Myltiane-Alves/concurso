"use client";

import { useState } from "react";
import { ActionForm } from "@/components/ActionForm";
import { createQuestionRecordAction } from "../actions";

type SubjectOption = {
  id: string;
  name: string;
  exam: { name: string };
  topics: { id: string; code: string | null; title: string }[];
};

export function QuestionForm({ subjects, today }: { subjects: SubjectOption[]; today: string }) {
  const [subjectId, setSubjectId] = useState("");
  const topics = subjects.find((s) => s.id === subjectId)?.topics ?? [];

  return (
    <ActionForm action={createQuestionRecordAction} submitLabel="Registrar questões">
      <div className="form-grid">
        <label>
          Data *
          <input name="date" type="date" defaultValue={today} max={today} required />
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
          Acertos *
          <input name="correct" type="number" min={0} max={10000} defaultValue={0} required />
        </label>

        <label>
          Erros *
          <input name="wrong" type="number" min={0} max={10000} defaultValue={0} required />
        </label>

        <label>
          Banca
          <input name="board" placeholder="Ex.: Cebraspe" />
        </label>

        <label>
          Fonte
          <input name="source" placeholder="Ex.: Estratégia Concursos, caderno de questões..." />
        </label>
      </div>

      <label>
        Observações
        <textarea name="notes" rows={2} />
      </label>
    </ActionForm>
  );
}
