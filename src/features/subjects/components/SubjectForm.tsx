import { ActionForm } from "@/components/ActionForm";
import { createSubjectAction } from "../actions";

type Props = {
  exams: { id: string; name: string }[];
  fixedExamId?: string;
};

export function SubjectForm({ exams, fixedExamId }: Props) {
  return (
    <ActionForm action={createSubjectAction} submitLabel="Adicionar disciplina">
      <div className="form-grid">
        {fixedExamId ? (
          <input type="hidden" name="examId" value={fixedExamId} />
        ) : (
          <label>
            Concurso *
            <select name="examId" required defaultValue="">
              <option value="" disabled>
                Selecione...
              </option>
              {exams.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Nome da disciplina *
          <input name="name" required placeholder="Ex.: Noções de Direito Administrativo" />
        </label>
        <label>
          Prioridade
          <select name="priority" defaultValue="3">
            <option value="1">1 - Muito baixa</option>
            <option value="2">2 - Baixa</option>
            <option value="3">3 - Média</option>
            <option value="4">4 - Alta</option>
            <option value="5">5 - Muito alta</option>
          </select>
        </label>
      </div>
    </ActionForm>
  );
}
