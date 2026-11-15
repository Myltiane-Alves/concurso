export const ERROR_CATEGORIES = [
  { value: "NOT_KNOWN", label: "Não sabia o conteúdo" },
  { value: "FORGOT", label: "Esquecimento" },
  { value: "CONFUSION", label: "Confusão entre conceitos" },
  { value: "CARELESS", label: "Falta de atenção" },
  { value: "MISREAD", label: "Interpretação incorreta" },
] as const;

export const ERROR_CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  ERROR_CATEGORIES.map((c) => [c.value, c.label])
);
