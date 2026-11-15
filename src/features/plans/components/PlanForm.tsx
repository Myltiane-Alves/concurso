import { ActionForm } from "@/components/ActionForm";
import { createPlanAction } from "../actions";

export function PlanForm() {
  return (
    <ActionForm action={createPlanAction} submitLabel="Criar ciclo">
      <label>
        Nome do ciclo *
        <input name="name" required placeholder="Ex.: Ciclo principal - TRF" />
      </label>
    </ActionForm>
  );
}
