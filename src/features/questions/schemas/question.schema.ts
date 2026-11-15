import { z } from "zod";
import { isValidISO } from "@/lib/dates";
import { optionalText } from "@/lib/zod";

const count = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `Informe ${label}` })
    .int("Use números inteiros")
    .min(0, "Não use valores negativos")
    .max(10000, "Valor muito alto");

export const questionSchema = z
  .object({
    subjectId: z.string().min(1, "Selecione a disciplina"),
    topicId: z
      .string()
      .optional()
      .transform((v) => v || undefined),
    board: optionalText(100),
    source: optionalText(200),
    date: z.string().refine(isValidISO, "Data inválida"),
    correct: count("os acertos"),
    wrong: count("os erros"),
    notes: optionalText(1000),
  })
  .refine((d) => d.correct + d.wrong >= 1, {
    message: "Informe ao menos uma questão",
    path: ["correct"],
  })
  .transform((d) => ({ ...d, total: d.correct + d.wrong }));

export type QuestionInput = z.infer<typeof questionSchema>;
