"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { queries } from "@/lib/queries";
import { ErrorForm } from "@/features/errors/components/ErrorForm";
import { ErrorItem } from "@/features/errors/components/ErrorItem";
import { ERROR_CATEGORIES } from "@/features/errors/utils/labels";

function top<T>(items: T[], keyOf: (item: T) => string | null, labelOf: (item: T) => string, n = 5) {
  const counts = new Map<string, { label: string; count: number }>();
  for (const item of items) {
    const key = keyOf(item);
    if (!key) continue;
    const entry = counts.get(key) ?? { label: labelOf(item), count: 0 };
    entry.count++;
    counts.set(key, entry);
  }
  return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, n);
}

export function ErrorsScreen() {
  const query = useQuery(queries.errors());
  const [subjectFilter, setSubjectFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  return (
    <>
      <div className="page-header">
        <h1>Caderno de erros</h1>
      </div>

      <Async query={query}>
        {({ items, subjects }) => {
          const filtered = items.filter(
            (n) =>
              (!subjectFilter || n.subjectId === subjectFilter) &&
              (!categoryFilter || n.category === categoryFilter)
          );

          const byCategory = ERROR_CATEGORIES.map((c) => ({
            ...c,
            count: items.filter((n) => n.category === c.value).length,
          }));
          const maxCategory = Math.max(1, ...byCategory.map((c) => c.count));

          const topTopics = top(
            items,
            (n) => n.topicId,
            (n) => `${n.topic?.code ? `${n.topic.code} ` : ""}${n.topic?.title ?? ""}`
          );
          const topSubjects = top(
            items,
            (n) => n.subjectId,
            (n) => n.subject?.name ?? "Disciplina removida",
            3
          );

          return (
            <>
              <div className="card">
                <h2>Registrar erro</h2>
                {subjects.length === 0 ? (
                  <p className="muted">
                    Cadastre disciplinas primeiro em <NavLink to="/disciplinas">Disciplinas</NavLink>.
                  </p>
                ) : (
                  <ErrorForm subjects={subjects} />
                )}
              </div>

              {items.length > 0 && (
                <div className="card">
                  <h2>Onde você mais erra</h2>

                  {byCategory.map((c) => (
                    <div key={c.value} className="bar-row">
                      <div className="bar-label">
                        <span>{c.label}</span>
                        <span className="muted small">{c.count}</span>
                      </div>
                      <div className="progress">
                        <div className="progress-fill bad" style={{ width: `${(c.count / maxCategory) * 100}%` }} />
                      </div>
                    </div>
                  ))}

                  {topTopics.length > 0 && (
                    <>
                      <h3 className="sub-title">Conteúdos com mais erros</h3>
                      <ol className="rank">
                        {topTopics.map((t) => (
                          <li key={t.label}>
                            {t.label} <span className="muted small">({t.count})</span>
                          </li>
                        ))}
                      </ol>
                    </>
                  )}

                  {topSubjects.length > 0 && (
                    <>
                      <h3 className="sub-title">Disciplinas com mais erros</h3>
                      <ol className="rank">
                        {topSubjects.map((s) => (
                          <li key={s.label}>
                            {s.label} <span className="muted small">({s.count})</span>
                          </li>
                        ))}
                      </ol>
                    </>
                  )}
                </div>
              )}

              <div className="filter-bar">
                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                  <option value="">Todas as disciplinas</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.exam.name})
                    </option>
                  ))}
                </select>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="">Todas as categorias</option>
                  {ERROR_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card">
                <h2>
                  Erros registrados ({filtered.length}
                  {filtered.length !== items.length ? ` de ${items.length}` : ""})
                </h2>
                {filtered.length === 0 ? (
                  <p className="muted">
                    {items.length === 0 ? "Nenhum erro registrado ainda." : "Nenhum erro com esses filtros."}
                  </p>
                ) : (
                  filtered.map((n) => <ErrorItem key={n.id} note={n} />)
                )}
              </div>
            </>
          );
        }}
      </Async>
    </>
  );
}
