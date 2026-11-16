"use client";

import { ActionForm } from "@/components/ActionForm";
import { linkSelectedAction } from "../actions";
import type { Group } from "../utils/compare";

type Props = { groups: Group[]; exams: { id: string; name: string }[] };

/** Lista as disciplinas exclusivas e permite vincular manualmente as que são equivalentes. */
export function UniqueLinker({ groups, exams }: Props) {
  const members = groups.flatMap((g) => g.members);

  return (
    <ActionForm action={linkSelectedAction} submitLabel="Vincular selecionadas como a mesma disciplina">
      <div className="compare-cols" style={{ "--cols": exams.length } as React.CSSProperties}>
        {exams.map((exam) => (
          <div key={exam.id} className="compare-cell">
            <span className="compare-exam">{exam.name}</span>
            {members
              .filter((m) => m.examId === exam.id)
              .map((m) => (
                <label key={m.subjectId} className="check-label">
                  <input type="checkbox" name="ids" value={m.subjectId} />
                  {m.name}
                </label>
              ))}
            {members.filter((m) => m.examId === exam.id).length === 0 && (
              <span className="muted small">Nenhuma</span>
            )}
          </div>
        ))}
      </div>
      <p className="muted small">
        Marque uma disciplina de cada concurso que, na prática, tenham o mesmo conteúdo (ex.: &quot;Legislação
        Aduaneira&quot; e &quot;Direito Aduaneiro&quot;).
      </p>
    </ActionForm>
  );
}
