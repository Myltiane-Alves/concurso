"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { DeleteButton } from "@/components/DeleteButton";
import { NavLink } from "@/components/NavLink";
import { ProgressBar } from "@/components/ProgressBar";
import { queries } from "@/lib/queries";
import { deleteSubjectAction } from "@/features/subjects/actions";
import { SubjectForm } from "@/features/subjects/components/SubjectForm";

export function SubjectsScreen() {
  const query = useQuery(queries.subjects());

  return (
    <>
      <div className="page-header">
        <h1>Disciplinas</h1>
      </div>

      <Async query={query}>
        {({ exams, subjects }) => (
          <>
            <div className="card">
              <h2>Nova disciplina</h2>
              {exams.length === 0 ? (
                <p className="muted">
                  Cadastre um concurso primeiro em <NavLink to="/concursos">Concursos</NavLink>.
                </p>
              ) : (
                <SubjectForm exams={exams} />
              )}
            </div>

            {subjects.length === 0 ? (
              <p className="muted">Nenhuma disciplina cadastrada ainda.</p>
            ) : (
              <ul className="list">
                {subjects.map((s) => (
                  <li key={s.id} className="list-item">
                    <NavLink to={`/disciplinas/${s.id}`} className="list-main">
                      <strong>{s.name}</strong>
                      <span className="muted small">
                        {s.exam.name} · Prioridade {s.priority}
                      </span>
                      <ProgressBar done={s.progress.done} total={s.progress.total} />
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
