import { MutateForm } from "@/components/MutateForm";
import { formatDuration } from "@/lib/format";
import { linkSubjectsAction, unlinkSubjectsAction } from "../actions";
import type { Group } from "../utils/compare";

type Props = {
  group: Group;
  exams: { id: string; name: string }[];
};

const KIND_LABEL: Record<string, string> = {
  confirmed: "Vinculada por você",
  exact: "Mesmo nome",
  similar: "Parecida",
};

export function GroupCard({ group, exams }: Props) {
  const ids = group.members.map((m) => m.subjectId);
  const hidden = ids.map((id) => <input key={id} type="hidden" name="ids" value={id} />);

  return (
    <div className="compare-group">
      <div className="compare-head">
        <strong>{group.members[0].name}</strong>
        <span className={`badge-kind ${group.kind}`}>
          {KIND_LABEL[group.kind]}
          {group.kind === "similar" && group.similarity !== null ? ` · ${group.similarity}%` : ""}
        </span>

        {group.kind === "similar" && (
          <MutateForm action={linkSubjectsAction}>
            {hidden}
            <button type="submit" className="btn-small">
              São a mesma disciplina
            </button>
          </MutateForm>
        )}
        {group.kind === "confirmed" && (
          <MutateForm action={unlinkSubjectsAction}>
            {hidden}
            <button type="submit" className="btn-small">
              Desfazer vínculo
            </button>
          </MutateForm>
        )}
      </div>

      <div className="compare-cols" style={{ "--cols": exams.length } as React.CSSProperties}>
        {exams.map((exam) => {
          const members = group.members.filter((m) => m.examId === exam.id);
          return (
            <div key={exam.id} className={`compare-cell ${members.length === 0 ? "empty" : ""}`}>
              <span className="compare-exam">{exam.name}</span>
              {members.length === 0 ? (
                <span className="muted small">Não tem</span>
              ) : (
                members.map((m) => (
                  <div key={m.subjectId} className="compare-member">
                    <span>{m.name}</span>
                    <span className="muted small">
                      {m.topicsDone}/{m.topicsTotal} conteúdos · {formatDuration(m.studySeconds)} estudados
                    </span>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {group.topicsDistinct > 0 && (
        <p className="muted small compare-foot">
          {group.topicsCommon > 0
            ? `${group.topicsCommon} de ${group.topicsDistinct} conteúdos aparecem em mais de um concurso.`
            : `${group.topicsDistinct} conteúdo(s) cadastrado(s), nenhum repetido entre os concursos.`}
          {group.studySeconds > 0 && ` Tempo total estudado: ${formatDuration(group.studySeconds)}.`}
        </p>
      )}
    </div>
  );
}
