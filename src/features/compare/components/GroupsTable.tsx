"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { MutateForm } from "@/components/MutateForm";
import { formatDuration } from "@/lib/format";
import { linkSubjectsAction, unlinkSubjectsAction } from "../actions";
import type { Group } from "../utils/compare";

type Props = {
  groups: Group[];
  exams: { id: string; name: string }[];
  emptyMessage?: string;
};

const KIND_LABEL: Record<string, string> = {
  confirmed: "Vinculada por você",
  exact: "Mesmo nome",
  similar: "Parecida",
};

type Row = {
  id: string;
  title: string;
  names: string;
  kind: string;
  kindLabel: string;
  common: string;
  commonCount: number;
  studied: string;
  seconds: number;
  group: Group;
};

export function GroupsTable({ groups, exams, emptyMessage }: Props) {
  const rows = useMemo<Row[]>(
    () =>
      groups.map((g) => ({
        id: g.id,
        title: g.members[0].name,
        names: g.members.map((m) => m.name).join(" "),
        kind: g.kind,
        kindLabel:
          KIND_LABEL[g.kind] + (g.kind === "similar" && g.similarity !== null ? ` · ${g.similarity}%` : ""),
        common: g.topicsDistinct > 0 ? `${g.topicsCommon} de ${g.topicsDistinct}` : "—",
        commonCount: g.topicsCommon,
        studied: g.studySeconds > 0 ? formatDuration(g.studySeconds) : "—",
        seconds: g.studySeconds,
        group: g,
      })),
    [groups]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="title"
      sortOrder={1}
      globalFields={["title", "names", "kindLabel"]}
      emptyMessage={emptyMessage}
    >
      <Column
        field="title"
        header="Disciplina"
        sortable
        body={(r: Row) => (
          <div className="cell-stack">
            <strong>{r.title}</strong>
            <span className={`badge-kind ${r.kind}`}>{r.kindLabel}</span>
          </div>
        )}
      />
      {exams.map((exam) => (
        <Column
          key={exam.id}
          header={exam.name}
          body={(r: Row) => {
            const members = r.group.members.filter((m) => m.examId === exam.id);
            if (members.length === 0) return <span className="muted small">Não tem</span>;
            return (
              <div className="cell-stack">
                {members.map((m) => (
                  <div key={m.subjectId} className="cell-stack">
                    <span>{m.name}</span>
                    <span className="muted small">
                      {m.topicsDone}/{m.topicsTotal} conteúdos
                    </span>
                  </div>
                ))}
              </div>
            );
          }}
        />
      ))}
      <Column field="common" header="Conteúdos em comum" sortable sortField="commonCount" />
      <Column field="studied" header="Estudado" sortable sortField="seconds" />
      <Column
        header="Ação"
        style={{ minWidth: "10rem" }}
        body={(r: Row) => {
          if (r.kind !== "similar" && r.kind !== "confirmed") return null;
          const hidden = r.group.members.map((m) => (
            <input key={m.subjectId} type="hidden" name="ids" value={m.subjectId} />
          ));
          return r.kind === "similar" ? (
            <MutateForm action={linkSubjectsAction}>
              {hidden}
              <button type="submit" className="btn-small">
                São a mesma disciplina
              </button>
            </MutateForm>
          ) : (
            <MutateForm action={unlinkSubjectsAction}>
              {hidden}
              <button type="submit" className="btn-small">
                Desfazer vínculo
              </button>
            </MutateForm>
          );
        }}
      />
    </AppDataTable>
  );
}
