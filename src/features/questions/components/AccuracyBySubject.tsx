import { level } from "../utils/percent";

type Item = { id: string; name: string; total: number; correct: number; percent: number };

export function AccuracyBySubject({ items }: { items: Item[] }) {
  return (
    <>
      {items.map((i) => (
        <div key={i.id} className="bar-row">
          <div className="bar-label">
            <span>{i.name}</span>
            <span className="muted small">
              {i.correct}/{i.total} · {i.percent}%
            </span>
          </div>
          <div className="progress">
            <div className={`progress-fill ${level(i.percent)}`} style={{ width: `${i.percent}%` }} />
          </div>
        </div>
      ))}
    </>
  );
}
