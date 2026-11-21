"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { dayMonthLabel, weekdayLabel } from "@/lib/dates";
import { formatDuration } from "@/lib/format";
import { queries } from "@/lib/queries";
import { DaysTable } from "@/features/performance/components/DaysTable";
import { MonthNav } from "@/features/performance/components/MonthNav";
import { PerformanceTabs } from "@/features/performance/components/PerformanceTabs";

export function DailyPerformanceScreen({ mes }: { mes?: string }) {
  const query = useQuery(queries.dailyPerformance(mes));
  const [hideEmpty, setHideEmpty] = useState(false);

  return (
    <>
      <div className="page-header">
        <h1>Desempenho</h1>
      </div>
      <PerformanceTabs active="daily" />

      <Async query={query}>
        {({ month, prevMonth, nextMonth, days, totalSeconds, studiedDays, periodDays, avgSecondsPerStudiedDay, best }) => (
          <>
            <MonthNav basePath="/desempenho/diario" month={month} prevMonth={prevMonth} nextMonth={nextMonth} />

            <div className="stats">
              <div className="card stat">
                <span className="muted">Total no mês</span>
                <strong>{formatDuration(totalSeconds)}</strong>
              </div>
              <div className="card stat">
                <span className="muted">Dias estudados</span>
                <strong>
                  {studiedDays}/{periodDays}
                </strong>
              </div>
              <div className="card stat">
                <span className="muted">Média por dia estudado</span>
                <strong>{formatDuration(avgSecondsPerStudiedDay)}</strong>
              </div>
              <div className="card stat">
                <span className="muted">Melhor dia</span>
                <strong>{best ? formatDuration(best.seconds) : "—"}</strong>
                {best && (
                  <span className="muted small">
                    {weekdayLabel(best.date)} {dayMonthLabel(best.date)}
                  </span>
                )}
              </div>
            </div>

            <div className="card">
              <div className="page-header">
                <h2>Horas estudadas por dia</h2>
                <label className="check-label small">
                  <input type="checkbox" checked={hideEmpty} onChange={(e) => setHideEmpty(e.target.checked)} />
                  Ocultar dias sem estudo
                </label>
              </div>
              <DaysTable days={hideEmpty ? days.filter((d) => d.seconds > 0) : days} />
              <p className="muted small">Clique na seta de um dia para ver as disciplinas estudadas.</p>
            </div>
          </>
        )}
      </Async>
    </>
  );
}
