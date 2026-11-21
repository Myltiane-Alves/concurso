"use client";

import { useMemo, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import {
  DataTable,
  type DataTableExpandedRows,
  type DataTableFilterMeta,
  type DataTableRowToggleEvent,
  type DataTableValueArray,
} from "primereact/datatable";
import { InputText } from "primereact/inputtext";

export const TABLE_ROWS = 10;

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[];
  /** Campos (texto) em que a pesquisa procura. */
  globalFields: string[];
  sortField: string;
  sortOrder?: 1 | -1;
  emptyMessage?: string;
  /** Se informado, use <Column expander /> para abrir o detalhe da linha. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowExpansionTemplate?: (row: any) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowClassName?: (row: any) => string;
  children: React.ReactNode;
};

/** Tabela com pesquisa, ordenação e paginação de 10 linhas. As colunas entram como filhos (<Column />). */
export function AppDataTable({
  value,
  globalFields,
  sortField,
  sortOrder = -1,
  emptyMessage = "Nenhum registro encontrado.",
  rowExpansionTemplate,
  rowClassName,
  children,
}: Props) {
  const [term, setTerm] = useState("");
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows | DataTableValueArray | undefined>(
    undefined
  );

  const filters = useMemo<DataTableFilterMeta>(
    () => ({ global: { value: term.trim() || null, matchMode: FilterMatchMode.CONTAINS } }),
    [term]
  );

  const expansion = rowExpansionTemplate
    ? {
        expandedRows,
        onRowToggle: (e: DataTableRowToggleEvent) => setExpandedRows(e.data),
        rowExpansionTemplate,
      }
    : {};

  const header = (
    <div className="table-toolbar">
      <span className="table-search">
        <i className="pi pi-search" />
        <InputText
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Pesquisar na tabela..."
          aria-label="Pesquisar na tabela"
        />
      </span>
      <span className="muted small">{value.length} registro(s)</span>
    </div>
  );

  return (
    <DataTable
      value={value}
      dataKey="id"
      header={header}
      filters={filters}
      globalFilterFields={globalFields}
      paginator
      rows={TABLE_ROWS}
      alwaysShowPaginator={false}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
      currentPageReportTemplate="{first} a {last} de {totalRecords}"
      sortField={sortField}
      sortOrder={sortOrder}
      removableSort
      emptyMessage={emptyMessage}
      rowClassName={rowClassName}
      {...expansion}
    >
      {children}
    </DataTable>
  );
}
