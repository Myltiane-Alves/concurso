import type { Topic } from "@prisma/client";

export type TopicNode = Topic & { children: TopicNode[] };

export function buildTree(topics: Topic[]): TopicNode[] {
  const nodes = new Map<string, TopicNode>();
  for (const t of topics) nodes.set(t.id, { ...t, children: [] });

  const roots: TopicNode[] = [];
  for (const t of topics) {
    const node = nodes.get(t.id)!;
    const parent = t.parentId ? nodes.get(t.parentId) : undefined;
    (parent ? parent.children : roots).push(node);
  }
  return roots;
}

export function leafProgress(node: TopicNode): { done: number; total: number } {
  if (node.children.length === 0) {
    return { done: node.status === "DONE" ? 1 : 0, total: 1 };
  }
  return node.children.reduce(
    (acc, child) => {
      const p = leafProgress(child);
      return { done: acc.done + p.done, total: acc.total + p.total };
    },
    { done: 0, total: 0 }
  );
}
