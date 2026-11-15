"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { MutateForm } from "@/components/MutateForm";
import { NavLink } from "@/components/NavLink";
import { PlanningTabs } from "@/components/PlanningTabs";
import { addDays, dateToISO, dayMonthLabel, weekdayLabel } from "@/lib/dates";
import { formatMinutes } from "@/lib/format";
import { queries } from "@/lib/queries";
import { rescheduleOverdueAction } from "@/features/agenda/actions";
import { ActivityForm } from "@/features/agenda/components/ActivityForm";
import { ActivityItem } from "@/features/agenda/components/ActivityItem";

export function AgendaScreen({ semana }: { semana?: string }) {
  const query = useQuery(queries.agenda(semana));

  return (
    <>
      <div className="page-header">
        <h1>Agenda</h1>
      </div>
      <PlanningTabs active="agenda" />

      <Async query={query}>
        {({ today, start, days, activities, subjects, overdue }) => {
          const byDay = new Map<string, typeof activities>();
          for (const a of activities) {
            const key = dateToISO(a.date);
            byDay.set(key, [...(byDay.get(key) ?? []), a]);
          }

          return (
            <>
              <div className="card">
                <h2>Nova atividade</h2>
                <ActivityForm defaultDate={today} subjects={subjects} />
              </div>

              {overdue > 0 && (
                <MutateForm action={rescheduleOverdueAction} className="notice">
                  <span>Você tem {overdue} atividade(s) não realizada(s) de dias anteriores.</span>
                  <button type="submit" className="btn-small">
                    Reorganizar para hoje
                  </button>
                </MutateForm>
              )}

              <div className="week-nav">
                <NavLink to={`/planejamento/agenda?semana=${addDays(start, -7)}`}>← Semana anterior</NavLink>
                <strong>
                  {dayMonthLabel(days[0])} a {dayMonthLabel(days[6])}
                </strong>
                <NavLink to={`/planejamento/agenda?semana=${addDays(start, 7)}`}>Próxima semana →</NavLink>
              </div>

              <div className="week-grid">
                {days.map((day) => {
                  const list = byDay.get(day) ?? [];
                  const planned = list.reduce((sum, a) => sum + a.minutes, 0);
                  return (
                    <div key={day} className={`day-col ${day === today ? "is-today" : ""}`}>
                      <div className="day-head">
                        <strong>{weekdayLabel(day)}</strong>
                        <span className="muted small">{dayMonthLabel(day)}</span>
                        {planned > 0 && <span className="muted small">{formatMinutes(planned)}</span>}
                      </div>
                      {list.length === 0 ? (
                        <p className="muted small">—</p>
                      ) : (
                        list.map((a) => <ActivityItem key={a.id} activity={a} />)
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          );
        }}
      </Async>
    </>
  );
}
