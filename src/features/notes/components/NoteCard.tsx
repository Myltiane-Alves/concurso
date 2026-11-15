import { Pencil } from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";
import { dateTimeLabel } from "@/lib/dates";
import { deleteNoteAction } from "../actions";
import { parseLinks, renderMarkdown } from "../utils/markdown";

type Props = {
  note: {
    id: string;
    title: string;
    content: string;
    links: string | null;
    updatedAt: Date;
    subject: { name: string } | null;
    topic: { code: string | null; title: string } | null;
  };
  onEdit: () => void;
};

export function NoteCard({ note: n, onEdit }: Props) {
  const links = parseLinks(n.links);

  return (
    <div className="card note-card">
      <div className="note-head">
        <div className="history-main">
          <h2>{n.title}</h2>
          <span className="muted small">
            {n.subject ? `${n.subject.name} · ` : ""}
            {n.topic ? `${n.topic.code ? `${n.topic.code} ` : ""}${n.topic.title} · ` : ""}
            Atualizada em {dateTimeLabel(n.updatedAt)}
          </span>
        </div>
        <div className="row-actions">
          <button type="button" className="btn-icon neutral" title="Editar" onClick={onEdit}>
            <Pencil size={16} />
          </button>
          <DeleteButton action={deleteNoteAction} fields={{ id: n.id }} message="Excluir esta anotação?" />
        </div>
      </div>

      <div className="note-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(n.content) }} />

      {links.length > 0 && (
        <ul className="note-links">
          {links.map((link) => (
            <li key={link}>
              <a href={link} target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
