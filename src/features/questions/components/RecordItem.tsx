import { DeleteButton } from "@/components/DeleteButton";
import { formatDate } from "@/lib/format";
import { deleteQuestionRecordAction } from "../actions";
import { level, percent } from "../utils/percent";

type Props = {
  record: {
    id: string;
    date: Date;
    total: number;
    correct: number;
    board: string | null;
    source: string | null;
    notes: string | null;
    subject: { name: string } | null;
    topic: { code: string | null; title: string } | null;
  };
};

export function RecordItem({ record: r }: Props) {
  const p = percent(r.correct, r.total);
  const meta = [r.board, r.source].filter(Boolean).join(" · ");

  return (
    <div className="history-item">
      <div className="history-main">
        <strong>{r.subject?.name ?? "Disciplina removida"}</strong>
        <span className="muted small">
          {formatDate(r.date)}
          {r.topic ? ` · ${r.topic.code ? `${r.topic.code} ` : ""}${r.topic.title}` : ""}
          {meta ? ` · ${meta}` : ""}
        </span>
        {r.notes && <span className="muted small">{r.notes}</span>}
      </div>
      <span className={`score ${level(p)}`}>
        {r.correct}/{r.total} · {p}%
      </span>
      <DeleteButton action={deleteQuestionRecordAction} fields={{ id: r.id }} message="Excluir este registro?" />
    </div>
  );
}
