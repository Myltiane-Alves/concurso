export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="progress-wrap" title={`${done} de ${total} concluídos`}>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="muted">
        {done}/{total} ({pct}%)
      </span>
    </div>
  );
}
