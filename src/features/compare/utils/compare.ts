export type CompareTopic = { id: string; title: string; status: string; parentId: string | null };

export type CompareSubjectInput = {
  id: string;
  examId: string;
  name: string;
  equivalenceId: string | null;
  studySeconds: number;
  topics: CompareTopic[];
};

export type CompareExamInput = { id: string; name: string; subjects: CompareSubjectInput[] };

export type Member = {
  subjectId: string;
  examId: string;
  name: string;
  topicsTotal: number;
  topicsDone: number;
  studySeconds: number;
};

/**
 * confirmed: o usuário vinculou · exact: mesmo nome (ignorando acentos e "Noções de")
 * similar: nome parecido, precisa de confirmação · unique: só existe em um concurso
 */
export type GroupKind = "confirmed" | "exact" | "similar" | "unique";

export type Group = {
  id: string;
  kind: GroupKind;
  similarity: number | null;
  members: Member[];
  examIds: string[];
  topicsCommon: number;
  topicsDistinct: number;
  studySeconds: number;
};

export type Comparison = {
  exams: {
    id: string;
    name: string;
    total: number;
    compatible: number;
    similar: number;
    exclusive: number;
    percent: number;
  }[];
  groups: Group[];
  summary: { total: number; distinct: number; saved: number; extraIfConfirmed: number };
};

const STOP_WORDS = new Set([
  "de", "da", "do", "das", "dos", "e", "em", "para", "no", "na", "nos", "nas", "a", "o", "as", "os",
  "nocoes", "nocao", "introducao", "fundamentos", "conhecimentos", "especificos", "gerais", "basico", "basica", "nivel",
]);

const ALIASES: [RegExp, string][] = [
  [/\blingua portuguesa\b/g, "portugues"],
  [/\bportuguesa\b/g, "portugues"],
];

const singular = (token: string) => (token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token);

/** Palavras relevantes do nome: sem acentos, sem "Noções de", "de", "do"... */
export function nameTokens(name: string): string[] {
  let text = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  for (const [pattern, replacement] of ALIASES) text = text.replace(pattern, replacement);

  const all = text.split(" ").filter(Boolean);
  const relevant = all.filter((t) => !STOP_WORDS.has(t));
  return (relevant.length > 0 ? relevant : all).map(singular);
}

const keyOf = (tokens: string[]) => [...new Set(tokens)].sort().join(" ");

function jaccard(a: Set<string>, b: Set<string>) {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / (a.size + b.size - shared);
}

function groupBy<T>(items: T[], keyFn: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, [...(map.get(key) ?? []), item]);
  }
  return map;
}

export const SIMILARITY_THRESHOLD = 0.6;

type S = CompareSubjectInput & { key: string; tokens: Set<string> };
type Build = {
  id: string;
  members: S[];
  kind: "confirmed" | "exact" | "similar" | "single";
  similarity: number | null;
};

