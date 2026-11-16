"use client";

import { useState } from "react";
import { ActionForm } from "@/components/ActionForm";
import { saveGoalAction } from "../actions";
import { PERIOD_LABEL, TYPE_LABEL } from "../utils/labels";
import type { GoalPeriod, GoalType } from "../utils/progress";

type Props = {
  subjects: { id: string; name: string; exam: { name: string } }[];
  goal?: { id: string; type: GoalType; period: GoalPeriod; target: number; subjectId: string | null };
  onDone?: () => void;
};

export function GoalForm({ subjects, goal, onDone }: Props) {
  const [type, setType] = useState<GoalType>(goal?.type ?? "STUDY_TIME");
  const target = goal?.target ?? 0;

  return (
    <ActionForm action={saveGoalAction} submitLabel={goal ? "Salvar alterações" : "Criar meta"} onSuccess={onDone}>
      {goal && <input type="hidden" name="id" value={goal.id} />}

      <div className="form-grid">
        <label>
          Tipo de meta *
          <select name="type" value={type} onChange={(e) => setType(e.target.value as GoalType)}>
            {(Object.keys(TYPE_LABEL) as GoalType[]).map((t) => (
              <option key={t} value={t}>
                {TYPE_LABEL[t]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Período *
          <select name="period" defaultValue={goal?.period ?? "DAILY"}>
            {(Object.keys(PERIOD_LABEL) as GoalPeriod[]).map((p) => (
              <option key={p} value={p}>
                {PERIOD_LABEL[p]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Disciplina
          <select name="subjectId" defaultValue={goal?.subjectId ?? ""}>
            <option value="">Todas as disciplinas</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.exam.name})
              </option>
            ))}
          </select>
        </label>

        {type === "STUDY_TIME" ? (
          <>
            <label>
              Horas
              <input
                name="hours"
                type="number"
                min={0}
                max={744}
                defaultValue={goal?.type === "STUDY_TIME" ? Math.floor(target / 60) : 2}
              />
            </label>
            <label>
              Minutos
              <input
                name="minutes"
                type="number"
                min={0}
                max={59}
                defaultValue={goal?.type === "STUDY_TIME" ? target % 60 : 0}
              />
            </label>
          </>
        ) : (
          <label>
            Quantidade de questões
            <input
              name="questions"
              type="number"
              min={1}
              max={10000}
              defaultValue={goal?.type === "QUESTIONS" ? target : 30}
            />
          </label>
        )}
      </div>
    </ActionForm>
  );
}
