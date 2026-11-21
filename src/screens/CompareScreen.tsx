"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { navigate } from "@/lib/hash-router";
import { queries } from "@/lib/queries";
import { GroupsTable } from "@/features/compare/components/GroupsTable";
import { UniqueLinker } from "@/features/compare/components/UniqueLinker";

const MAX_EXAMS = 4;

export function CompareScreen({ ids }: { ids?: string }) {
  const query = useQuery(queries.compare(ids));
  const [selected, setSelected] = useState<string[] | null>(null);

  return (
    <>
      <div className="page-header">
        <h1>Comparar concursos</h1>
      </div>

      <Async query={query}>
        {({ exams, selectedIds, comparison }) => {
          const current = selected ?? selectedIds;
          const toggle = (id: string) => {
            const base = selected ?? selectedIds;
            setSelected(
              base.includes(id) ? base.filter((x) => x !== id) : base.length < MAX_EXAMS ? [...base, id] : base
            );
          };

          const compatible = comparison?.groups.filter((g) => g.kind === "confirmed" || g.kind === "exact") ?? [];
          const similar = comparison?.groups.filter((g) => g.kind === "similar") ?? [];
          const unique = comparison?.groups.filter((g) => g.kind === "unique") ?? [];
          const compared = comparison
            ? selectedIds.map((id) => exams.find((e) => e.id === id)!).filter(Boolean)
            : [];

          return (
            <>
              <div className="card">
                <h2>Escolha os concursos</h2>
                {exams.length < 2 ? (
                  <p className="muted">
                    Cadastre ao menos dois concursos, com as suas disciplinas, em{" "}
                    <NavLink to="/concursos">Concursos</NavLink>.
                  </p>
                ) : (
                  <>
                    <p className="muted small">Selecione de 2 a {MAX_EXAMS} concursos para comparar as disciplinas.</p>
                    <div className="exam-picker">
                      {exams.map((e) => (
                        <label key={e.id} className="check-label">
                          <input
                            type="checkbox"
                            checked={current.includes(e.id)}
                            onChange={() => toggle(e.id)}
                          />
                          {e.name} <span className="muted small">({e.subjects} disciplinas)</span>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={current.length < 2}
                      onClick={() => navigate(`/comparar?ids=${current.join(",")}`)}
                    >
                      Comparar
                    </button>
                  </>
                )}
              </div>

              {comparison && (
                <>
                  <div className="stats">
                    <div className="card stat">
                      <span className="muted">Disciplinas somadas</span>
                      <strong>{comparison.summary.total}</strong>
                    </div>
                    <div className="card stat">
                      <span className="muted">Disciplinas distintas</span>
                      <strong>{comparison.summary.distinct}</strong>
                    </div>
                    <div className="card stat">
                      <span className="muted">Economia estudando juntos</span>
                      <strong>{comparison.summary.saved}</strong>
                      {comparison.summary.extraIfConfirmed > 0 && (
                        <span className="muted small">+{comparison.summary.extraIfConfirmed} se confirmar as parecidas</span>
                      )}
                    </div>
                  </div>

                  <div className="card">
                    <h2>Compatibilidade de cada concurso</h2>
                    {comparison.exams.map((e) => (
                      <div key={e.id} className="bar-row">
                        <div className="bar-label">
                          <span>{e.name}</span>
                          <span className="muted small">
                            {e.compatible} de {e.total} disciplinas em comum · {e.percent}%
                            {e.similar > 0 ? ` · ${e.similar} parecida(s)` : ""} · {e.exclusive} exclusiva(s)
                          </span>
                        </div>
                        <div className="progress">
                          <div className="progress-fill" style={{ width: `${e.percent}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <h2>Disciplinas compatíveis ({compatible.length})</h2>
                    <GroupsTable
                      groups={compatible}
                      exams={compared}
                      emptyMessage="Nenhuma disciplina em comum encontrada pelo nome."
                    />
                  </div>

                  {similar.length > 0 && (
                    <div className="card">
                      <h2>Disciplinas parecidas ({similar.length})</h2>
                      <p className="muted small">
                        Os nomes são parecidos, mas podem ser matérias diferentes. Confirme as que realmente têm o
                        mesmo conteúdo.
                      </p>
                      <GroupsTable groups={similar} exams={compared} />
                    </div>
                  )}

                  <div className="card">
                    <h2>Exclusivas de cada concurso ({unique.reduce((n, g) => n + g.members.length, 0)})</h2>
                    {unique.length === 0 ? (
                      <p className="muted">Todas as disciplinas têm correspondência.</p>
                    ) : (
                      <UniqueLinker groups={unique} exams={compared} />
                    )}
                  </div>
                </>
              )}
            </>
          );
        }}
      </Async>
    </>
  );
}
