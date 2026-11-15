"use client";

import { useState } from "react";
import { ActionForm } from "@/components/ActionForm";
import { startSessionAction } from "../actions";

type SubjectOption = {
  id: string;
  name: string;
  exam: { name: string };
  topics: { id: string; code: string | null; title: string }[];
};

export function StartSessionForm({ subjects }: { subjects: SubjectOption[] }) {
  const [subjectId, setSubjectId] = useState("");
  const topics = subjects.find((s) => s.id === subjectId)?.topics ?? [];

  return (
    <ActionForm action={startSessionAction} submitLabel="Iniciar sessão">
      <div className="form-grid">
        <label>
          Disciplina *
          <select
            name="subjectId"
            required
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
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
            <option value="">— Estudo geral da disciplina —</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code ? `${t.code} ` : ""}
                {t.title}
              </option>
            ))}
          </select>
        </label>
      </div>
    </ActionForm>
  );
}
