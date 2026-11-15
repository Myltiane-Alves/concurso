import { ActionForm } from "@/components/ActionForm";
import { createExamAction } from "../actions";

export function ExamForm() {
  return (
    <ActionForm action={createExamAction} submitLabel="Cadastrar concurso">
      <div className="form-grid">
        <label>
          Nome do concurso *
          <input name="name" required placeholder="Ex.: Concurso TRF 1ª Região" />
        </label>
        <label>
          Órgão
          <input name="organ" placeholder="Ex.: Tribunal Regional Federal" />
        </label>
        <label>
          Banca
          <input name="board" placeholder="Ex.: Cebraspe" />
        </label>
        <label>
          Cargo
          <input name="role" placeholder="Ex.: Analista Judiciário" />
        </label>
        <label>
          Data da prova
          <input name="examDate" type="date" />
        </label>
      </div>
    </ActionForm>
  );
}
