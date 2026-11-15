"use client";

import { useState } from "react";
import { ActionForm } from "@/components/ActionForm";
import { createErrorNoteAction } from "../actions";
import { ERROR_CATEGORIES } from "../utils/labels";

type SubjectOption = {
  id: string;
  name: string;
  exam: { name: string };
  topics: { id: string; code: string | null; title: string }[];
};

export function ErrorForm({ subjects }: { subjects: SubjectOption[] }) {
  const [subjectId, setSubjectId] = useState("");
  const topics = subjects.find((s) => s.id === subjectId)?.topics ?? [];

  return (
    <ActionForm action={createErrorNoteAction} submitLabel="Registrar erro">
      <div className="form-grid">
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
          Conteúdo
          <select name="topicId" defaultValue="" key={subjectId} disabled={!subjectId}>
            <option value="">— Não informar —</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code ? `${t.code} ` : ""}
                {t.title}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoria do erro *
          <select name="category" required defaultValue="">
            <option value="" disabled>
              Selecione...
            </option>
            {ERROR_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Enunciado ou referência da questão *
        <textarea name="statement" rows={3} required placeholder="Cole o enunciado ou indique a fonte e o número da questão" />
      </label>

      <div className="form-grid">
        <label>
          Resposta que você marcou
          <input name="wrongAnswer" />
        </label>
        <label>
          Resposta correta
          <input name="correctAnswer" />
        </label>
      </div>

      <label>
        Explicação
        <textarea name="explanation" rows={3} placeholder="Por que a resposta correta é essa?" />
      </label>

      <label className="check-label">
        <input type="checkbox" name="scheduleReview" disabled={!subjectId} />
        Agendar uma revisão do conteúdo para amanhã (precisa escolher o conteúdo)
      </label>
    </ActionForm>
  );
}
