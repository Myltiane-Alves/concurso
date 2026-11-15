import { ArrowDown, ArrowUp, CheckCircle2, Circle } from "lucide-react";
import { DeleteButton } from "@/components/DeleteButton";
import { MutateForm } from "@/components/MutateForm";
import { formatMinutes } from "@/lib/format";
import { moveItemAction, removeItemAction, toggleItemAction } from "../actions";

type Props = {
  index: number;
  isNext: boolean;
  isFirst: boolean;
  isLast: boolean;
  item: {
    id: string;
    minutes: number;
    doneInRound: boolean;
    subject: { name: string; exam: { name: string } };
  };
};

export function CycleItemRow({ index, isNext, isFirst, isLast, item }: Props) {
  return (
    <li className={`cycle-item ${item.doneInRound ? "is-done" : ""} ${isNext ? "is-next" : ""}`}>
      <span className="cycle-index">{index + 1}</span>

      <MutateForm action={toggleItemAction}>
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="done" value={String(!item.doneInRound)} />
        <button
          type="submit"
          className="check"
          title={item.doneInRound ? "Desmarcar bloco" : "Marcar bloco como concluído"}
        >
          {item.doneInRound ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>
      </MutateForm>

      <div className="cycle-main">
        <strong>{item.subject.name}</strong>
        <span className="muted small">
          {item.subject.exam.name} · {formatMinutes(item.minutes)}
          {isNext && <span className="badge-next">Próximo</span>}
        </span>
      </div>

      <div className="row-actions">
        <MutateForm action={moveItemAction}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="direction" value="up" />
          <button type="submit" className="btn-icon neutral" disabled={isFirst} title="Subir">
            <ArrowUp size={16} />
          </button>
        </MutateForm>
        <MutateForm action={moveItemAction}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="direction" value="down" />
          <button type="submit" className="btn-icon neutral" disabled={isLast} title="Descer">
            <ArrowDown size={16} />
          </button>
        </MutateForm>
        <DeleteButton action={removeItemAction} fields={{ id: item.id }} message="Remover este bloco do ciclo?" />
      </div>
    </li>
  );
}
