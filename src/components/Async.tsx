"use client";

import type { UseQueryResult } from "@tanstack/react-query";

type Props<T> = {
  query: UseQueryResult<T, Error>;
  children: (data: T, query: UseQueryResult<T, Error>) => React.ReactNode;
};

export function Async<T>({ query, children }: Props<T>) {
  if (query.isPending) return <p className="muted">Carregando...</p>;

  if (query.isError) {
    return (
      <div className="card">
        <p className="form-error">{query.error.message}</p>
        <button type="button" className="btn-small" onClick={() => query.refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return <>{children(query.data, query)}</>;
}
