"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { formatDate } from "@/lib/format";
import { queries } from "@/lib/queries";
import { ExamSubjectsTable } from "@/features/subjects/components/ExamSubjectsTable";
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
              <NavLink to={`/comparar?ids=${exam.id}`}>Comparar com outros concursos</NavLink>
            </div>

            <div className="card">
              <h2>Nova disciplina</h2>
              <SubjectForm exams={[{ id: exam.id, name: exam.name }]} fixedExamId={exam.id} />
            </div>

            <div className="card">
              <h2>Disciplinas</h2>
              <ExamSubjectsTable subjects={exam.subjects} />
            </div>
          </>
        )}
      </Async>
    </>
  );
}
