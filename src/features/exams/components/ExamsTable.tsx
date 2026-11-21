"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { DeleteButton } from "@/components/DeleteButton";
import { NavLink } from "@/components/NavLink";
import { formatDate } from "@/lib/format";
import { deleteExamAction } from "../actions";

type Exam = {
  id: string;
  name: string;
  organ: string | null;
  board: string | null;
  role: string | null;
  examDate: Date | null;
  createdAt: Date;
  _count: { subjects: number };
};

type Row = {
  id: string;
  name: string;
  organ: string;
  board: string;
  role: string;
  dateLabel: string;
  examTs: number;
  createdTs: number;
  subjects: number;
};

export function ExamsTable({ exams }: { exams: Exam[] }) {
  const rows = useMemo<Row[]>(
    () =>
      exams.map((e) => ({
        id: e.id,
        name: e.name,
        organ: e.organ ?? "",
        board: e.board ?? "",
        role: e.role ?? "",
        dateLabel: e.examDate ? formatDate(e.examDate) : "",
        examTs: e.examDate ? new Date(e.examDate).getTime() : Infinity,
        createdTs: new Date(e.createdAt).getTime(),
        subjects: e._count.subjects,
      })),
    [exams]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="createdTs"
      globalFields={["name", "organ", "board", "role", "dateLabel"]}
      emptyMessage="Nenhum concurso cadastrado ainda."
    >
      <Column
        field="name"
        header="Concurso"
        sortable
        body={(r: Row) => (
          <NavLink to={`/concursos/${r.id}`}>
            <strong>{r.name}</strong>
          </NavLink>
        )}
      />
      <Column field="organ" header="Órgão" sortable />
      <Column field="board" header="Banca" sortable />
      <Column field="role" header="Cargo" sortable />
      <Column field="dateLabel" header="Prova" sortable sortField="examTs" />
      <Column field="subjects" header="Disciplinas" sortable />
      <Column
        header="Ações"
        style={{ width: "5rem" }}
        body={(r: Row) => (
          <DeleteButton
            action={deleteExamAction}
            fields={{ id: r.id }}
            message="Excluir este concurso, suas disciplinas e conteúdos?"
          />
        )}
      />
    </AppDataTable>
  );
}
