"use client";

import { useMemo } from "react";
import { Column } from "primereact/column";
import { AppDataTable } from "@/components/AppDataTable";
import { dateTimeLabel } from "@/lib/dates";

type Item = {
  id: string;
  endedAt: Date | null;
  difficulties: string | null;
  subject: { name: string } | null;
  topic: { code: string | null; title: string } | null;
};

type Row = { id: string; ts: number; dateLabel: string; subject: string; topic: string; difficulties: string };

export function DifficultiesTable({ items }: { items: Item[] }) {
  const rows = useMemo<Row[]>(
    () =>
      items.map((d) => ({
        id: d.id,
        ts: d.endedAt ? new Date(d.endedAt).getTime() : 0,
        dateLabel: d.endedAt ? dateTimeLabel(new Date(d.endedAt)) : "",
        subject: d.subject?.name ?? "Disciplina removida",
        topic: d.topic ? `${d.topic.code ? `${d.topic.code} ` : ""}${d.topic.title}` : "",
        difficulties: d.difficulties ?? "",
      })),
    [items]
  );

  return (
    <AppDataTable
      value={rows}
      sortField="ts"
      globalFields={["dateLabel", "subject", "topic", "difficulties"]}
      emptyMessage="Nenhuma dificuldade registrada nas sessões ainda."
    >
      <Column field="dateLabel" header="Data" sortable sortField="ts" />
      <Column field="subject" header="Disciplina" sortable />
      <Column field="topic" header="Conteúdo" sortable />
      <Column field="difficulties" header="Dificuldade" />
    </AppDataTable>
  );
}
