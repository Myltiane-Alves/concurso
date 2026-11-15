"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { MutateForm } from "@/components/MutateForm";
import { NavLink } from "@/components/NavLink";
import { PlanningTabs } from "@/components/PlanningTabs";
import { ProgressBar } from "@/components/ProgressBar";
import { dayMonthLabel } from "@/lib/dates";
import { formatMinutes } from "@/lib/format";
import { queries } from "@/lib/queries";
import { rescheduleOverdueAction } from "@/features/agenda/actions";
import { ActivityItem } from "@/features/agenda/components/ActivityItem";

export function PlanningScreen() {
  const query = useQuery(queries.planning());

  return (
    <>
      <div className="page-header">
        <h1>Planejamento</h1>
      </div>
      <PlanningTabs active="overview" />

      <Async query={query}>
        {({ today, plan, activities, overdue }) => {
          const items = plan?.items ?? [];
          const doneCount = items.filter((i) => i.doneInRound).length;
          const next = items.find((i) => !i.doneInRound);

          return (
            <>
              <div className="card">
                <h2>Ciclo ativo</h2>
                {!plan ? (
                  <p className="muted">
                    Você ainda não tem um ciclo.{" "}
                    <NavLink to="/planejamento/ciclo">Criar ciclo de estudos</NavLink>
                  </p>
                ) : items.length === 0 ? (
                  <p className="muted">
                    O ciclo <strong>{plan.name}</strong> não tem disciplinas.{" "}
                    <NavLink to="/planejamento/ciclo">Adicionar disciplinas</NavLink>
                  </p>
                ) : (
                  <>
                    <p>
                      <strong>{plan.name}</strong> · Rodada {plan.rounds + 1}
                    </p>
                    <ProgressBar done={doneCount} total={items.length} />
                    {next && (
                      <p className="next-block">
                        Próximo bloco: <strong>{next.subject.name}</strong> · {formatMinutes(next.minutes)}
                      </p>
                    )}
                    <NavLink to="/planejamento/ciclo">Ver ciclo completo</NavLink>
                  </>
                )}
              </div>

              <div className="card">
                <div className="page-header">
                  <h2>Hoje ({dayMonthLabel(today)})</h2>
                  <NavLink to="/planejamento/agenda">Abrir agenda</NavLink>
                </div>

                {overdue > 0 && (
                  <MutateForm action={rescheduleOverdueAction} className="notice">
                    <span>Você tem {overdue} atividade(s) atrasada(s).</span>
                    <button type="submit" className="btn-small">
                      Mover para hoje
                    </button>
                  </MutateForm>
                )}

                {activities.length === 0 ? (
                  <p className="muted">Nenhuma atividade para hoje.</p>
                ) : (
                  <div className="activity-list">
                    {activities.map((a) => (
                      <ActivityItem key={a.id} activity={a} />
                    ))}
                  </div>
                )}
              </div>
            </>
          );
        }}
      </Async>
    </>
  );
}
