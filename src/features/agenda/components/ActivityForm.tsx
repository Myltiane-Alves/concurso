import { ActionForm } from "@/components/ActionForm";
import { createActivityAction } from "../actions";

type Props = {
  defaultDate: string;
  subjects: { id: string; name: string; exam: { name: string } }[];
};

export function ActivityForm({ defaultDate, subjects }: Props) {
  return (
    <ActionForm action={createActivityAction} submitLabel="Adicionar à agenda">
      <div className="form-grid">
        <label>
          Data *
          <input name="date" type="date" defaultValue={defaultDate} required />
        </label>
        <label>
          Disciplina
          <select name="subjectId" defaultValue="">
            <option value="">— Nenhuma —</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.exam.name})
              </option>
            ))}
          </select>
        </label>
        <label>
          Título (opcional se escolher a disciplina)
          <input name="title" placeholder="Ex.: Resolver questões de Direito Administrativo" />
        </label>
        <label>
          Tempo previsto (min) *
          <input name="minutes" type="number" min={5} max={720} step={5} defaultValue={60} required />
        </label>
      </div>
    </ActionForm>
  );
}
