import { DeleteButton } from "@/components/DeleteButton";
import { dateTimeLabel } from "@/lib/dates";
import { deleteErrorNoteAction } from "../actions";
import { ERROR_CATEGORY_LABEL } from "../utils/labels";

type Props = {
  note: {
    id: string;
    category: string;
    statement: string;
    wrongAnswer: string | null;
    correctAnswer: string | null;
    explanation: string | null;
    createdAt: Date;
    subject: { name: string } | null;
    topic: { code: string | null; title: string } | null;
  };
};

export function ErrorItem({ note: n }: Props) {
  return (
    <div className="error-item">
      <div className="error-head">
        <div className="history-main">
          <strong>{n.subject?.name ?? "Disciplina removida"}</strong>
          <span className="muted small">
            {n.topic ? `${n.topic.code ? `${n.topic.code} ` : ""}${n.topic.title} · ` : ""}
            {dateTimeLabel(n.createdAt)}
          </span>
        </div>
        <span className={`badge-cat ${n.category}`}>{ERROR_CATEGORY_LABEL[n.category]}</span>
        <DeleteButton action={deleteErrorNoteAction} fields={{ id: n.id }} message="Excluir este erro?" />
      </div>

      <p className="pre">{n.statement}</p>

      {(n.wrongAnswer || n.correctAnswer) && (
        <p className="small">
          {n.wrongAnswer && (
            <span className="answer wrong">
              Marcou: <strong>{n.wrongAnswer}</strong>
            </span>
          )}
          {n.correctAnswer && (
            <span className="answer right">
              Correta: <strong>{n.correctAnswer}</strong>
            </span>
          )}
        </p>
      )}

      {n.explanation && <p className="pre muted small">{n.explanation}</p>}
    </div>
  );
}
