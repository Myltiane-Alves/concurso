"use client";

import { useQuery } from "@tanstack/react-query";
import { Pause, Play } from "lucide-react";
import { ActionForm } from "@/components/ActionForm";
import { Async } from "@/components/Async";
import { DeleteButton } from "@/components/DeleteButton";
import { MutateForm } from "@/components/MutateForm";
import { NavLink } from "@/components/NavLink";
import { formatDuration, formatMinutes } from "@/lib/format";
import { queries } from "@/lib/queries";
import {
  discardSessionAction,
  finishSessionAction,
  pauseSessionAction,
  resumeSessionAction,
  startSessionAction,
} from "@/features/sessions/actions";
import { ManualHoursSection } from "@/features/sessions/components/ManualHoursSection";
import { SessionHistoryTable } from "@/features/sessions/components/SessionHistoryTable";
import { SessionTimer } from "@/features/sessions/components/SessionTimer";
import { StartSessionForm } from "@/features/sessions/components/StartSessionForm";

export function StudyScreen() {
  const query = useQuery(queries.study());

  return (
    <Async query={query}>
      {({ active, history, manualEntries, todaySeconds, subjects, nextBlock, today, serverNow }, q) => {
        // Diferença entre o relógio do servidor e o do navegador no momento da busca.
        const clockOffsetMs = serverNow - q.dataUpdatedAt;

        return (
          <>
            <div className="page-header">
              <h1>Estudar</h1>
              <span className="muted">Hoje: {formatDuration(todaySeconds)}</span>
            </div>

            {active ? (
              <div className="card session-card">
                <span className={`badge-status ${active.status === "RUNNING" ? "running" : "paused"}`}>
                  {active.status === "RUNNING" ? "Em andamento" : "Pausada"}
                </span>

                <p className="muted">
                  <strong>{active.subject?.name ?? "Disciplina removida"}</strong>
                  {active.topic && (
                    <>
                      {" · "}
                      {active.topic.code ? `${active.topic.code} ` : ""}
                      {active.topic.title}
                    </>
                  )}
                </p>

                <SessionTimer
                  accumulatedSeconds={active.accumulatedSeconds}
                  lastResumedAt={active.lastResumedAt}
                  running={active.status === "RUNNING"}
                  clockOffsetMs={clockOffsetMs}
                />

                <div className="session-actions">
                  {active.status === "RUNNING" ? (
                    <MutateForm action={pauseSessionAction}>
                      <input type="hidden" name="id" value={active.id} />
                      <button type="submit" className="btn-small">
                        <Pause size={14} /> Pausar
                      </button>
                    </MutateForm>
                  ) : (
                    <MutateForm action={resumeSessionAction}>
                      <input type="hidden" name="id" value={active.id} />
                      <button type="submit" className="btn-small">
                        <Play size={14} /> Retomar
                      </button>
                    </MutateForm>
                  )}
                  <DeleteButton
                    action={discardSessionAction}
                    fields={{ id: active.id }}
                    message="Descartar esta sessão sem salvar o tempo?"
                  />
                </div>

                <div className="finish-box">
                  <h2>Finalizar sessão</h2>
                  <ActionForm action={finishSessionAction} submitLabel="Finalizar e salvar">
                    <input type="hidden" name="id" value={active.id} />
                    <label>
                      Observações
                      <textarea name="notes" rows={3} placeholder="O que você estudou?" />
                    </label>
                    <label>
                      Dificuldades
                      <textarea name="difficulties" rows={3} placeholder="O que ficou confuso?" />
                    </label>
                  </ActionForm>
                </div>
              </div>
            ) : (
              <>
                {nextBlock && (
                  <div className="card">
                    <h2>Próximo bloco do ciclo</h2>
                    <p>
                      <strong>{nextBlock.subject.name}</strong> · {formatMinutes(nextBlock.minutes)}
                    </p>
                    <ActionForm action={startSessionAction} submitLabel="Iniciar este bloco">
                      <input type="hidden" name="subjectId" value={nextBlock.subject.id} />
                      <input type="hidden" name="planItemId" value={nextBlock.id} />
                    </ActionForm>
                    <p className="muted small">Ao finalizar, o bloco é marcado como concluído no ciclo.</p>
                  </div>
                )}

                <div className="card">
                  <h2>Nova sessão</h2>
                  {subjects.length === 0 ? (
                    <p className="muted">
                      Cadastre disciplinas primeiro em <NavLink to="/disciplinas">Disciplinas</NavLink>.
                    </p>
                  ) : (
                    <StartSessionForm subjects={subjects} />
                  )}
                </div>
              </>
            )}

            <ManualHoursSection subjects={subjects} entries={manualEntries} today={today} />

            <div className="card">
              <h2>Últimas sessões</h2>
              <SessionHistoryTable sessions={history} />
            </div>
          </>
        );
      }}
    </Async>
  );
}
