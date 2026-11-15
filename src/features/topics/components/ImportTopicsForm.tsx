import { ActionForm } from "@/components/ActionForm";
import { importTopicsAction } from "../actions";

export function ImportTopicsForm({ subjectId }: { subjectId: string }) {
  return (
    <ActionForm action={importTopicsAction} submitLabel="Importar conteúdos">
      <input type="hidden" name="subjectId" value={subjectId} />
      <label>
        Cole o conteúdo programático do edital
        <textarea
          name="text"
          rows={8}
          required
          placeholder={
            "1 Noções de organização administrativa.\n1.1 Centralização, descentralização\n1.2 Concentração e desconcentração\n2 Administração direta e indireta"
          }
        />
      </label>
      <p className="muted small">
        A numeração define a hierarquia: 1 é o tópico principal e 1.1, 1.2 são os subtópicos. Itens com
        numeração já cadastrada são ignorados.
      </p>
    </ActionForm>
  );
}
