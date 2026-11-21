"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { DeleteButton } from "@/components/DeleteButton";
import { NavLink } from "@/components/NavLink";
import { ProgressBar } from "@/components/ProgressBar";
import { deleteSubjectAction } from "../actions";

type Subject = {
  id: string;
  name: string;
  priority: number;
  exam: { name: string };
  progress: { done: number; total: number };
};

type Row = {
  id: string;
  name: string;
  exam: string;
  priority: number;
  done: number;
  total: number;
  percent: number;
};

export function SubjectsTable({ subjects }: { subjects: Subject[] }) {
  const rows = useMemo<Row[]>(
    () =>
      subjects.map((s) => ({
        id: s.id,
        name: s.name,
        exam: s.exam.name,
        priority: s.priority,
        done: s.progress.done,
        total: s.progress.total,
        percent: s.progress.total === 0 ? 0 : s.progress.done / s.progress.total,
      })),
    [subjects]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="exam"
      sortOrder={1}
      globalFields={["name", "exam"]}
      emptyMessage="Nenhuma disciplina cadastrada ainda."
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
      <Column field="exam" header="Concurso" sortable />
      <Column field="priority" header="Prioridade" sortable />
      <Column
        header="Progresso"
        sortable
        sortField="percent"
        style={{ minWidth: "12rem" }}
        body={(r: Row) => <ProgressBar done={r.done} total={r.total} />}
      />
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
