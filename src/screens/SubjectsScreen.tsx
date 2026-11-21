"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { queries } from "@/lib/queries";
import { SubjectForm } from "@/features/subjects/components/SubjectForm";
import { SubjectsTable } from "@/features/subjects/components/SubjectsTable";

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

            <div className="card">
              <h2>Disciplinas cadastradas</h2>
              <SubjectsTable subjects={subjects} />
            </div>
          </>
        )}
      </Async>
    </>
  );
}
