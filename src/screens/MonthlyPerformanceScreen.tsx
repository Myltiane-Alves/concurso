"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { dayMonthLabel } from "@/lib/dates";
import { formatDuration } from "@/lib/format";
import { queries } from "@/lib/queries";
import { DailyHoursChart } from "@/features/performance/components/DailyHoursChart";
import { MonthNav } from "@/features/performance/components/MonthNav";
import { MonthsTable } from "@/features/performance/components/MonthsTable";
import { PerformanceTabs } from "@/features/performance/components/PerformanceTabs";
import { addMonths, monthLabel } from "@/features/performance/utils/monthly";
import { AccuracyBySubject } from "@/features/questions/components/AccuracyBySubject";

function Delta({ current, previous, unit }: { current: number; previous: number; unit: "percent" | "points" }) {
  if (previous === 0 && current === 0) return null;

  if (unit === "percent") {
    if (previous === 0) return <span className="delta up">novo neste mês</span>;
    const change = Math.round(((current - previous) / previous) * 100);
    if (change === 0) return <span className="delta flat">igual ao mês anterior</span>;
    return (
      <span className={`delta ${change > 0 ? "up" : "down"}`}>
        {change > 0 ? "+" : ""}
        {change}% vs. mês anterior
      </span>
    );
  }

  const diff = Math.round((current - previous) * 10) / 10;
  if (diff === 0) return <span className="delta flat">igual ao mês anterior</span>;
  return (
    <span className={`delta ${diff > 0 ? "up" : "down"}`}>
      {diff > 0 ? "+" : ""}
      {diff} p.p. vs. mês anterior
    </span>
  );
}

export function MonthlyPerformanceScreen({ mes }: { mes?: string }) {
  const query = useQuery(queries.monthlyPerformance(mes));

  return (
    <>
      <div className="page-header">
        <h1>Desempenho</h1>
      </div>
      <PerformanceTabs active="monthly" />

      <Async query={query}>
        {({ month, thisMonth, prevMonth, nextMonth, perf, previous, questions, previousQuestions, overview }) => {
          const dayData = perf.days.map((d) => ({ label: dayMonthLabel(d.date), minutes: Math.round(d.seconds / 60) }));
          const overviewData = overview.map((m) => ({ label: monthLabel(m.month, "short"), minutes: Math.round(m.seconds / 60) }));
          const maxSubject = Math.max(1, ...perf.bySubject.map((s) => s.seconds));

          return (
            <>
              <MonthNav basePath="/desempenho/mensal" month={month} prevMonth={prevMonth} nextMonth={nextMonth} />

              <div className="stats">
                <div className="card stat">
                  <span className="muted">Tempo estudado</span>
                  <strong>{formatDuration(perf.totalSeconds)}</strong>
                  <Delta current={perf.totalSeconds} previous={previous.seconds} unit="percent" />
                </div>
                <div className="card stat">
                  <span className="muted">Dias estudados</span>
                  <strong>
                    {perf.studiedDays}/{perf.periodDays}
                  </strong>
                  <Delta current={perf.studiedDays} previous={previous.studiedDays} unit="percent" />
                </div>
                <div className="card stat">
                  <span className="muted">Média por dia estudado</span>
                  <strong>{formatDuration(perf.avgSecondsPerStudiedDay)}</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Sessões</span>
                  <strong>{perf.sessionsCount}</strong>
                </div>
                <div className="card stat">
                  <span className="muted">Questões</span>
                  <strong>
                    {questions.total > 0 ? `${questions.total} · ${questions.percent}%` : "—"}
                  </strong>
                  {questions.total > 0 && previousQuestions.total > 0 && (
                    <Delta current={questions.percent} previous={previousQuestions.percent} unit="points" />
                  )}
                </div>
              </div>

              <div className="card">
                <div className="page-header">
                  <h2>Tempo estudado por dia</h2>
                  <NavLink to={`/desempenho/diario?mes=${month}`}>Ver dia a dia</NavLink>
                </div>
                {perf.totalSeconds === 0 ? (
                  <p className="muted">Nenhuma sessão finalizada neste mês.</p>
                ) : (
                  <DailyHoursChart data={dayData} />
                )}
              </div>

              <div className="card">
                <h2>Tempo por disciplina</h2>
                {perf.bySubject.length === 0 ? (
                  <p className="muted">Sem dados neste mês.</p>
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
                        <div className="progress-fill" style={{ width: `${(s.seconds / maxSubject) * 100}%` }} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="card">
                <h2>Questões e acertos</h2>
                {questions.total === 0 ? (
                  <p className="muted">Nenhuma questão registrada neste mês.</p>
                ) : (
                  <>
                    <p>
                      <strong>{questions.percent}%</strong> de acertos · {questions.correct} acertos em{" "}
                      {questions.total} questões
                    </p>
                    <AccuracyBySubject items={questions.bySubject} />
                  </>
                )}
              </div>

              <div className="card">
                <h2>Últimos 12 meses</h2>
                <DailyHoursChart data={overviewData} />

                <MonthsTable overview={overview} selected={month} />
                <p className="muted small">Clique no nome de um mês para ver o detalhe. O gráfico mostra horas por mês.</p>
              </div>
            </>
          );
        }}
      </Async>
    </>
  );
}
