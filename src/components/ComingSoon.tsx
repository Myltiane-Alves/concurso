export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <div className="page-header">
        <h1>{title}</h1>
      </div>
      <div className="card">
        <p className="muted">Esta área será construída nas próximas fases do projeto.</p>
      </div>
    </>
  );
}
