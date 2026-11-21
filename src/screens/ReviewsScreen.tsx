"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { dateToISO } from "@/lib/dates";
import { queries } from "@/lib/queries";
import { CompletedReviewsTable } from "@/features/reviews/components/CompletedReviewsTable";
import { PendingReviewsTable } from "@/features/reviews/components/PendingReviewsTable";
import { ReviewForm } from "@/features/reviews/components/ReviewForm";

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
          const count = (test: (iso: string) => boolean) =>
            pending.filter((r) => test(dateToISO(r.dueDate))).length;

          return (
            <>
              <div className="stats">
                <div className="card stat">
                  <span className="muted">Atrasadas</span>
                  <strong>{count((d) => d < today)}</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Para hoje</span>
                  <strong>{count((d) => d === today)}</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Próximas</span>
                  <strong>{count((d) => d > today)}</strong>
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

              <div className="card">
                {tab === "pending" ? (
                  <>
                    <h2>Revisões pendentes</h2>
                    <p className="muted small">Clique na seta da coluna &quot;Concluir&quot; para registrar uma revisão.</p>
                    <PendingReviewsTable reviews={pending} today={today} />
                  </>
                ) : (
                  <>
                    <h2>Histórico de revisões</h2>
                    <CompletedReviewsTable reviews={completed} />
                  </>
                )}
              </div>
            </>
          );
        }}
      </Async>
    </>
  );
}
