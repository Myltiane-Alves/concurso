"use client";

import { useRef, useState } from "react";
import { Bold, Italic, Link2, List, Heading } from "lucide-react";
import { ActionForm } from "@/components/ActionForm";
import { saveNoteAction } from "../actions";
import { renderMarkdown } from "../utils/markdown";

type SubjectOption = {
  id: string;
  name: string;
  exam: { name: string };
  topics: { id: string; code: string | null; title: string }[];
};

type Props = {
  subjects: SubjectOption[];
  note?: {
    id: string;
    title: string;
    content: string;
    links: string | null;
    subjectId: string | null;
    topicId: string | null;
  };
  onDone: () => void;
};

export function NoteEditor({ subjects, note, onDone }: Props) {
  const [subjectId, setSubjectId] = useState(note?.subjectId ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const topics = subjects.find((s) => s.id === subjectId)?.topics ?? [];

  function wrap(before: string, after: string, placeholder: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end } = ta;
    const selected = content.slice(start, end) || placeholder;
    setContent(content.slice(0, start) + before + selected + after + content.slice(end));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function prefixLine(prefix: string) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    setContent(content.slice(0, lineStart) + prefix + content.slice(lineStart));
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }

  return (
    <ActionForm action={saveNoteAction} submitLabel={note ? "Salvar alterações" : "Salvar anotação"} onSuccess={onDone}>
      {note && <input type="hidden" name="id" value={note.id} />}

      <label>
        Título *
        <input name="title" required defaultValue={note?.title} placeholder="Ex.: Resumo de atos administrativos" />
      </label>

      <div className="form-grid">
        <label>
          Disciplina
          <select name="subjectId" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
            <option value="">— Nenhuma —</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.exam.name})
              </option>
            ))}
          </select>
        </label>
        <label>
          Conteúdo
          <select
            name="topicId"
            key={subjectId}
            defaultValue={subjectId === note?.subjectId ? (note?.topicId ?? "") : ""}
            disabled={!subjectId}
          >
            <option value="">— Disciplina inteira —</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code ? `${t.code} ` : ""}
                {t.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="editor">
        <div className="toolbar">
          <button type="button" title="Negrito" onClick={() => wrap("**", "**", "texto")}>
            <Bold size={15} />
          </button>
          <button type="button" title="Itálico" onClick={() => wrap("*", "*", "texto")}>
            <Italic size={15} />
          </button>
          <button type="button" title="Título" onClick={() => prefixLine("# ")}>
            <Heading size={15} />
          </button>
          <button type="button" title="Lista" onClick={() => prefixLine("- ")}>
            <List size={15} />
          </button>
          <button type="button" title="Link" onClick={() => wrap("[", "](https://)", "texto do link")}>
            <Link2 size={15} />
          </button>
          <button type="button" className={`toolbar-toggle ${preview ? "active" : ""}`} onClick={() => setPreview(!preview)}>
            {preview ? "Editar" : "Visualizar"}
          </button>
        </div>

        {/* O textarea fica sempre montado para o conteúdo ser enviado, mesmo na pré-visualização. */}
        <textarea
          ref={textareaRef}
          name="content"
          rows={10}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          hidden={preview}
          placeholder={"Use **negrito**, *itálico*, # Título, - lista ou [texto](https://link)"}
        />
        {preview && (
          <div
            className="note-content preview"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) || "<p>Nada para visualizar.</p>" }}
          />
        )}
      </div>

      <label>
        Links e materiais de referência (um por linha)
        <textarea name="links" rows={3} defaultValue={note?.links ?? ""} placeholder="https://..." />
      </label>
    </ActionForm>
  );
}
