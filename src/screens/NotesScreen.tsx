"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Async } from "@/components/Async";
import { queries } from "@/lib/queries";
import { NoteCard } from "@/features/notes/components/NoteCard";
import { NoteEditor } from "@/features/notes/components/NoteEditor";

export function NotesScreen() {
  const query = useQuery(queries.notes());
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <>
      <div className="page-header">
        <h1>Anotações</h1>
        {!creating && (
          <button type="button" className="btn-primary" onClick={() => setCreating(true)}>
            Nova anotação
          </button>
        )}
      </div>

      <Async query={query}>
        {({ items, subjects }) => {
          const term = search.trim().toLowerCase();
          const filtered = items.filter(
            (n) =>
              (!subjectFilter || n.subjectId === subjectFilter) &&
              (!term ||
                [n.title, n.content, n.links ?? "", n.subject?.name ?? "", n.topic?.title ?? ""]
                  .join(" ")
                  .toLowerCase()
                  .includes(term))
          );

          return (
            <>
              {creating && (
                <div className="card">
                  <h2>Nova anotação</h2>
                  <NoteEditor subjects={subjects} onDone={() => setCreating(false)} />
                  <button type="button" className="btn-small" onClick={() => setCreating(false)}>
                    Cancelar
                  </button>
                </div>
              )}

              <div className="filter-bar">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Pesquisar nas anotações..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
                  <option value="">Todas as disciplinas</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.exam.name})
                    </option>
                  ))}
                </select>
              </div>

              {filtered.length === 0 ? (
                <p className="muted">
                  {items.length === 0 ? "Nenhuma anotação ainda." : "Nenhuma anotação encontrada."}
                </p>
              ) : (
                filtered.map((n) =>
                  editingId === n.id ? (
                    <div key={n.id} className="card">
                      <h2>Editar anotação</h2>
                      <NoteEditor subjects={subjects} note={n} onDone={() => setEditingId(null)} />
                      <button type="button" className="btn-small" onClick={() => setEditingId(null)}>
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <NoteCard key={n.id} note={n} onEdit={() => setEditingId(n.id)} />
                  )
                )
              )}
            </>
          );
        }}
      </Async>
    </>
  );
}
