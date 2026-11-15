"use client";

import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { NavLink } from "@/components/NavLink";
import { ProgressBar } from "@/components/ProgressBar";
import { queries } from "@/lib/queries";
import { TopicTree } from "@/features/topics/components/TopicTree";
import { TopicForm } from "@/features/topics/components/TopicForm";
import { ImportTopicsForm } from "@/features/topics/components/ImportTopicsForm";
import { buildTree, leafProgress } from "@/features/topics/utils/tree";

export function SubjectDetailScreen({ id }: { id: string }) {
  const query = useQuery(queries.subject(id));

  return (
    <>
      <Async query={query}>
        {(subject) => {
          const tree = buildTree(subject.topics);
          const total = tree.reduce(
            (acc, n) => {
              const p = leafProgress(n);
              return { done: acc.done + p.done, total: acc.total + p.total };
            },
            { done: 0, total: 0 }
          );

          return (
            <>
              <p className="muted small">
                <NavLink to="/disciplinas">← Disciplinas</NavLink> · {subject.exam.name}
              </p>
              <div className="page-header">
                <h1>{subject.name}</h1>
              </div>

              <div className="card">
                <ProgressBar done={total.done} total={total.total} />
              </div>

              <div className="card">
                <h2>Conteúdos</h2>
                {tree.length === 0 ? (
                  <p className="muted">Nenhum conteúdo ainda. Adicione abaixo ou importe do edital.</p>
                ) : (
                  <TopicTree nodes={tree} subjectId={subject.id} />
                )}
              </div>

              <div className="card">
                <h2>Importar do edital</h2>
                <ImportTopicsForm subjectId={subject.id} />
              </div>

              <div className="card">
                <h2>Adicionar conteúdo manualmente</h2>
                <TopicForm subjectId={subject.id} topics={subject.topics} />
              </div>
            </>
          );
        }}
      </Async>
    </>
  );
}
