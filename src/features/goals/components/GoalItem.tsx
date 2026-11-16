"use client";

import { useState } from "react";
import { Pause, Pencil, Play } from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";
import { MutateForm } from "@/components/MutateForm";
import { deleteGoalAction, toggleGoalAction } from "../actions";
import { GoalForm } from "./GoalForm";
import { GoalProgress, type GoalView } from "./GoalProgress";

type Props = {
  goal: GoalView;
  subjects: { id: string; name: string; exam: { name: string } }[];
};

export function GoalItem({ goal, subjects }: Props) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="edit-box">
        <GoalForm subjects={subjects} goal={goal} onDone={() => setEditing(false)} />
        <button type="button" className="btn-small" onClick={() => setEditing(false)}>
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className={`goal-item ${goal.active ? "" : "is-paused"}`}>
      <div className="goal-main">
        <GoalProgress goal={goal} />
      </div>
      <div className="row-actions">
        <MutateForm action={toggleGoalAction}>
          <input type="hidden" name="id" value={goal.id} />
          <input type="hidden" name="active" value={String(!goal.active)} />
          <button
            type="submit"
            className="btn-icon neutral"
            title={goal.active ? "Pausar meta" : "Reativar meta"}
          >
            {goal.active ? <Pause size={16} /> : <Play size={16} />}
          </button>
        </MutateForm>
        <button type="button" className="btn-icon neutral" title="Editar" onClick={() => setEditing(true)}>
          <Pencil size={16} />
        </button>
        <DeleteButton action={deleteGoalAction} fields={{ id: goal.id }} message="Excluir esta meta?" />
      </div>
    </div>
  );
}
