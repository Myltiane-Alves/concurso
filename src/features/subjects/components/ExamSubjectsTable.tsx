"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { DeleteButton } from "@/components/DeleteButton";
import { NavLink } from "@/components/NavLink";
import { deleteSubjectAction } from "../actions";

type Subject = { id: string; name: string; priority: number; _count: { topics: number } };
type Row = { id: string; name: string; priority: number; topics: number };

/** Disciplinas de um concurso (tela de detalhe do concurso). */
export function ExamSubjectsTable({ subjects }: { subjects: Subject[] }) {
  const rows = useMemo<Row[]>(
    () => subjects.map((s) => ({ id: s.id, name: s.name, priority: s.priority, topics: s._count.topics })),
    [subjects]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="name"
      sortOrder={1}
      globalFields={["name"]}
      emptyMessage="Nenhuma disciplina cadastrada neste concurso."
    >
      <Column
        field="name"
        header="Disciplina"
        sortable
        body={(r: Row) => (
          <NavLink to={`/disciplinas/${r.id}`}>
            <strong>{r.name}</strong>
          </NavLink>
        )}
      />
      <Column field="priority" header="Prioridade" sortable />
      <Column field="topics" header="Conteúdos" sortable />
      <Column
        header="Ações"
        style={{ width: "5rem" }}
        body={(r: Row) => (
          <DeleteButton
            action={deleteSubjectAction}
            fields={{ id: r.id }}
            message="Excluir esta disciplina e todos os conteúdos?"
          />
        )}
      />
    </AppDataTable>
  );
}
