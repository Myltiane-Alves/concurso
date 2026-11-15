export type ParsedTopic = { code: string; title: string; parentCode: string | null };

const clean = (s: string) => s.replace(/\s+/g, " ").replace(/[.;\s]+$/, "").trim();

/**
 * Converte o texto do edital em tópicos hierárquicos pela numeração.
 * Aceita uma linha por item ou tudo corrido, ex.:
 * "1 Noções de organização administrativa. 1.1 Centralização, descentralização"
 */
export function parseEditalText(text: string): ParsedTopic[] {
  const normalized = text
    .replace(/\r/g, "")
    .replace(/(?<=[.;])[ \t]+(?=\d+(?:\.\d+)+\.?[ \t]+\S)/g, "\n")
    .replace(/(?<=[.;])[ \t]+(?=\d+\.?[ \t]+[A-ZÀ-Ú])/g, "\n");

  const items: ParsedTopic[] = [];

  for (const raw of normalized.split("\n")) {
    const line = raw.trim();
    if (!line) continue;

    const match = line.match(/^(\d+(?:\.\d+)*)\.?\s+(.+)$/);
    if (match) {
      const code = match[1];
      const parts = code.split(".");
      items.push({
        code,
        title: clean(match[2]),
        parentCode: parts.length > 1 ? parts.slice(0, -1).join(".") : null,
      });
    } else if (items.length > 0) {
      const last = items[items.length - 1];
      last.title = clean(`${last.title} ${line}`);
    }
  }

  return items;
}
