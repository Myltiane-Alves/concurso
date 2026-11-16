"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { DeleteButton } from "@/components/DeleteButton";
import { NavLink } from "@/components/NavLink";
import { formatDate } from "@/lib/format";
import { queries } from "@/lib/queries";
import { deleteExamAction } from "@/features/exams/actions";
import { ExamForm } from "@/features/exams/components/ExamForm";

export function ExamsScreen() {
  const query = useQuery(queries.exams());

  return (
    <>
      <div className="page-header">
        <h1>Concursos</h1>
        <NavLink to="/comparar" className="btn-small">
          Comparar concursos
        </NavLink>
      </div>

      <div className="card">
        <h2>Novo concurso</h2>
        <ExamForm />
      </div>

      <Async query={query}>
        {(exams) =>
          exams.length === 0 ? (
            <p className="muted">Nenhum concurso cadastrado ainda.</p>
          ) : (
            <ul className="list">
              {exams.map((exam) => (
                <li key={exam.id} className="list-item">
                  <NavLink to={`/concursos/${exam.id}`} className="list-main">
                    <strong>{exam.name}</strong>
                    <span className="muted">
                      {[exam.organ, exam.board, exam.role].filter(Boolean).join(" · ") || "Sem detalhes"}
                    </span>
                    <span className="muted small">
                      {exam._count.subjects} disciplina(s) · Prova: {formatDate(exam.examDate)}
                    </span>
                  </NavLink>
                  <DeleteButton
                    action={deleteExamAction}
                    fields={{ id: exam.id }}
                    message="Excluir este concurso, suas disciplinas e conteúdos?"
                  />
                </li>
              ))}
            </ul>
          )
        }
      </Async>
    </>
  );
}
