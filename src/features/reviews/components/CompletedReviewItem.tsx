import { dateTimeLabel } from "@/lib/dates";
import { DIFFICULTY_LABEL } from "../utils/intervals";

type Props = {
  review: {
    id: string;
    title: string;
    completedAt: Date | null;
    difficulty: string | null;
    intervalDays: number | null;
    notes: string | null;
    subject: { name: string } | null;
  };
};

export function CompletedReviewItem({ review: r }: Props) {
  return (
    <div className="history-item">
      <div className="history-main">
        <strong>{r.title}</strong>
        <span className="muted small">
          {r.subject ? `${r.subject.name} · ` : ""}
          {r.completedAt ? `Concluída em ${dateTimeLabel(r.completedAt)}` : ""}
          {r.intervalDays ? ` · revisão de ${r.intervalDays} dia(s)` : ""}
        </span>
        {r.notes && <span className="muted small">{r.notes}</span>}
      </div>
      {r.difficulty && (
        <span className={`score ${r.difficulty === "EASY" ? "good" : r.difficulty === "MEDIUM" ? "warn" : "bad"}`}>
          {DIFFICULTY_LABEL[r.difficulty]}
        </span>
      )}
    </div>
  );
}
