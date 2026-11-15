const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

/** Busca os dados de uma tela e converte datas ISO (com horário) de volta para Date. */
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`/api/view/${path}`, { credentials: "same-origin" });

  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Sessão expirada");
  }

  const text = await res.text();

  if (!res.ok) {
    let message = "Erro ao carregar os dados";
    try {
      message = JSON.parse(text).message ?? message;
    } catch {
      // resposta sem JSON: mantém a mensagem padrão
    }
    throw new Error(message);
  }

  return JSON.parse(text, (_key, value) =>
    typeof value === "string" && ISO_DATE_TIME.test(value) ? new Date(value) : value
  ) as T;
}
