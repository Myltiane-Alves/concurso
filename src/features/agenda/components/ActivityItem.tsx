import { CheckCircle2, Circle } from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";
import { MutateForm } from "@/components/MutateForm";
import { formatMinutes } from "@/lib/format";
import { deleteActivityAction, toggleActivityAction } from "../actions";

type Props = {
  activity: {
    id: string;
    title: string;
    minutes: number;
    done: boolean;
    subject: { name: string } | null;
  };
};

export function ActivityItem({ activity: a }: Props) {
  return (
    <div className={`activity ${a.done ? "is-done" : ""}`}>
      <MutateForm action={toggleActivityAction}>
        <input type="hidden" name="id" value={a.id} />
        <input type="hidden" name="done" value={String(!a.done)} />
        <button type="submit" className="check" title={a.done ? "Desmarcar" : "Marcar como feita"}>
          {a.done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
        </button>
      </MutateForm>

      <div className="activity-body">
        <span className="activity-title">{a.title}</span>
        <span className="muted small">
          {a.subject && a.subject.name !== a.title ? `${a.subject.name} · ` : ""}
          {formatMinutes(a.minutes)}
        </span>
      </div>

      <DeleteButton action={deleteActivityAction} fields={{ id: a.id }} message="Excluir esta atividade?" />
    </div>
  );
}
