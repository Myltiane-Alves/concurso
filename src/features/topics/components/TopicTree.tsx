import type { TopicStatus } from "@prisma/client";
import { DeleteButton } from "@/components/DeleteButton";
import { MutateForm } from "@/components/MutateForm";
import { deleteTopicAction, setTopicStatusAction } from "../actions";
import { leafProgress, type TopicNode } from "../utils/tree";

const NEXT: Record<TopicStatus, TopicStatus> = {
  NOT_STARTED: "IN_PROGRESS",
  IN_PROGRESS: "DONE",
  DONE: "NOT_STARTED",
};

const LABEL: Record<TopicStatus, string> = {
  NOT_STARTED: "Não iniciado",
  IN_PROGRESS: "Em andamento",
  DONE: "Concluído",
};

function Node({ node, subjectId }: { node: TopicNode; subjectId: string }) {
  const isLeaf = node.children.length === 0;
  const { done, total } = leafProgress(node);

  return (
    <li>
      <div className="topic-row">
        {node.code && <span className="topic-code">{node.code}</span>}
        <span className="topic-title">{node.title}</span>

        {isLeaf ? (
          <MutateForm action={setTopicStatusAction}>
            <input type="hidden" name="id" value={node.id} />
            <input type="hidden" name="subjectId" value={subjectId} />
            <input type="hidden" name="status" value={NEXT[node.status]} />
            <button type="submit" className={`status status-${node.status}`} title="Clique para alterar">
              {LABEL[node.status]}
            </button>
          </MutateForm>
        ) : (
          <span className="muted small">
            {done}/{total}
          </span>
        )}

        <DeleteButton
          action={deleteTopicAction}
          fields={{ id: node.id }}
          message={isLeaf ? "Excluir este conteúdo?" : "Excluir este conteúdo e todos os subtópicos?"}
        />
      </div>

      {node.children.length > 0 && (
        <ul className="topic-children">
          {node.children.map((child) => (
            <Node key={child.id} node={child} subjectId={subjectId} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TopicTree({ nodes, subjectId }: { nodes: TopicNode[]; subjectId: string }) {
  return (
    <ul className="topic-tree">
      {nodes.map((n) => (
        <Node key={n.id} node={n} subjectId={subjectId} />
      ))}
    </ul>
  );
}