export function compareExams(exams: CompareExamInput[]): Comparison {
  const flat: S[] = exams.flatMap((e) =>
    e.subjects.map((s) => {
      const tokens = nameTokens(s.name);
      return { ...s, tokens: new Set(tokens), key: keyOf(tokens) };
    })
  );

  const examIndex = new Map(exams.map((e, i) => [e.id, i]));
  const spansExams = (list: S[]) => new Set(list.map((s) => s.examId)).size > 1;

  // 1) Agrupa por vínculo do usuário e por nome igual (só entre concursos diferentes).
  const parent = new Map(flat.map((s) => [s.id, s.id]));
  const find = (x: string): string => {
    let root = x;
    while (parent.get(root) !== root) root = parent.get(root)!;
    return root;
  };
  const union = (a: string, b: string) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(rb, ra);
  };

  const confirmedLists: S[][] = [];
  for (const list of groupBy(flat.filter((s) => s.equivalenceId), (s) => s.equivalenceId!).values()) {
    if (list.length > 1 && spansExams(list)) {
      list.slice(1).forEach((s) => union(list[0].id, s.id));
      confirmedLists.push(list);
    }
  }
  for (const list of groupBy(flat, (s) => s.key).values()) {
    if (spansExams(list)) list.slice(1).forEach((s) => union(list[0].id, s.id));
  }

  const confirmedRoots = new Set(confirmedLists.map((l) => find(l[0].id)));
  const builds = new Map<string, Build>();
  for (const [root, members] of groupBy(flat, (s) => find(s.id))) {
    builds.set(root, {
      id: root,
      members,
      kind: spansExams(members) ? (confirmedRoots.has(root) ? "confirmed" : "exact") : "single",
      similarity: null,
    });
  }
  const groupOf = new Map<string, Build>();
  for (const b of builds.values()) b.members.forEach((m) => groupOf.set(m.id, b));

  // 2) Sugere disciplinas parecidas entre as que ficaram sozinhas.
  const candidates: { a: S; b: S; score: number }[] = [];
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      const a = flat[i];
      const b = flat[j];
      if (a.examId === b.examId) continue;
      if (groupOf.get(a.id)!.kind !== "single" || groupOf.get(b.id)!.kind !== "single") continue;
      const score = jaccard(a.tokens, b.tokens);
      if (score >= SIMILARITY_THRESHOLD) candidates.push({ a, b, score });
    }
  }
  candidates.sort((x, y) => y.score - x.score);

  for (const { a, b, score } of candidates) {
    const ga = groupOf.get(a.id)!;
    const gb = groupOf.get(b.id)!;
    if (ga === gb) continue;
    if (!["single", "similar"].includes(ga.kind) || !["single", "similar"].includes(gb.kind)) continue;

    const examsA = new Set(ga.members.map((m) => m.examId));
    if (gb.members.some((m) => examsA.has(m.examId))) continue;

    ga.members.push(...gb.members);
    ga.kind = "similar";
    ga.similarity = ga.similarity === null ? score : Math.min(ga.similarity, score);
    gb.members.forEach((m) => groupOf.set(m.id, ga));
    builds.delete(gb.id);
  }

  // 3) Monta o resultado.
  const order: Record<string, number> = { confirmed: 0, exact: 1, similar: 2, single: 3 };

  const groups: Group[] = [...builds.values()]
    .map((b): Group => {
      const members = [...b.members].sort(
        (x, y) => (examIndex.get(x.examId) ?? 0) - (examIndex.get(y.examId) ?? 0)
      );

      const outMembers: Member[] = members.map((m) => {
        const parents = new Set(m.topics.map((t) => t.parentId).filter(Boolean));
        const leaves = m.topics.filter((t) => !parents.has(t.id));
        return {
          subjectId: m.id,
          examId: m.examId,
          name: m.name,
          topicsTotal: leaves.length,
          topicsDone: leaves.filter((t) => t.status === "DONE").length,
          studySeconds: m.studySeconds,
        };
      });

      // Conteúdos (pelo título) que aparecem em mais de um concurso do grupo.
      const keysByExam = new Map<string, Set<string>>();
      for (const m of members) {
        const set = keysByExam.get(m.examId) ?? new Set<string>();
        m.topics.forEach((t) => set.add(keyOf(nameTokens(t.title))));
        keysByExam.set(m.examId, set);
      }
      const presence = new Map<string, number>();
      for (const set of keysByExam.values()) for (const k of set) presence.set(k, (presence.get(k) ?? 0) + 1);

      return {
        id: b.id,
        kind: b.kind === "single" ? "unique" : b.kind,
        similarity: b.similarity === null ? null : Math.round(b.similarity * 100),
        members: outMembers,
        examIds: [...new Set(members.map((m) => m.examId))],
        topicsCommon: [...presence.values()].filter((n) => n > 1).length,
        topicsDistinct: presence.size,
        studySeconds: outMembers.reduce((sum, m) => sum + m.studySeconds, 0),
      };
    })
    .sort(
      (x, y) =>
        order[x.kind === "unique" ? "single" : x.kind] - order[y.kind === "unique" ? "single" : y.kind] ||
        x.members[0].name.localeCompare(y.members[0].name, "pt-BR")
    );

  const examStats = exams.map((e) => {
    const mine = groups.flatMap((g) => g.members.filter((m) => m.examId === e.id).map(() => g.kind));
    const compatible = mine.filter((k) => k === "confirmed" || k === "exact").length;
    return {
      id: e.id,
      name: e.name,
      total: mine.length,
      compatible,
      similar: mine.filter((k) => k === "similar").length,
      exclusive: mine.filter((k) => k === "unique").length,
      percent: mine.length === 0 ? 0 : Math.round((compatible / mine.length) * 100),
    };
  });

  const total = flat.length;
  const distinct = groups.reduce(
    (sum, g) => sum + (g.kind === "confirmed" || g.kind === "exact" ? 1 : g.members.length),
    0
  );
  const extraIfConfirmed = groups
    .filter((g) => g.kind === "similar")
    .reduce((sum, g) => sum + g.members.length - 1, 0);

  return { exams: examStats, groups, summary: { total, distinct, saved: total - distinct, extraIfConfirmed } };
}
