import { ActionForm } from "@/components/ActionForm";
import { addItemAction } from "../actions";

type Props = {
  planId: string;
  subjects: { id: string; name: string; exam: { name: string } }[];
};

export function PlanItemForm({ planId, subjects }: Props) {
  return (
    <ActionForm action={addItemAction} submitLabel="Adicionar ao ciclo">
      <input type="hidden" name="planId" value={planId} />
      <div className="form-grid">
        <label>
          Disciplina *
          <select name="subjectId" required defaultValue="">
            <option value="" disabled>
              Selecione...
            </option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.exam.name})
              </option>
            ))}
          </select>
        </label>
        <label>
          Duração do bloco (minutos) *
          <input name="minutes" type="number" min={5} max={600} step={5} defaultValue={60} required />
        </label>
      </div>
    </ActionForm>
  );
}
