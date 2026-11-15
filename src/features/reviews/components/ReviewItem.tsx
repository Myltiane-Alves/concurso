import { ActionForm } from "@/components/ActionForm";
import { DeleteButton } from "@/components/DeleteButton";
import { MutateForm } from "@/components/MutateForm";
import { formatDate } from "@/lib/format";
import { completeReviewAction, deleteReviewAction, postponeReviewAction } from "../actions";
import { suggestedNextDays } from "../utils/intervals";

export type DueKind = "overdue" | "today" | "upcoming";

const KIND_LABEL: Record<DueKind, string> = {
  overdue: "Atrasada",
  today: "Hoje",
  upcoming: "Próxima",
};

type Props = {
  kind: DueKind;
  review: {
    id: string;
    title: string;
    dueDate: Date;
    intervalDays: number | null;
    postponedCount: number;
    notes: string | null;
    subject: { name: string } | null;
  };
};

export function ReviewItem({ kind, review: r }: Props) {
  const suggested = suggestedNextDays(r.intervalDays);

  return (
    <div className="review-item">
      <div className="review-head">
        <div className="history-main">
          <strong>{r.title}</strong>
          <span className="muted small">
            {r.subject ? `${r.subject.name} · ` : ""}
            Prevista para {formatDate(r.dueDate)}
            {r.intervalDays ? ` · revisão de ${r.intervalDays} dia(s)` : ""}
            {r.postponedCount > 0 ? ` · adiada ${r.postponedCount}x` : ""}
          </span>
          {r.notes && <span className="muted small">{r.notes}</span>}
        </div>

        <span className={`badge-due ${kind}`}>{KIND_LABEL[kind]}</span>

        <div className="row-actions">
          {[1, 3].map((days) => (
            <MutateForm key={days} action={postponeReviewAction}>
              <input type="hidden" name="id" value={r.id} />
              <input type="hidden" name="days" value={days} />
              <button type="submit" className="btn-small" title={`Adiar ${days} dia(s)`}>
                +{days}d
              </button>
            </MutateForm>
          ))}
          <DeleteButton action={deleteReviewAction} fields={{ id: r.id }} message="Excluir esta revisão?" />
        </div>
      </div>

      <details className="complete-box">
        <summary>Concluir revisão</summary>
        <ActionForm action={completeReviewAction} submitLabel="Registrar revisão">
          <input type="hidden" name="id" value={r.id} />
          <div className="form-grid">
            <label>
              Como foi? *
              <select name="difficulty" defaultValue="MEDIUM">
                <option value="EASY">Fácil</option>
                <option value="MEDIUM">Médio</option>
                <option value="HARD">Difícil</option>
              </select>
            </label>
            <label>
              Próxima revisão em (dias)
              <input
                name="nextInDays"
                type="number"
                min={1}
                max={365}
                defaultValue={suggested ?? ""}
                placeholder="Deixe vazio para não agendar"
              />
            </label>
          </div>
          <label>
            Observações
            <textarea name="notes" rows={2} placeholder="O que ainda precisa reforçar?" />
          </label>
        </ActionForm>
      </details>
    </div>
  );
}
