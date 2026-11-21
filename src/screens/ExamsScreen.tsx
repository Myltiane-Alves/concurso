"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { queries } from "@/lib/queries";
import { ExamForm } from "@/features/exams/components/ExamForm";
import { ExamsTable } from "@/features/exams/components/ExamsTable";

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
        {(exams) => (
          <div className="card">
            <h2>Concursos cadastrados</h2>
            <ExamsTable exams={exams} />
          </div>
        )}
      </Async>
    </>
  );
}
