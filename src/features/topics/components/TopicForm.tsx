import type { Topic } from "@prisma/client";
import { ActionForm } from "@/components/ActionForm";
import { createTopicAction } from "../actions";

export function TopicForm({ subjectId, topics }: { subjectId: string; topics: Topic[] }) {
  return (
    <ActionForm action={createTopicAction} submitLabel="Adicionar conteúdo">
      <input type="hidden" name="subjectId" value={subjectId} />
      <div className="form-grid">
        <label>
          Numeração
          <input name="code" placeholder="Ex.: 1.2" />
        </label>
        <label>
          Título *
          <input name="title" required placeholder="Ex.: Concentração e desconcentração" />
        </label>
        <label>
          Dentro de (opcional)
          <select name="parentId" defaultValue="">
            <option value="">— Nível principal —</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.code ? `${t.code} ` : ""}
                {t.title}
              </option>
            ))}
          </select>
        </label>
      </div>
    </ActionForm>
  );
}
