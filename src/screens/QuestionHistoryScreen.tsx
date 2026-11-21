"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { queries } from "@/lib/queries";
import { RecordsTable } from "@/features/questions/components/RecordsTable";

export function QuestionHistoryScreen() {
  const query = useQuery(queries.questionHistory());
  const [subjectId, setSubjectId] = useState("");

  return (
    <>
      <p className="muted small">
        <NavLink to="/questoes">← Questões</NavLink>
      </p>

      <div className="page-header">
        <h1>Histórico de questões</h1>
      </div>

      <Async query={query}>
        {({ items, subjects }) => {
          const filtered = subjectId ? items.filter((r) => r.subjectId === subjectId) : items;

          return (
            <>
              <div className="filter-bar">
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                  <option value="">Todas as disciplinas</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.exam.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="card">
                <RecordsTable records={filtered} />
              </div>
            </>
          );
        }}
      </Async>
    </>
  );
}
