"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { queries } from "@/lib/queries";
import { AccuracyBySubject } from "@/features/questions/components/AccuracyBySubject";
import { QuestionForm } from "@/features/questions/components/QuestionForm";
import { RecordItem } from "@/features/questions/components/RecordItem";

const PERIODS = [7, 30, 90];

export function QuestionsScreen({ periodo }: { periodo?: string }) {
  const query = useQuery(queries.questions(periodo));

  return (
    <>
      <div className="page-header">
        <h1>Questões</h1>
        <NavLink to="/questoes/historico">Ver histórico completo</NavLink>
      </div>

      <Async query={query}>
        {({ days, today, stats, subjects, recent }) => (
          <>
            <div className="plan-chips">
              {PERIODS.map((p) => (
                <NavLink
                  key={p}
                  to={`/questoes?periodo=${p}`}
                  className={`chip ${p === days ? "active" : ""}`}
                >
                  Últimos {p} dias
                </NavLink>
              ))}
              <NavLink to="/questoes?periodo=todos" className={`chip ${days === null ? "active" : ""}`}>
                Tudo
              </NavLink>
            </div>

            <div className="stats">
              <div className="card stat">
                <span className="muted">Questões</span>
                <strong>{stats.total}</strong>
              </div>
              <div className="card stat">
                <span className="muted">Acertos</span>
                <strong>{stats.correct}</strong>
              </div>
              <div className="card stat">
                <span className="muted">Erros</span>
                <strong>{stats.wrong}</strong>
              </div>
              <div className="card stat">
                <span className="muted">Percentual de acertos</span>
                <strong>{stats.percent}%</strong>
              </div>
            </div>

            <div className="card">
              <h2>Registrar questões</h2>
              {subjects.length === 0 ? (
                <p className="muted">
                  Cadastre disciplinas primeiro em <NavLink to="/disciplinas">Disciplinas</NavLink>.
                </p>
              ) : (
                <QuestionForm subjects={subjects} today={today} />
              )}
            </div>

            <div className="card">
              <h2>Acertos por disciplina</h2>
              {stats.bySubject.length === 0 ? (
                <p className="muted">Nenhuma questão registrada neste período.</p>
              ) : (
                <>
                  <p className="muted small">Ordenado do menor para o maior percentual de acertos.</p>
                  <AccuracyBySubject items={stats.bySubject} />
                </>
              )}
            </div>

            <div className="card">
              <h2>Últimos registros</h2>
              {recent.length === 0 ? (
                <p className="muted">Nenhum registro ainda.</p>
              ) : (
                recent.map((r) => <RecordItem key={r.id} record={r} />)
              )}
            </div>
          </>
        )}
      </Async>
    </>
  );
}
