"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { queries } from "@/lib/queries";
import { GoalForm } from "@/features/goals/components/GoalForm";
import { GoalItem } from "@/features/goals/components/GoalItem";
import { PERIOD_LABEL } from "@/features/goals/utils/labels";
import type { GoalPeriod } from "@/features/goals/utils/progress";

const PERIODS: GoalPeriod[] = ["DAILY", "WEEKLY", "MONTHLY"];

export function GoalsScreen() {
  const query = useQuery(queries.goals());

  return (
    <>
      <div className="page-header">
        <h1>Metas</h1>
      </div>

      <Async query={query}>
        {({ goals, subjects }) => {
          const active = goals.filter((g) => g.active);
          const paused = goals.filter((g) => !g.active);
          const reached = active.filter((g) => g.done).length;

          return (
            <>
              {active.length > 0 && (
                <div className="stats">
                  <div className="card stat">
                    <span className="muted">Metas ativas</span>
                    <strong>{active.length}</strong>
                  </div>
                  <div className="card stat">
                    <span className="muted">Batidas no período</span>
                    <strong>
                      {reached}/{active.length}
                    </strong>
                  </div>
                </div>
              )}

              <div className="card">
                <h2>Nova meta</h2>
                <p className="muted small">
                  O progresso é calculado automaticamente: o tempo vem das suas sessões de estudo (inclusive as
                  horas adicionadas manualmente) e as questões, dos registros em{" "}
                  <NavLink to="/questoes">Questões</NavLink>. A semana vai de segunda a domingo.
                </p>
                <GoalForm subjects={subjects} />
              </div>

              {goals.length === 0 && <p className="muted">Nenhuma meta criada ainda.</p>}

              {PERIODS.map((period) => {
                const list = active.filter((g) => g.period === period);
                if (list.length === 0) return null;
                return (
                  <div key={period} className="card">
                    <h2>Metas {PERIOD_LABEL[period].toLowerCase()}s</h2>
                    {list.map((g) => (
                      <GoalItem key={g.id} goal={g} subjects={subjects} />
                    ))}
                  </div>
                );
              })}

              {paused.length > 0 && (
                <div className="card">
                  <h2>Pausadas</h2>
                  {paused.map((g) => (
                    <GoalItem key={g.id} goal={g} subjects={subjects} />
                  ))}
                </div>
              )}
            </>
          );
        }}
      </Async>
    </>
  );
}
