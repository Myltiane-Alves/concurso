"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { navigate } from "@/lib/hash-router";
import { queries } from "@/lib/queries";
import { RecordItem } from "@/features/questions/components/RecordItem";

export function QuestionHistoryScreen({ disciplina, pagina }: { disciplina?: string; pagina?: string }) {
  const query = useQuery(queries.questionHistory(disciplina, pagina));

  return (
    <>
      <p className="muted small">
        <NavLink to="/questoes">← Questões</NavLink>
      </p>

      <Async query={query}>
        {({ items, total, page, pageSize, subjects, disciplina: selected }) => {
          const totalPages = Math.max(1, Math.ceil(total / pageSize));
          const link = (p: number) => {
            const qs = new URLSearchParams();
            if (selected) qs.set("disciplina", selected);
            qs.set("pagina", String(p));
            return `/questoes/historico?${qs.toString()}`;
          };

          return (
            <>
              <div className="page-header">
                <h1>Histórico de questões</h1>
                <span className="muted">{total} registro(s)</span>
              </div>

              <form
                className="filter-bar"
                onSubmit={(e) => {
                  e.preventDefault();
                  const value = new FormData(e.currentTarget).get("disciplina");
                  navigate(value ? `/questoes/historico?disciplina=${value}` : "/questoes/historico");
                }}
              >
                <select name="disciplina" defaultValue={selected}>
                  <option value="">Todas as disciplinas</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.exam.name})
                    </option>
                  ))}
                </select>
                <button type="submit" className="btn-small">
                  Filtrar
                </button>
              </form>

              <div className="card">
                {items.length === 0 ? (
                  <p className="muted">Nenhum registro encontrado.</p>
                ) : (
                  items.map((r) => <RecordItem key={r.id} record={r} />)
                )}
              </div>

              {totalPages > 1 && (
                <div className="week-nav">
                  {page > 1 ? <NavLink to={link(page - 1)}>← Anterior</NavLink> : <span />}
                  <span className="muted">
                    Página {page} de {totalPages}
                  </span>
                  {page < totalPages ? <NavLink to={link(page + 1)}>Próxima →</NavLink> : <span />}
                </div>
              )}
            </>
          );
        }}
      </Async>
    </>
  );
}
