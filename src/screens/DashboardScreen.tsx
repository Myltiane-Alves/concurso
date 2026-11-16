"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { ProgressBar } from "@/components/ProgressBar";
import { queries } from "@/lib/queries";
import { GoalProgress } from "@/features/goals/components/GoalProgress";

export function DashboardScreen() {
  const query = useQuery(queries.dashboard());

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <Async query={query}>
        {(s) => (
          <>
            <div className="stats">
              <div className="card stat">
                <span className="muted">Concursos</span>
                <strong>{s.exams}</strong>
              </div>
              <div className="card stat">
                <span className="muted">Disciplinas</span>
                <strong>{s.subjects}</strong>
              </div>
              <div className="card stat">
                <span className="muted">Conteúdos</span>
                <strong>{s.topics}</strong>
              </div>
              <div className="card stat">
                <span className="muted">Concluídos</span>
                <strong>{s.topicsDone}</strong>
              </div>
              <div className="card stat">
                <span className="muted">Revisões para hoje</span>
                <strong>{s.reviewsDue}</strong>
                <NavLink to="/revisoes" className="small">
                  Ver revisões
                </NavLink>
              </div>
            </div>

            <div className="card">
              <h2>Progresso geral dos conteúdos</h2>
              <ProgressBar done={s.topicsDone} total={s.topics} />
            </div>

            <div className="card">
              <div className="page-header">
                <h2>Metas</h2>
                <NavLink to="/metas">Gerenciar metas</NavLink>
              </div>
              {s.goals.length === 0 ? (
                <p className="muted">
                  Você ainda não definiu metas. <NavLink to="/metas">Criar uma meta</NavLink>
                </p>
              ) : (
                s.goals.map((g) => <GoalProgress key={g.id} goal={g} />)
              )}
            </div>
          </>
        )}
      </Async>
    </>
  );
}
