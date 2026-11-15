"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { DeleteButton } from "@/components/DeleteButton";
import { NavLink } from "@/components/NavLink";
import { formatDate } from "@/lib/format";
import { queries } from "@/lib/queries";
import { deleteSubjectAction } from "@/features/subjects/actions";
import { SubjectForm } from "@/features/subjects/components/SubjectForm";

export function ExamDetailScreen({ id }: { id: string }) {
  const query = useQuery(queries.exam(id));

  return (
    <>
      <p className="muted small">
        <NavLink to="/concursos">← Concursos</NavLink>
      </p>

      <Async query={query}>
        {(exam) => (
          <>
            <div className="page-header">
              <h1>{exam.name}</h1>
            </div>

            <div className="card">
              <p className="muted">
                {[exam.organ, exam.board, exam.role].filter(Boolean).join(" · ") || "Sem detalhes"}
                {" · "}Prova: {formatDate(exam.examDate)}
              </p>
            </div>

            <div className="card">
              <h2>Nova disciplina</h2>
              <SubjectForm exams={[{ id: exam.id, name: exam.name }]} fixedExamId={exam.id} />
            </div>

            <h2>Disciplinas</h2>
            {exam.subjects.length === 0 ? (
              <p className="muted">Nenhuma disciplina cadastrada neste concurso.</p>
            ) : (
              <ul className="list">
                {exam.subjects.map((s) => (
                  <li key={s.id} className="list-item">
                    <NavLink to={`/disciplinas/${s.id}`} className="list-main">
                      <strong>{s.name}</strong>
                      <span className="muted small">
                        Prioridade {s.priority} · {s._count.topics} conteúdo(s)
                      </span>
                    </NavLink>
                    <DeleteButton
                      action={deleteSubjectAction}
                      fields={{ id: s.id }}
                      message="Excluir esta disciplina e todos os conteúdos?"
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </Async>
    </>
  );
}
