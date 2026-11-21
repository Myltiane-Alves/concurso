"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { ProgressBar } from "@/components/ProgressBar";
import { dateTimeLabel, dayMonthLabel } from "@/lib/dates";
import { formatDuration } from "@/lib/format";
import { queries } from "@/lib/queries";
import { PerformanceTabs } from "@/features/performance/components/PerformanceTabs";
import { DifficultiesTable } from "@/features/performance/components/DifficultiesTable";
import { DailyHoursChart } from "@/features/performance/components/DailyHoursChart";
import { AccuracyBySubject } from "@/features/questions/components/AccuracyBySubject";

const PERIODS = [7, 30, 90];

export function PerformanceScreen({ periodo }: { periodo?: string }) {
  const query = useQuery(queries.performance(periodo));

  return (
    <>
      <div className="page-header">
        <h1>Desempenho</h1>
      </div>
      <PerformanceTabs active="period" />

      <Async query={query}>
        {({ days, perf, subjects, difficulties, questions }) => {
          const chartData = perf.days.map((d) => ({
            label: dayMonthLabel(d.date),
            minutes: Math.round(d.seconds / 60),
          }));
          const maxSubjectSeconds = Math.max(1, ...perf.bySubject.map((s) => s.seconds));

          return (
            <>
              <div className="plan-chips">
                {PERIODS.map((p) => (
                  <NavLink
                    key={p}
                    to={`/desempenho?periodo=${p}`}
                    className={`chip ${p === days ? "active" : ""}`}
                  >
                    Últimos {p} dias
                  </NavLink>
                ))}
              </div>

              <div className="stats">
                <div className="card stat">
                  <span className="muted">Tempo estudado</span>
                  <strong>{formatDuration(perf.totalSeconds)}</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Média por dia estudado</span>
                  <strong>{formatDuration(perf.avgSecondsPerStudiedDay)}</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Dias estudados</span>
                  <strong>
                    {perf.studiedDays}/{perf.periodDays}
                  </strong>
                </div>
                <div className="card stat">
                  <span className="muted">Sequência atual</span>
                  <strong>{perf.streak} dia(s)</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Sessões</span>
                  <strong>{perf.sessionsCount}</strong>
                </div>
              </div>

              <div className="card">
                <div className="page-header">
                  <h2>Tempo estudado por dia</h2>
                  <NavLink to="/desempenho/diario">Ver dia a dia</NavLink>
                </div>
                {perf.totalSeconds === 0 ? (
                  <p className="muted">
                    Nenhuma sessão finalizada neste período. <NavLink to="/estudar">Começar a estudar</NavLink>
                  </p>
                ) : (
                  <DailyHoursChart data={chartData} />
                )}
              </div>

              <div className="card">
                <h2>Tempo por disciplina</h2>
                {perf.bySubject.length === 0 ? (
                  <p className="muted">Sem dados no período.</p>
                ) : (
                  perf.bySubject.map((s) => (
                    <div key={s.id} className="bar-row">
                      <div className="bar-label">
                        <span>{s.name}</span>
                        <span className="muted small">
                          {formatDuration(s.seconds)} · {Math.round((s.seconds / perf.totalSeconds) * 100)}%
                        </span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-fill"
                          style={{ width: `${(s.seconds / maxSubjectSeconds) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="card">
                <h2>Progresso dos conteúdos</h2>
                {subjects.length === 0 ? (
                  <p className="muted">Nenhuma disciplina cadastrada.</p>
                ) : (
                  subjects.map((s) => (
                    <div key={s.id} className="bar-row">
                      <div className="bar-label">
                        <NavLink to={`/disciplinas/${s.id}`}>{s.name}</NavLink>
                        <span className="muted small">{s.exam.name}</span>
                      </div>
                      <ProgressBar done={s.progress.done} total={s.progress.total} />
                    </div>
                  ))
                )}
              </div>

              <div className="card">
                <h2>Dificuldades registradas</h2>
                <DifficultiesTable items={difficulties} />
              </div>

              <div className="card">
                <h2>Questões e acertos</h2>
                {questions.total === 0 ? (
                  <p className="muted">
                    Nenhuma questão registrada neste período.{" "}
                    <NavLink to="/questoes">Registrar questões</NavLink>
                  </p>
                ) : (
                  <>
                    <p>
                      <strong>{questions.percent}%</strong> de acertos · {questions.correct} acertos em{" "}
                      {questions.total} questões
                    </p>
                    <p className="muted small">Ordenado do menor para o maior percentual de acertos.</p>
                    <AccuracyBySubject items={questions.bySubject} />
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
