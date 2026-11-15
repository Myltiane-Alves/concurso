"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { dateToISO } from "@/lib/dates";
import { queries } from "@/lib/queries";
import { CompletedReviewItem } from "@/features/reviews/components/CompletedReviewItem";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";
import { ReviewItem, type DueKind } from "@/features/reviews/components/ReviewItem";

export function ReviewsScreen() {
  const query = useQuery(queries.reviews());
  const [tab, setTab] = useState<"pending" | "done">("pending");

  return (
    <>
      <div className="page-header">
        <h1>Revisões</h1>
      </div>

      <Async query={query}>
        {({ today, pending, completed, subjects }) => {
          const kindOf = (due: Date): DueKind => {
            const iso = dateToISO(due);
            return iso < today ? "overdue" : iso === today ? "today" : "upcoming";
          };

          const groups: { kind: DueKind; title: string }[] = [
            { kind: "overdue", title: "Atrasadas" },
            { kind: "today", title: "Para hoje" },
            { kind: "upcoming", title: "Próximas" },
          ];
          const count = (kind: DueKind) => pending.filter((r) => kindOf(r.dueDate) === kind).length;

          return (
            <>
              <div className="stats">
                <div className="card stat">
                  <span className="muted">Atrasadas</span>
                  <strong>{count("overdue")}</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Para hoje</span>
                  <strong>{count("today")}</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Próximas</span>
                  <strong>{count("upcoming")}</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Concluídas (recentes)</span>
                  <strong>{completed.length}</strong>
                </div>
              </div>

              <div className="card">
                <h2>Agendar revisão</h2>
                <p className="muted small">
                  Ao finalizar uma sessão de estudo com um conteúdo, a primeira revisão é criada
                  automaticamente para o dia seguinte.
                </p>
                <ReviewForm subjects={subjects} today={today} />
              </div>

              <div className="tabs">
                <button
                  type="button"
                  className={`tab ${tab === "pending" ? "active" : ""}`}
                  onClick={() => setTab("pending")}
                >
                  Pendentes ({pending.length})
                </button>
                <button
                  type="button"
                  className={`tab ${tab === "done" ? "active" : ""}`}
                  onClick={() => setTab("done")}
                >
                  Concluídas
                </button>
              </div>

              {tab === "pending" ? (
                pending.length === 0 ? (
                  <div className="card">
                    <p className="muted">Nenhuma revisão pendente.</p>
                  </div>
                ) : (
                  groups.map(({ kind, title }) => {
                    const list = pending.filter((r) => kindOf(r.dueDate) === kind);
                    if (list.length === 0) return null;
                    return (
                      <div key={kind} className="card">
                        <h2>
                          {title} ({list.length})
                        </h2>
                        {list.map((r) => (
                          <ReviewItem key={r.id} kind={kind} review={r} />
                        ))}
                      </div>
                    );
                  })
                )
              ) : (
                <div className="card">
                  <h2>Histórico de revisões</h2>
                  {completed.length === 0 ? (
                    <p className="muted">Nenhuma revisão concluída ainda.</p>
                  ) : (
                    completed.map((r) => <CompletedReviewItem key={r.id} review={r} />)
                  )}
                </div>
              )}
            </>
          );
        }}
      </Async>
    </>
  );
}
